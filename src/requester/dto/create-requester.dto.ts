import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRequesterDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  approver_id: number;

  @IsNotEmpty()
  @IsInt()
  approver_order: number;
}
