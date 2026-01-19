import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRequesterDto {
  @IsNotEmpty()
  @IsString()
  nontri_account: string;

  @IsNotEmpty()
  @IsString()
  approver_nontri_account: string;

  @IsNotEmpty()
  @IsInt()
  approver_order: number;
}
