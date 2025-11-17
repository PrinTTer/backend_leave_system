import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum CalendarTypeEnum {
  HOLIDAY = 'holiday',
  ACADEMIC = 'academic',
  FISCAL = 'fiscal',
}

export class CreateCalendarDto {
  @IsEnum(CalendarTypeEnum)
  calendarType: CalendarTypeEnum;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isHoliday?: boolean;
}
