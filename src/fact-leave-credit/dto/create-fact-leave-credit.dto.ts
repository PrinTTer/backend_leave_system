import { IsOptional, IsString } from 'class-validator';

export class CreateFactLeaveCreditDto {
  @IsString()
  @IsOptional()
  nontri_account: string;
}
