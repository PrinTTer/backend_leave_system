import { Controller, Post, Body, Patch, Param, Get, ParseIntPipe, Query } from '@nestjs/common';
import { FactFormService } from './fact-form.service';
import { CreateFactFormDto } from './dto/create-fact-form.dto';
import { UpdateFactFormDto } from './dto/update-fact-form.dto';
import { Request } from 'express';

@Controller('fact-form')
export class FactFormController {
  constructor(private readonly service: FactFormService) {}

  @Post()
  create(@Body() dto: CreateFactFormDto) {
    return this.service.createLeave(dto);
  }

  @Get(':fact_form_id')
  findOne(@Param('fact_form_id') fact_form_id: string) {
    return this.service.findOneFactForm(Number(fact_form_id));
  }
  @Get('calendar')
  async getLeavesForCalendar(
    @Query('viewer_user_id', ParseIntPipe) viewer_user_id: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.service.getLeavesForCalendar(viewer_user_id, start, end);
  }
  @Patch(':user_id/:fact_form_id')
  update(
    @Param('user_id') user_id: string,
    @Param('fact_form_id') fact_form_id: string,
    @Body() updateDto: UpdateFactFormDto,
  ) {
    return this.service.updateFactForm(Number(user_id), Number(fact_form_id), updateDto);
  }
}
