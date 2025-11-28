import { IsOptional, IsString } from 'class-validator';

export class UpdateLeaveVisibilityDto {
  @IsOptional()
  @IsString()
  viewer_nontri_account?: string;

  @IsOptional()
  @IsString()
  target_nontri_account?: string;

  @IsOptional()
  @IsString()
  created_by_nontri_account?: string;
}
