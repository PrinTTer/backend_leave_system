import { PartialType } from '@nestjs/mapped-types';
import { CreateFactLeaveCreditDto } from './create-fact-leave-credit.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateFactLeaveCreditDto extends PartialType(CreateFactLeaveCreditDto) {
  @IsNumber()
  leave_type_id: number;

  @IsNumber()
  @IsOptional()
  annual_used_leave?: number;

  @IsNumber()
  @IsOptional()
  used_leave?: number;
}
