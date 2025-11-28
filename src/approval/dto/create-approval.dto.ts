import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approve',
  REJECTED = 'reject',
}
export class CreateApprovalDto {
  @IsNotEmpty()
  @IsString()
  nontri_account: string;

  @IsNotEmpty()
  @IsString()
  approver_nontri_account: string;

  @IsNotEmpty()
  @IsInt()
  fact_form_id: number;

  @IsNotEmpty()
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;
}
