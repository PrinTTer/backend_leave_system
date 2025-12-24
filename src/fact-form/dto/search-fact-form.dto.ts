import { IsNumberString, IsOptional } from 'class-validator';

export class SearchFactformDto {
  @IsOptional()
  @IsNumberString()
  fiscal_year?: string;

  @IsOptional()
  @IsNumberString()
  leave_type_id?: string;

  @IsOptional()
  search?: string;
}
