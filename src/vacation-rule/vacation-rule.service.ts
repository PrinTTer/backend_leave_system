import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateVacationRuleDto } from './dto/create-vacation-rule.dto';
import { UpdateVacationRuleDto } from './dto/update-vacation-rule.dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class VacationRuleService {
  constructor(private readonly prisma: PrismaService) {}
  async createVacationRule(dto: CreateVacationRuleDto) {
    return await this.prisma.vacation_rule.create({
      data: {
        leave_type_id: dto.leave_type_id,
        service_year: dto.service_year,
        annual_leave: dto.annual_leave,
        max_leave: dto.max_leave,
      },
    });
  }
  async syncForLeaveType(
    leaveTypeId: number,
    items: UpdateVacationRuleDto[] = [],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const existing = await client.vacation_rule.findMany({ where: { leave_type_id: leaveTypeId } });
    const existingById = new Map(existing.map((e) => [e.vacation_rule_id, e]));

    const incomingIds = items.filter((i) => i.vacation_rule_id).map((i) => i.vacation_rule_id);
    const idsToDelete = existing
      .map((e) => e.vacation_rule_id)
      .filter((id) => !incomingIds.includes(id));
    if (idsToDelete.length) {
      await client.vacation_rule.deleteMany({ where: { vacation_rule_id: { in: idsToDelete } } });
    }

    const ops: Promise<any>[] = [];
    for (const item of items) {
      if (item.vacation_rule_id && existingById.has(item.vacation_rule_id)) {
        const prev = existingById.get(item.vacation_rule_id)!;
        if (
          prev.service_year !== item.service_year ||
          prev.annual_leave !== item.annual_leave ||
          prev.max_leave !== item.max_leave
        ) {
          ops.push(
            client.vacation_rule.update({
              where: { vacation_rule_id: item.vacation_rule_id },
              data: {
                service_year: item.service_year,
                annual_leave: item.annual_leave,
                max_leave: item.max_leave,
              },
            }),
          );
        }
      } else {
        ops.push(
          client.vacation_rule.create({
            data: {
              leave_type_id: leaveTypeId,
              service_year: item.service_year,
              annual_leave: item.annual_leave,
              max_leave: item.max_leave,
            },
          }),
        );
      }
    }

    return Promise.all(ops);
  }
}
