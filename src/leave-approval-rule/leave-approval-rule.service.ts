import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLeaveApprovalRuleDto } from './dto/create-leave-approval-rule.dto';
import type { UpdateLeaveApprovalRuleDto } from './dto/update-leave-approval-rule.dto';
import { Prisma } from '@prisma/client';

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

  async syncForLeaveType(
    leaveTypeId: number,
    items: UpdateLeaveApprovalRuleDto[] = [],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const existing = await client.leave_approval_rule.findMany({
      where: { leave_type_id: leaveTypeId },
    });
    const existingById = new Map(existing.map((r) => [r.leave_approval_rule_id, r]));

    const incomingIds = items
      .filter((i) => i.leave_approval_rule_id)
      .map((i) => i.leave_approval_rule_id);
    // deletes: existing ids not in incomingIds
    const idsToDelete = existing
      .map((r) => r.leave_approval_rule_id)
      .filter((id) => !incomingIds.includes(id));
    if (idsToDelete.length) {
      await client.leave_approval_rule.deleteMany({
        where: { leave_approval_rule_id: { in: idsToDelete } },
      });
    }

    // updates and creates
    const ops: Promise<any>[] = [];

    for (const item of items) {
      if (item.leave_approval_rule_id && existingById.has(item.leave_approval_rule_id)) {
        // check if changed (optional optimization)
        const prev = existingById.get(item.leave_approval_rule_id)!;
        if (
          prev.leave_less_than !== item.leave_less_than ||
          prev.approval_level !== item.approval_level
        ) {
          ops.push(
            client.leave_approval_rule.update({
              where: { leave_approval_rule_id: item.leave_approval_rule_id },
              data: {
                leave_less_than: item.leave_less_than,
                approval_level: item.approval_level,
              },
            }),
          );
        }
      } else {
        // create new
        ops.push(
          client.leave_approval_rule.create({
            data: {
              leave_type_id: leaveTypeId,
              leave_less_than: item.leave_less_than,
              approval_level: item.approval_level,
            },
          }),
        );
      }
    }

    return Promise.all(ops);
  }
}
