import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateVacationRuleDto } from './dto/create-vacation-rule.dto';

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
}
