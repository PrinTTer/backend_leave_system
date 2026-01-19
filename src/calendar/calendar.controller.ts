// src/calendar/calendar.controller.ts
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  findAll() {
    return this.calendarService.findAll();
  }

  @Get('/:year/holidays')
  findHolidays(@Param('year', ParseIntPipe) year: number) {
    return this.calendarService.findHolidayYears(year);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.calendarService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCalendarDto) {
    return this.calendarService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCalendarDto) {
    return this.calendarService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.calendarService.remove(id);
  }
}
