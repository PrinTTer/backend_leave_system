import { IsNumber, IsOptional } from 'class-validator';

export class CreateFactLeaveCreditDto {
  @IsNumber()
  @IsOptional()
  user_id: number;
}
