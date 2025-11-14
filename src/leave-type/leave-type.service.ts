import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { LeaveApprovalRuleService } from 'src/leave-approval-rule/leave-approval-rule.service';
import { LeaveTypeDocumentService } from 'src/leave-type-document/leave-type-document.service';
import { VacationRuleService } from 'src/vacation-rule/vacation-rule.service';
import { CreateLeaveApprovalRuleDto } from 'src/leave-approval-rule/dto/create-leave-approval-rule.dto';
import { CreateLeaveTypeDocumentDto } from 'src/leave-type-document/dto/create-leave-type-document.dto';
import { CreateVacationRuleDto } from 'src/vacation-rule/dto/create-vacation-rule.dto';

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

  async createLeaveType(
    dto: CreateLeaveTypeDto & {
      leaveApprovalRules?: CreateLeaveApprovalRuleDto[];
      leaveTypeDocuments?: CreateLeaveTypeDocumentDto[];
      vacationRules?: CreateVacationRuleDto[];
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
    if (dto.leaveApprovalRules?.length) {
      for (const rule of dto.leaveApprovalRules) {
        await this.leaveApprovalRule.createLeaveApprovalRule({
          ...rule,
          leave_type_id: leaveType.leave_type_id,
        });
      }
    }

    // 3. สร้าง leave type documents ถ้ามี
    if (dto.leaveTypeDocuments?.length) {
      for (const doc of dto.leaveTypeDocuments) {
        await this.leaveTypeDocument.createLeaveDocument({
          ...doc,
          leave_type_id: leaveType.leave_type_id,
        });
      }
    }

    // 4. สร้าง vacation rules ถ้ามี
    if (dto.vacationRules?.length) {
      for (const vac of dto.vacationRules) {
        await this.vacationRule.createVacationRule({
          ...vac,
          leave_type_id: leaveType.leave_type_id,
        });
      }
    }

    return leaveType;
  }
}
