import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approve',
  REJECTED = 'reject',
}
export class CreateApprovalDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  approver_id: number;

  @IsNotEmpty()
  @IsInt()
  fact_form_id: number;

  @IsNotEmpty()
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;
}
