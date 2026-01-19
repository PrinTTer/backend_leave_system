import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateFactFormDto, Status } from './dto/create-fact-form.dto';
import { FactLeaveCreditService } from 'src/fact-leave-credit/fact-leave-credit.service';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateFactFormDto } from './dto/update-fact-form.dto';
import { ApprovalMock } from 'src/mock/approval.mock';
import { UserMock } from 'src/mock/user.mock';
import { fact_form_status } from '@prisma/client';
import {
  Assistants,
  ExtendLeaves,
  Expenses,
  TravelDetails,
  CreateOfficialDutyFactFormDto,
} from './dto/create-officialduty-fact-form.dto';
import { LeaveCategory } from 'src/leave-type/dto/create-leave-type.dto';
import { SearchFactformDto } from './dto/search-fact-form.dto';
import { updateOfficialdutyFactForm } from './dto/update-officialduty-fact-form.dto';

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

export interface AttachmentPayload {
  fileName: string;
  fileType: string;
  data: string;
}

export interface AttachmentStored {
  fileName: string;
  fileType: string;
  storedFileName: string;
  relativePath: string;
}

export interface FactFormJson {
  fact_form_id?: number;
  file_leave: string;
  nontri_account: number;
  leave_type_id?: number;

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

  attachment?: AttachmentStored;
  leave_aboard?: string;

  leave_type: LeaveType;
  approvers: Array<
    [
      {
        nontri_account: string;
        other_prefix: string;
        prefix: string;
        fullname: string;
        gender: string;
        position: string;
        faculty: string;
        department: string;
        employment_start_date: string;
      },
      {
        status: string;
      },
    ]
  >;
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
  nontri_account: string;
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

    console.log('all approver', config);

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

    const leaveForm = {
      ...dto,
      leave_type: leaveType,
      approvers: approval.map((a) => [
        {
          ...a,
        },
        {
          status: dto.status || Status.Pending,
        },
      ]),
    };

    // 2) สรุปจำนวนวันลาตามประเภท
    const creditPayload = [
      {
        leave_type_id: dto.leave_type_id,
        used_leave: dto.total_day,
      },
    ];

    // 2) อัปเดต fact_leave_credit
    if (dto.status === Status.Approve) {
      await this.factLeaveCreditService.update(dto.nontri_account, creditPayload);
    }

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

    const newData = {
      ...form,
      ...leaveForm,
    };

    this.updateJsonFile(dto.nontri_account, jsonPath, newData);

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

    let storedAttachment: AttachmentStored | undefined;

    if (dto.attachment?.data) {
      storedAttachment = this.saveAttachmentAndReplaceOld(
        dto.nontri_account,
        form.file_leave,
        dto.attachment,
      );
    }

    const newdata = {
      ...leaveForm,
      ...form,
      attachment: storedAttachment,
    };

    this.updateJsonFile(dto.nontri_account, jsonPath, newdata);

