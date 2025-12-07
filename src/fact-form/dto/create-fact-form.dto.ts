import { IsNumber, IsString, IsOptional } from 'class-validator';

export interface Assistants {
  nontri_account: string;
}

export interface ExtendLeaves {
  leave_type_id: number;
  leave_dates: Date[];
  total_days: number;
}

export interface OtherExpenses {
  reason: string;
  expense: number;
}

export interface Expenses {
  rs_allowance?: number;
  asst_allowance?: number;
  driver?: number;
  accommodation?: number;
  vehicle?: OtherExpenses;
  other?: OtherExpenses;
  expenses_type?: string;
  attachment?: string;
}

export interface TravelDetails {
  car_brand: string;
  license: string;
  driver?: string;
}

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
  assistants?: Assistants[];

  @IsOptional()
  countries?: string[];

  @IsOptional()
  provinces?: string[];

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  extend_leaves?: ExtendLeaves[];

  @IsOptional()
  expenses?: Expenses;

  @IsOptional()
  travel_details?: TravelDetails;

  @IsOptional()
  attachment?: AttachmentDto;
}
