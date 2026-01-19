import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { LeaveApprovalRuleService } from 'src/leave-approval-rule/leave-approval-rule.service';
import { LeaveTypeDocumentService } from 'src/leave-type-document/leave-type-document.service';
import { VacationRuleService } from 'src/vacation-rule/vacation-rule.service';
import { CreateLeaveApprovalRuleDto } from 'src/leave-approval-rule/dto/create-leave-approval-rule.dto';
import { CreateLeaveTypeDocumentDto } from 'src/leave-type-document/dto/create-leave-type-document.dto';
import { CreateVacationRuleDto } from 'src/vacation-rule/dto/create-vacation-rule.dto';
import { UpdateLeaveApprovalRuleDto } from 'src/leave-approval-rule/dto/update-leave-approval-rule.dto';
import { UpdateLeaveTypeDocumentDto } from 'src/leave-type-document/dto/update-leave-type-document.dto';
import { UpdateVacationRuleDto } from 'src/vacation-rule/dto/update-vacation-rule.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Injectable()
export class LeaveTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly leaveApprovalRule: LeaveApprovalRuleService,
    private readonly leaveTypeDocument: LeaveTypeDocumentService,
    private readonly vacationRule: VacationRuleService,
  ) {}
  async getAllLeaveType() {
    return await this.prisma.leave_type.findMany({
      include: {
        leave_approval_rule: {
          orderBy: { leave_approval_rule_id: 'asc' },
        },
        leave_type_document: {},
        vacation_rule: {},
      },
    });
  }

  async getLeaveTypeById(id: number) {
    return await this.prisma.leave_type.findUnique({
      where: { leave_type_id: id },
      include: {
        leave_approval_rule: {
          orderBy: { leave_approval_rule_id: 'asc' },
        },
        leave_type_document: {},
        vacation_rule: {},
      },
    });
  }

  async createLeaveType(
    dto: CreateLeaveTypeDto & {
      leave_approval_rule?: CreateLeaveApprovalRuleDto[];
      leave_type_document?: CreateLeaveTypeDocumentDto[];
      vacation_rule?: CreateVacationRuleDto[];
    },
  ) {
    // 1. สร้าง leave type
    const leaveType = await this.prisma.leave_type.create({
      data: {
        name: dto.name,
        gender: dto.gender ?? 'all',
        is_count_vacation: dto.is_count_vacation,
        service_year: dto.service_year,
        number_approver: dto.number_approver,
        category: dto.category,
        max_leave: dto.max_leave ?? 0,
      },
    });

    // 2. สร้าง leave approval rules ถ้ามี
    if (dto.leave_approval_rule?.length) {
      for (const rule of dto.leave_approval_rule) {
        await this.leaveApprovalRule.createLeaveApprovalRule({
          ...rule,
          leave_type_id: leaveType.leave_type_id,
        });
      }
    }

    // 3. สร้าง leave type documents ถ้ามี
    if (dto.leave_type_document?.length) {
      for (const doc of dto.leave_type_document) {
        await this.leaveTypeDocument.createLeaveDocument({
          ...doc,
          leave_type_id: leaveType.leave_type_id,
        });
      }
    }

    // 4. สร้าง vacation rules ถ้ามี
    if (dto.vacation_rule?.length) {
      for (const vac of dto.vacation_rule) {
        await this.vacationRule.createVacationRule({
          ...vac,
          leave_type_id: leaveType.leave_type_id,
        });
      }
    }

    return leaveType;
  }

  async updateLeaveType(
    id: number,
    dto: Partial<UpdateLeaveTypeDto> & {
      leave_approval_rule?: UpdateLeaveApprovalRuleDto[];
      leave_type_document?: UpdateLeaveTypeDocumentDto[];
      vacation_rule?: UpdateVacationRuleDto[];
    },
  ) {
    const result = await this.prisma.$transaction(async (tx) => {
      // 1) update main leave_type
      await tx.leave_type.update({
        where: { leave_type_id: id },
        data: {
          name: dto.name,
          gender: dto.gender,
          is_count_vacation:
            typeof dto.is_count_vacation === 'boolean' ? dto.is_count_vacation : undefined,
          service_year: dto.service_year,
          number_approver: dto.number_approver,
          category: dto.category,
          max_leave: typeof dto.max_leave === 'number' ? dto.max_leave : undefined,
          // update_at handled by Prisma @updatedAt
        },
      });

      // 2) sync relations via services (pass tx)
      await this.leaveApprovalRule.syncForLeaveType(id, dto.leave_approval_rule ?? [], tx);
      await this.leaveTypeDocument.syncForLeaveType(id, dto.leave_type_document ?? [], tx);
      await this.vacationRule.syncForLeaveType(id, dto.vacation_rule ?? [], tx);

      // 3) return full object with relations
      return tx.leave_type.findUnique({
        where: { leave_type_id: id },
        include: {
          leave_approval_rule: true,
          leave_type_document: true,
          vacation_rule: true,
        },
      });
    });

    return result;
  }

  async deleteLeaveType(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const leaveType = await tx.leave_type.findUnique({
        where: { leave_type_id: id },
      });

      if (leaveType === null) {
        return null;
      }

      await tx.leave_approval_rule.deleteMany({
        where: { leave_type_id: id },
      });

      await tx.leave_type_document.deleteMany({
        where: { leave_type_id: id },
      });

      await tx.vacation_rule.deleteMany({
        where: { leave_type_id: id },
      });

      await tx.leave_type.delete({
        where: { leave_type_id: id },
      });

      return leaveType;
    });
  }
}
