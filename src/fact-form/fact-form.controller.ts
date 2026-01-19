import { Controller, Post, Body, Patch, Param, Get, Query } from '@nestjs/common';
import { FactFormService } from './fact-form.service';
import { CreateFactFormDto } from './dto/create-fact-form.dto';
import { UpdateFactFormDto } from './dto/update-fact-form.dto';
import { CreateOfficialDutyFactFormDto } from './dto/create-officialduty-fact-form.dto';
import { SearchFactformDto } from './dto/search-fact-form.dto';

@Controller('fact-form')
export class FactFormController {
  constructor(private readonly service: FactFormService) {}

  @Post()
  create(@Body() dto: CreateFactFormDto) {
    return this.service.createLeave(dto);
  }

  @Post('officialduty')
  createOfficialdutyLeave(@Body() dto: CreateOfficialDutyFactFormDto) {
    return this.service.createOfficialdutyLeave(dto);
  }

  @Get(':fact_form_id')
  findOne(@Param('fact_form_id') fact_form_id: string) {
    return this.service.findOneFactForm(Number(fact_form_id));
  }
  @Get('calendar')
  async getLeavesForCalendar(
    @Query('viewer_nontri_account') viewer_nontri_account: string,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.service.getLeavesForCalendar(viewer_nontri_account, start, end);
  }

  @Patch(':nontri_account/:fact_form_id')
  update(
    @Param('nontri_account') nontri_account: string,
    @Param('fact_form_id') fact_form_id: string,
    @Body() updateDto: UpdateFactFormDto | CreateOfficialDutyFactFormDto,
  ) {
    return this.service.updateFactForm(nontri_account, Number(fact_form_id), updateDto);
  }

  @Get('history/:nontri_account')
  getAllFactform(@Param('nontri_account') nontri_account: string, @Query() dto: SearchFactformDto) {
    return this.service.searchFactformFromJson(nontri_account, dto);
  }

  @Get('cancel/:fact_form_id')
  cancelLeaveForm(@Param('fact_form_id') fact_form_id: string) {
    return this.service.cancelLeaveForm(Number(fact_form_id));
  }
}
