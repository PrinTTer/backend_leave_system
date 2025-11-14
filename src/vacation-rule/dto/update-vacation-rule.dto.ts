import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateVacationRuleDto {
  @IsOptional() @IsInt() vacation_rule_id?: number;

  @IsInt() service_year: number;

  @IsInt() @Min(0) annual_leave: number;

  @IsInt() @Min(0) max_leave: number;
}
