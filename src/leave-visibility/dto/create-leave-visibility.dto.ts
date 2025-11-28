import { IsInt, IsOptional, IsArray, ArrayNotEmpty, IsIn } from 'class-validator';

export class CreateLeaveVisibilityDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  viewer_nontri_accounts: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  target_nontri_accounts: string[];

  @IsIn(['grant', 'revoke'])
  action: 'grant' | 'revoke';

  @IsOptional()
  @IsInt()
  created_by_nontri_account?: string;
}
