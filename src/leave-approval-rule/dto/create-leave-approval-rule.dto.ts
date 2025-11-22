import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateLeaveApprovalRuleDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  leave_type_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  leave_less_than: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  approval_level: number;
}
