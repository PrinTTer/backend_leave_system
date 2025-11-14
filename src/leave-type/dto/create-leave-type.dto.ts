import {
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  MaxLength,
  Min,
  IsOptional,
} from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'femal',
  ALL = 'all',
}

export enum LeaveCategory {
  GENERAL = 'general',
  VACATION = 'vacation',
}

export class CreateLeaveTypeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsNotEmpty()
  @IsBoolean()
  is_count_vacation: boolean;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  service_year: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  number_approver: number;

  @IsNotEmpty()
  @IsEnum(LeaveCategory)
  category: LeaveCategory;

  @IsOptional()
  @IsInt()
  @Min(0)
  max_leave?: number;
}
