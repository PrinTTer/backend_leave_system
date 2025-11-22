import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateFactFormDto, Status } from './dto/create-fact-form.dto';
import { FactLeaveCreditService } from 'src/fact-leave-credit/fact-leave-credit.service';
import * as fs from 'fs';
import * as path from 'path';
import { ApproverMock } from 'src/mock/approver.mock';

export interface FactLeaveCreditResult {
  leave_credit_id?: number;
  user_id: number;
  leave_type_id: number;
  used_leave: number;
  annual_leave: number;
  left_leave: number;
  skip?: boolean;
}

@Injectable()
export class FactFormService {
  constructor(
    private prisma: PrismaService,
    private factLeaveCreditService: FactLeaveCreditService,
  ) {}

  private saveJsonToFile(userId: number, leave_type_id: number, data: any) {
    const dir = path.join(process.cwd(), 'uploads/leave_json/', String(userId));

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const timestamp = Date.now(); // <= จุดสำคัญ!
    const fileName = `${userId}_${leave_type_id}_${timestamp}.json`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return fileName;
  }

  private async getApprover(leaveTypeId: number, leaveDays: number) {
    // 1) ดึง rule
    const rules = await this.prisma.leave_approval_rule.findMany({
      where: {
        leave_type_id: leaveTypeId,
        leave_less_than: {
          gte: leaveDays,
        },
      },
      orderBy: { leave_less_than: 'asc' },
    });

    // ถ้าไม่เจอกฎเลย → ไม่มี approver
    if (rules.length === 0) return [];

    // 2) เลือก rule ที่น้อยที่สุด (ลาพักร้อน 10 วัน → ใช้ 15)
    const rule = rules[0];

    // rule.approval_level = order ขั้นตอนที่ต้องอนุมัติ
    const order = rule.approval_level;

    // 3) หา approver จาก mock โดยเช็คว่า approvalOrder มีเลขนี้
    const approvers = ApproverMock.list.filter((person) => {
      const personOrders = person.approval_order.map((ao) => ao.priority);
      return personOrders.includes(order);
    });

    return approvers;
  }

  async createLeave(dto: CreateFactFormDto) {
    const leaveType = await this.prisma.leave_type.findUnique({
      where: {
        leave_type_id: dto.leave_type_id,
      },
    });

    const approval = await this.getApprover(leaveType?.number_approver || 1, dto.total_day);

    const leaveForm = {
      ...dto,
      leaveType,
      approvers: {
        approval: approval.map((a) => [
          {
            ...a,
          },
          { status: Status.Pending },
        ]),
      },
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
    const updatedCredits = await this.factLeaveCreditService.update(dto.user_id, creditPayload);

    const jsonPath = this.saveJsonToFile(dto.user_id, dto.leave_type_id, leaveForm);

    const creatLeaveForm = await this.prisma.fact_form.create({
      data: {
        user_id: dto.user_id,
        leave_type_id: dto.leave_type_id,
        start_date: new Date(dto.start_date + 'T00:00:00.000Z'),
        end_date: new Date(dto.end_date + 'T00:00:00.000Z'),

        total_day: dto.total_day,
        fiscal_year: dto.fiscal_year,
        status: dto.status || Status.Pending,
        approve_date: new Date(),
        note: dto.note,
        file_leave: jsonPath,
        update_at: new Date(),
      },
    });

    for (const a of approval) {
      await this.prisma.approval.create({
        data: {
          aprover_id: a.id,
          user_id: dto.user_id,
          fact_form_id: creatLeaveForm.fact_form_id,
          status: Status.Pending,
        },
      });
    }

    return {
      leaveForm,
      updatedCredits,
      creatLeaveForm,
    };
  }
}
