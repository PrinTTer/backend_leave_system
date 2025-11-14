import { Module } from '@nestjs/common';
import { VacationRuleService } from './vacation-rule.service';
import { VacationRuleController } from './vacation-rule.controller';

@Module({
  controllers: [VacationRuleController],
  providers: [VacationRuleService],
  exports: [VacationRuleService],
})
export class VacationRuleModule {}
