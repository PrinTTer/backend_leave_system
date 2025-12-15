import { IsString, IsNumber, IsOptional } from 'class-validator';
import * as createFactFormDto from './create-fact-form.dto';

export interface OtherExpenses {
  reason: string;
  expense: number;
}

export enum ExpensesType {
  PERSONAL_FUND = 'ทุนส่วนตัว',
  DEPARTMENT_FUND = 'ทุนภาควิชา',
  FACULTY_FUND = 'ทุนคณะ',
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

export interface Assistants {
  nontri_account: string;
}

export interface ExtendLeaves {
  leave_type_id: number;
  leave_dates: Date[];
  total_days: number;
}

export class CreateOfficialDutyFactFormDto {
  @IsString()
  nontri_account: string;

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
  status?: createFactFormDto.Status;

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
  expenses_type?: ExpensesType;

  @IsOptional()
  travel_details?: TravelDetails;

  @IsOptional()
  attachment?: createFactFormDto.AttachmentDto;
}
