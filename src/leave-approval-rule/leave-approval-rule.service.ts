import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLeaveApprovalRuleDto } from './dto/create-leave-approval-rule.dto';

@Injectable()
export class LeaveApprovalRuleService {
  constructor(private readonly prisma: PrismaService) {}
  async getLeaveApproveRuleByLeaveTypeId(id: number) {
    return await this.prisma.leave_approval_rule.findMany({
      where: { leave_type_id: id },
    });
  }

  async createLeaveApprovalRule(dto: CreateLeaveApprovalRuleDto) {
    return await this.prisma.leave_approval_rule.create({
      data: {
        leave_type_id: dto.leave_type_id,
        leave_less_than: dto.leave_less_than,
        approval_level: dto.approval_level,
      },
    });
  }
}
