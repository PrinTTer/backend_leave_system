import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  Assistants,
  CreateFactFormDto,
  Expenses,
  ExtendLeaves,
  Status,
  TravelDetails,
} from './dto/create-fact-form.dto';
import { FactLeaveCreditService } from 'src/fact-leave-credit/fact-leave-credit.service';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateFactFormDto } from './dto/update-fact-form.dto';
import { ApprovalMock } from 'src/mock/approval.mock';
import { UserMock } from 'src/mock/user.mock';
import { fact_form_status } from '@prisma/client';

export interface FactLeaveCreditResult {
  leave_credit_id?: number;
  nontri_account: string;
  leave_type_id: number;
  used_leave: number;
  annual_leave: number;
  left_leave: number;
  skip?: boolean;
}

export interface LeaveType {
  leave_type_id: number; // PK int
  name: string; // varchar(100)
  gender: 'male' | 'female' | 'all'; // enum
  is_count_vacation: boolean; // tinyint(1)
  service_year: number; // int
  number_approver: number; // int
  category: 'general' | 'vacation'; // enum
  update_at: Date; // timestamp
  create_at: Date; // timestamp
  max_leave: number; // int
}

export interface FactFormJson {
  nontri_account: number;
  leave_type_id: number;

  start_date: string;
  end_date: string;

  total_day: number;
  fiscal_year: number;

  status?: Status;
  note?: string;

  assistants?: Assistants[];
  countries?: string[];
  provinces?: string[];

  reason?: string;

  extend_leaves?: ExtendLeaves[];

  expenses?: Expenses;

  travel_details?: TravelDetails;

  attachment?: string;

  leave_type?: LeaveType;
  approvers?: Approval;

  [key: string]: any;
}

export interface Approval {
  nontri_account: string;
  other_prefix: string;
  prefix: string;
  fullname: string;
  gender: string;
  position: string;
  faculty: string;
  department: string;
  employment_start_date: string;
}

export interface ApprovalConfig {
  id: number;
  nontri_account: number;
  user: Approval;
  approver_order1: Approval[];
  approver_order2: Approval[];
  approver_order3: Approval[];
  approver_order4: Approval[];
}

@Injectable()
export class FactFormService {
  constructor(
    private prisma: PrismaService,
    private factLeaveCreditService: FactLeaveCreditService,
  ) {}

  private saveJsonToFile(nontri_account: string, leave_type_id: number, data: any) {
    const dir = path.join(process.cwd(), 'uploads/leave_json/', String(nontri_account));

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const timestamp = Date.now(); // <= จุดสำคัญ!
    const fileName = `${nontri_account}_${leave_type_id}_${timestamp}.json`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return fileName;
  }

  private async getApprover(leaveTypeId: number, leaveDays: number, nontri_account: string) {
    // 1) หา rule ระดับสูงสุดที่ตรง
    const rule = await this.prisma.leave_approval_rule.findFirst({
      where: {
        leave_type_id: leaveTypeId,
        leave_less_than: { gte: leaveDays },
      },
      orderBy: { leave_less_than: 'asc' },
    });

    if (!rule) return [];

    const maxLevel = rule.approval_level;

    // 2) หา config ของ user
    const config = ApprovalMock.list.find((a) => a.nontri_account === nontri_account);

    if (!config) {
      throw new Error(`No approver config found for nontri_account=${nontri_account}`);
    }

    // 3) รวม approver ทุก level ที่ต้องใช้
    const approvers: Approval[] = [];

    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      const key = `approver_order${lvl}` as keyof ApprovalConfig;
      const approverList = config[key] as Approval[];
      approvers.push(...approverList);
    }

    if (approvers.length === 0) {
      throw new Error(`No approvers found for nontri_account=${nontri_account}`);
    }

