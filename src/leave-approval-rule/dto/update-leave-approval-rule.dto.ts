import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateLeaveApprovalRuleDto {
  @IsOptional()
  @IsInt()
  leave_approval_rule_id?: number;

  @IsInt()
  @Min(0)
  leave_less_than: number;

  @IsInt()
  @Min(0)
  approval_level: number;
}
