import { Injectable } from '@nestjs/common';
import { CreateVacationRuleDto } from './dto/create-vacation-rule.dto';
import { UpdateVacationRuleDto } from './dto/update-vacation-rule.dto';

@Injectable()
export class VacationRuleService {
  create(createVacationRuleDto: CreateVacationRuleDto) {
    return 'This action adds a new vacationRule';
  }

  findAll() {
    return `This action returns all vacationRule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacationRule`;
  }

  update(id: number, updateVacationRuleDto: UpdateVacationRuleDto) {
    return `This action updates a #${id} vacationRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacationRule`;
  }
}
