import { Controller, Body } from '@nestjs/common';
import { VacationRuleService } from './vacation-rule.service';

@Controller('vacation-rule')
export class VacationRuleController {
  constructor(private readonly vacationRuleService: VacationRuleService) {}
}