    return approvers;
  }

  async createLeave(dto: CreateFactFormDto) {
    const leaveType = await this.prisma.leave_type.findUnique({
      where: {
        leave_type_id: dto.leave_type_id,
      },
    });

    const approval = await this.getApprover(
      leaveType?.leave_type_id || 1,
      dto.total_day,
      dto.nontri_account,
    );

    if (approval.length === 0) {
      throw new Error(`No approvers found for nontri_account=${dto.nontri_account}`);
    }
    console.log('approval', approval);

    const leaveForm = {
      ...dto,
      leaveType,
      approvers: approval.map((a) => [
        {
          id: a.nontri_account,
          name: a.fullname,
        },
        {
          status: dto.status || Status.Pending,
        },
      ]),
    };

    // 2) สรุปจำนวนวันลาตามประเภท
    let creditPayload = [
      {
        leave_type_id: dto.leave_type_id,
        used_leave: dto.total_day,
      },
    ];

    if (dto.extend_leaves && dto.extend_leaves.length > 0) {
      creditPayload = creditPayload.concat(
        dto.extend_leaves.map((el) => ({
          leave_type_id: el.leave_type_id,
          used_leave: el.total_days,
        })),
      );
    }

    // 3) อัปเดต fact_leave_credit
    await this.factLeaveCreditService.update(dto.nontri_account, creditPayload);

    const jsonPath = this.saveJsonToFile(dto.nontri_account, dto.leave_type_id, leaveForm);

    const form = await this.prisma.fact_form.create({
      data: {
        nontri_account: dto.nontri_account,
        leave_type_id: dto.leave_type_id,
        start_date: new Date(dto.start_date),
        end_date: new Date(dto.end_date),

        total_day: dto.total_day,
        fiscal_year: dto.fiscal_year,
        status: dto.status || Status.Pending,
        approve_date: new Date(),
        note: dto.note,
        file_leave: jsonPath,
        update_at: new Date(),
      },
    });

    if (dto.status === Status.Pending) {
      for (const a of approval) {
        await this.prisma.approval.create({
          data: {
            approver_nontri_account: a.nontri_account,
            nontri_account: dto.nontri_account,
            fact_form_id: form.fact_form_id,
            status: Status.Pending,
          },
        });
      }
    }

    if (dto.attachment?.data) {
      const base64Data = dto.attachment.data.split(';base64,').pop();

      if (!base64Data) {
        throw new Error('Invalid base64 data');
      }

      const fileName = form.file_leave.replace(/\.json$/i, '');

      const dirPath = `uploads/leave_json/${dto.nontri_account}/attachment_${fileName}`;

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(`${dirPath}/${dto.attachment.fileName}`, Buffer.from(base64Data, 'base64'));
    }

    return {
      ...leaveForm,
      form,
    };
  }

  private readJsonFile(nontri_account: string, fileName: string) {
    const filePath = path.join(
      process.cwd(),
      'uploads/leave_json/',
      String(nontri_account),
      fileName,
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`JSON file not found: ${fileName}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as FactFormJson;
  }

  private updateJsonFile(nontri_account: string, fileName: string, newData: any) {
    const filePath = path.join(
      process.cwd(),
      'uploads/leave_json/',
      String(nontri_account),
      fileName,
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`JSON file not found: ${fileName}`);
    }

    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    return true;
  }

  async updateFactForm(nontri_account: string, fact_form_id: number, data: UpdateFactFormDto) {
    const factForm = await this.prisma.fact_form.findUnique({
      where: { fact_form_id },
    });

    if (!factForm) throw new Error(`Fact form id: ${fact_form_id} not found!`);

    const oldJson = this.readJsonFile(nontri_account, factForm.file_leave);
    const newJson = { ...oldJson, ...data };
    this.updateJsonFile(nontri_account, factForm.file_leave, newJson);

    await this.factLeaveCreditService.updateEditLeave(
      nontri_account,
      data.leave_type_id,
      oldJson.total_day,
      newJson.total_day,
    );

    if (data.extend_leaves && data.extend_leaves.length > 0) {
      const oldExtend = oldJson.extend_leaves ?? [];

      for (let i = 0; i < data.extend_leaves.length; i++) {
        const newItem = data.extend_leaves[i];

        const newDay = newItem.total_days;

        const oldDay = oldExtend[i]?.total_days ?? 0;

        await this.factLeaveCreditService.updateEditLeave(
          nontri_account,
          newItem.leave_type_id,
          oldDay,
          newDay,
        );
      }
    }

    const updateLeaveForm = await this.prisma.fact_form.update({
      where: { fact_form_id },
      data: {
        nontri_account: data.nontri_account,
        leave_type_id: data.leave_type_id,
        start_date: new Date(data.start_date + 'T00:00:00.000Z'),
        end_date: new Date(data.end_date + 'T00:00:00.000Z'),
        total_day: data.total_day,
        fiscal_year: data.fiscal_year,
        status: data.status || Status.Pending,
        approve_date: new Date(),
        note: data.note,
        update_at: new Date(),
        file_leave: factForm.file_leave,
      },
    });

    const file = this.readJsonFile(nontri_account, factForm.file_leave);

    return {
      updateLeaveForm,
      file,
    };
  }

  async findOneFactForm(fact_form_id: number) {
    const factForm = await this.prisma.fact_form.findUnique({
      where: {
        fact_form_id,
      },
    });

    if (!factForm) throw new Error('Can not find fact form');
    const form = this.readJsonFile(factForm?.nontri_account, factForm.file_leave);
    const user = UserMock.list.filter((u) => u.nontri_account === factForm.nontri_account);

    return {
      ...factForm,
      form,
      user,
    };
  }

  async getLeavesForCalendar(viewer_nontri_account: string, start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // 1) หา targetIds จาก leave_visibility
    const visibility = await this.prisma.leave_visibility.findMany({
      where: {
        viewer_nontri_account,
      },
    });

    const targetIds = visibility.map((v) => v.target_nontri_account);

    // ให้คนดูเห็นใบลาของตัวเองเสมอ
    if (!targetIds.includes(viewer_nontri_account)) {
      targetIds.push(viewer_nontri_account);
    }

    if (targetIds.length === 0) {
      return [];
    }

    // 2) ดึง fact_form ของ user เหล่านั้น ที่ approve แล้ว และอยู่ในช่วงวัน
    const forms = await this.prisma.fact_form.findMany({
      where: {
        nontri_account: { in: targetIds },
        status: fact_form_status.approve, // หรือ Status.Approve ถ้าคุณ map เป็น enum TS เอง
        // overlap ช่วงวันที่ กับ calendar range
        AND: [{ start_date: { lte: endDate } }, { end_date: { gte: startDate } }],
      },
      include: {
        leave_type: true,
      },
    });

    // 3) map เป็นรูปแบบ event ที่ frontend ใช้ง่าย
    return forms.map((f) => ({
      fact_form_id: f.fact_form_id,
      nontri_account: f.nontri_account,
      title: f.leave_type.name, // ชื่อประเภทการลา
      start: f.start_date,
      end: f.end_date,
      status: f.status,
      leave_type_id: f.leave_type_id,
      total_day: f.total_day,
    }));
  }
}