    return {
      ...leaveForm,
      form,
    };
  }

  async createOfficialdutyLeave(dto: CreateOfficialDutyFactFormDto) {
    const leaveType = await this.prisma.leave_type.findFirst({
      where: {
        category: LeaveCategory.OFFICIALDUTY,
      },
    });

    const rule = await this.prisma.leave_approval_rule.findFirst({
      where: {
        leave_type_id: leaveType?.leave_type_id || 6,
      },
      orderBy: { leave_less_than: 'asc' },
    });

    if (!rule) return [];
    const maxLevel = rule.approval_level;

    const config = ApprovalMock.list.find((a) => a.nontri_account === dto.nontri_account);

    if (!config) {
      throw new Error(`No approver config found for nontri_account=${dto.nontri_account}`);
    }

    // 3) รวม approver ทุก level ที่ต้องใช้
    const approval: Approval[] = [];

    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      const key = `approver_order${lvl}` as keyof ApprovalConfig;
      const approverList = config[key] as Approval[];
      approval.push(...approverList);
    }

    if (approval.length === 0) {
      throw new Error(`No approvers found for nontri_account=${dto.nontri_account}`);
    }

    const leaveForm = {
      ...dto,
      leave_type: leaveType,
      approvers: approval.map((a) => [
        {
          ...a,
        },
        {
          status: dto.status || Status.Pending,
        },
      ]),
    };

    // 2) สรุปจำนวนวันลาตามประเภท
    let creditPayload = [
      {
        leave_type_id: leaveType?.leave_type_id || 6,
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

    // 2) อัปเดต fact_leave_credit
    if (dto.status === Status.Approve) {
      await this.factLeaveCreditService.update(dto.nontri_account, creditPayload);
    }

    const jsonPath = this.saveJsonToFile(
      dto.nontri_account,
      leaveType?.leave_type_id || 6,
      leaveForm,
    );

    const form = await this.prisma.fact_form.create({
      data: {
        nontri_account: dto.nontri_account,
        leave_type_id: leaveType?.leave_type_id || 6,
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

    const newData = {
      ...form,
      ...leaveForm,
    };

    this.updateJsonFile(dto.nontri_account, jsonPath, newData);

    // if (dto.status === Status.Pending) {
    //   for (const a of approval) {
    //     await this.prisma.approval.create({
    //       data: {
    //         approver_nontri_account: a.nontri_account,
    //         nontri_account: dto.nontri_account,
    //         fact_form_id: form.fact_form_id,
    //         status: Status.Pending,
    //       },
    //     });
    //   }
    // }

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

  async updateOfficialdutyLeaveFactForm(
    nontri_account: string,
    fact_form_id: number,
    data: updateOfficialdutyFactForm,
  ) {
    const factForm = await this.prisma.fact_form.findUnique({
      where: { fact_form_id },
    });

    if (!factForm) throw new Error(`Fact form id: ${fact_form_id} not found!`);

    const oldJson = this.readJsonFile(nontri_account, factForm.file_leave);

    let storedAttachment = oldJson.attachment;

    if (data.attachment?.data) {
      storedAttachment = this.saveAttachmentAndReplaceOld(
        nontri_account,
        factForm.file_leave,
        data.attachment,
      );
    }

    const newJson = {
      ...oldJson,
      ...data,
      attachment: storedAttachment,
    };

    this.updateJsonFile(nontri_account, factForm.file_leave, newJson);

    // if (data.status === Status.Approve) {
    //   await this.factLeaveCreditService.updateEditLeave(
    //     nontri_account,
    //     data.leave_type_id,
    //     oldJson.total_day,
    //     newJson.total_day,
    //   );
    // }

    const startDate = new Date(data.start_date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(data.end_date);
    endDate.setUTCHours(0, 0, 0, 0);

    const updateLeaveForm = await this.prisma.fact_form.update({
      where: { fact_form_id },
      data: {
        nontri_account: data.nontri_account,
        leave_type_id: factForm.leave_type_id,
        start_date: startDate,
        end_date: endDate,
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
    const attachmentBase64 = this.readAttachmentAsBase64(file.attachment);

    return {
      updateLeaveForm,
      file: {
        ...file,
        attachment: attachmentBase64
          ? { ...file.attachment, data: attachmentBase64 }
          : file.attachment,
      },
    };
  }

  async updateFactForm(
    nontri_account: string,
    fact_form_id: number,
    data: UpdateFactFormDto | updateOfficialdutyFactForm,
  ) {
    const factForm = await this.prisma.fact_form.findUnique({
      where: { fact_form_id },
    });

    if (!factForm) throw new Error(`Fact form id: ${fact_form_id} not found!`);

    const oldJson = this.readJsonFile(nontri_account, factForm.file_leave);

    let storedAttachment = oldJson.attachment;

    if (data.attachment?.data) {
      storedAttachment = this.saveAttachmentAndReplaceOld(
        nontri_account,
        factForm.file_leave,
        data.attachment,
      );
    }

    const newJson = {
      ...oldJson,
      ...data,
      attachment: storedAttachment,
    };

    this.updateJsonFile(nontri_account, factForm.file_leave, newJson);

    if (data.status === Status.Approve) {
      await this.factLeaveCreditService.updateEditLeave(
        nontri_account,
        factForm.leave_type_id,
        oldJson.total_day,
        newJson.total_day,
      );
    }

    const startDate = new Date(data.start_date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(data.end_date);
    endDate.setUTCHours(0, 0, 0, 0);

    const updateLeaveForm = await this.prisma.fact_form.update({
      where: { fact_form_id },
      data: {
        nontri_account: data.nontri_account,
        leave_type_id: factForm.leave_type_id,
        start_date: startDate,
        end_date: endDate,
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
    const attachmentBase64 = this.readAttachmentAsBase64(file.attachment);

    return {
      updateLeaveForm,
      file: {
        ...file,
        attachment: attachmentBase64
          ? { ...file.attachment, data: attachmentBase64 }
          : file.attachment,
      },
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

    const attachmentBase64 = this.readAttachmentAsBase64(form.attachment);

    return {
      user,
      form: {
        ...factForm,
        ...form,
        attachment: attachmentBase64
          ? { ...form.attachment, data: attachmentBase64 }
          : form.attachment,
      },
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
      title: f.leave_type.name,
      start: f.start_date,
      end: f.end_date,
      status: f.status,
      leave_type_id: f.leave_type_id,
      total_day: f.total_day,
    }));
  }

  async searchFactformFromJson(nontri_account: string, dto: SearchFactformDto) {
    const files = this.readAllJsonFiles(nontri_account);
    const factFormMap = await this.getFactFormMap(nontri_account);

    const fiscal_year = dto.fiscal_year ? Number(dto.fiscal_year) : undefined;

    const leave_type_id = dto.leave_type_id ? Number(dto.leave_type_id) : undefined;

    const filtered = files.filter((item) => {
      if (fiscal_year && item.fiscal_year !== fiscal_year) {
        return false;
      }

      if (leave_type_id && item.leave_type_id !== leave_type_id) {
        return false;
      }

      if (dto.search && !this.matchSearch(item, dto.search)) {
        return false;
      }

      return true;
    });

    return filtered.map((item) => {
      const dbRecord = factFormMap.get(item.file_leave);

      return this.mapToTableRow(item, dbRecord);
    });
  }

  private readAllJsonFiles(nontri_account: string): FactFormJson[] {
    const dirPath = path.join(process.cwd(), 'uploads/leave_json', String(nontri_account));

    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = fs.readdirSync(dirPath);

    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => this.readJsonFile(nontri_account, file));
  }

  private mapToTableRow(
    json: FactFormJson,
    db?: {
      fact_form_id: number;
      status: string;
      approve_date: Date | null;
      update_at: Date;
      create_at: Date;
    },
  ) {
    return {
      fact_form_id: db?.fact_form_id ?? null,
      leave_type: json.leave_type,
      start_date: json.start_date,
      end_date: json.end_date,
      total_day: json.total_day,

      status: db?.status ?? json.status,
      approve_date: db?.approve_date ?? null,
      leave_aboard: json.leave_aboard ?? '-',

      approver1: json.approvers?.[0],
      approver2: json.approvers?.[1],
      approver3: json.approvers?.[2],
      approver4: json.approvers?.[3],

      remark: json.note ?? '-',

      create_at: db?.create_at ?? null,
      update_at: db?.update_at ?? null,
    };
  }

  private matchSearch(item: FactFormJson, keyword: string): boolean {
    const search = keyword.toLowerCase();

    const STATUS_TH_MAP: Record<string, string> = {
      pending: 'รอดำเนินการ',
      approved: 'อนุมัติ',
      rejected: 'ไม่อนุมัติ',
      cancel: 'ยกเลิก',
    };
    const statusTh = item.status ? (STATUS_TH_MAP[item.status] ?? '') : '';

    const searchableFields: Array<string | number | undefined> = [
      item.leave_type?.name,
      item.status,
      statusTh,
      item.reason,
      item.total_day,
      item.start_date,
      item.end_date,
      item.file_leave,
      ...item.approvers.flatMap((a) => a[0]?.fullname),
    ];

    return searchableFields.some((field) =>
      String(field ?? '')
        .toLowerCase()
        .includes(search),
    );
  }

  private async getFactFormMap(nontri_account: string) {
    const records = await this.prisma.fact_form.findMany({
      where: { nontri_account },
      select: {
        fact_form_id: true,
        file_leave: true,
        status: true,
        approve_date: true,
        update_at: true,
        create_at: true,
      },
    });

    return new Map(records.map((r) => [r.file_leave, r]));
  }

  private getAttachmentDir(nontri_account: string, file_leave: string): string {
    // 1) ตัด .json ออกเพื่อเอาเป็นชื่อชุดไฟล์แนบ
    const baseName = file_leave.replace(/\.json$/i, '');

    // 2) เก็บ attachment แยกโฟลเดอร์ตาม form (กันชนกัน)
    return path.join(
      process.cwd(),
      'uploads/leave_json',
      String(nontri_account),
      `attachment_${baseName}`,
    );
  }

  private ensureDir(dirPath: string): void {
    // ถ้าไม่มีโฟลเดอร์ให้สร้าง
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private removeDirIfExists(dirPath: string): void {
    // ถ้ามีโฟลเดอร์เก่าให้ลบทิ้งทั้งก้อน (รูปเก่าจะหายหมด)
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  private extractBase64Data(dataUrl: string): Buffer {
    // data:image/jpeg;base64,xxxx -> เอาเฉพาะ xxxx
    const base64Part = dataUrl.split(';base64,').pop();
    if (!base64Part) {
      throw new Error('Invalid base64 data');
    }
    return Buffer.from(base64Part, 'base64');
  }

  private saveAttachmentAndReplaceOld(
    nontri_account: string,
    file_leave: string,
    attachment: AttachmentPayload,
  ): AttachmentStored {
    // 1) หาโฟลเดอร์ของ attachment ตาม form
    const dirPath = this.getAttachmentDir(nontri_account, file_leave);

    // 2) ลบรูปเก่าทิ้งทั้งหมดก่อน (ตาม requirement เธอ)
    this.removeDirIfExists(dirPath);

    // 3) สร้างโฟลเดอร์ใหม่
    this.ensureDir(dirPath);

    // 4) แปลง base64 เป็น binary buffer
    const buffer = this.extractBase64Data(attachment.data);

    // 5) path ของไฟล์ใหม่
    const fullPath = path.join(dirPath, attachment.fileName);

    // 6) เขียนไฟล์ลงดิสก์
    fs.writeFileSync(fullPath, buffer);

    // 7) คืนค่า meta เพื่อเก็บลง JSON (ไม่เก็บ base64)
    const relativePath = path.join(
      'uploads/leave_json',
      String(nontri_account),
      path.basename(dirPath),
      attachment.fileName,
    );

    return {
      fileName: attachment.fileName,
      fileType: attachment.fileType,
      storedFileName: attachment.fileName,
      relativePath,
    };
  }

  private readAttachmentAsBase64(
    stored?: AttachmentStored | { data?: string; fileType?: string },
  ): string | null {
    if (!stored) return null;

    if ('data' in stored && typeof stored.data === 'string') {
      return stored.data;
    }

    if (!('relativePath' in stored) || !stored.relativePath) {
      return null;
    }

    const absPath = path.join(process.cwd(), stored.relativePath);

    if (!fs.existsSync(absPath)) return null;

    const fileBuffer = fs.readFileSync(absPath);
    const base64 = fileBuffer.toString('base64');

    return `data:${stored.fileType};base64,${base64}`;
  }

  async cancelLeaveForm(fact_form_id: number) {
    const factForm = await this.prisma.fact_form.findUnique({
      where: { fact_form_id },
    });

    if (!factForm) throw new Error(`Fact form id: ${fact_form_id} not found!`);

    await this.prisma.fact_form.update({
      where: { fact_form_id },
      data: { status: Status.Cancel },
    });

    const oldJson = this.readJsonFile(factForm.nontri_account, factForm.file_leave);

    const newJson = {
      ...oldJson,
      status: Status.Cancel,
    };

    this.updateJsonFile(factForm.nontri_account, factForm.file_leave, newJson);

    if ((factForm.status as string) === Status.Approve) {
      await this.factLeaveCreditService.updateCancelLeave(
        factForm.nontri_account,
        factForm.leave_type_id,
        factForm.total_day,
      );
    }
  }
}
