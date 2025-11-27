import { IsInt, IsOptional } from 'class-validator';

export class UpdateLeaveVisibilityDto {
  @IsOptional()
  @IsInt()
  viewer_user_id?: number;

  @IsOptional()
  @IsInt()
  target_user_id?: number;

  @IsOptional()
  @IsInt()
  created_by_user_id?: number;
}
