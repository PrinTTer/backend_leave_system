import { PartialType } from '@nestjs/mapped-types';
import { CreateVacationRuleDto } from './create-vacation-rule.dto';

export class UpdateVacationRuleDto extends PartialType(CreateVacationRuleDto) {}
