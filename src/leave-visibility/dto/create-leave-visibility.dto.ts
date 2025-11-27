import { IsInt, IsOptional, IsArray, ArrayNotEmpty, IsIn } from 'class-validator';

export class CreateLeaveVisibilityDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  viewer_user_ids: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  target_user_ids: number[];

  @IsIn(['grant', 'revoke'])
  action: 'grant' | 'revoke';

  @IsOptional()
  @IsInt()
  created_by_user_id?: number;
}
