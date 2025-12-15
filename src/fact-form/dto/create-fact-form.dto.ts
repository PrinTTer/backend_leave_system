import { IsNumber, IsString, IsOptional } from 'class-validator';

export enum Status {
  Draft = 'draft',
  Pending = 'pending',
  Approve = 'approve',
  Reject = 'reject',
  Cancel = 'cancel',
}

export interface AttachmentDto {
  fileName: string;
  fileType: string;
  data: string;
}

export class CreateFactFormDto {
  @IsString()
  nontri_account: string;

  @IsNumber()
  leave_type_id: number;

  @IsString()
  start_date: string;

  @IsString()
  start_type?: string;

  @IsString()
  end_date: string;

  @IsString()
  end_type?: string;

  @IsNumber()
  total_day: number;

  @IsNumber()
  fiscal_year: number;

  @IsString()
  leave_aboard?: string;

  @IsOptional()
  @IsString()
  status?: Status;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  countries?: string[];

  @IsOptional()
  provinces?: string[];

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  attachment?: AttachmentDto;
}
