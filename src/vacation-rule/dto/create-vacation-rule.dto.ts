import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateVacationRuleDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  leave_type_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  service_year: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  annual_leave: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  max_leave: number;
}
