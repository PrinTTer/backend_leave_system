// src/calendar/dto/create-calendar.dto.ts
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum CalendarTypeEnum {
  holiday = 'holiday',
  academic = 'academic',
  fiscal = 'fiscal',
}

export class CreateCalendarDto {
  @IsEnum(CalendarTypeEnum)
  calendarType: CalendarTypeEnum;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  description?: string;
}
