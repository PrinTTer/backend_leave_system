import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VacationRuleService } from './vacation-rule.service';
import { CreateVacationRuleDto } from './dto/create-vacation-rule.dto';
import { UpdateVacationRuleDto } from './dto/update-vacation-rule.dto';

@Controller('vacation-rule')
export class VacationRuleController {
  constructor(private readonly vacationRuleService: VacationRuleService) {}

  @Post()
  create(@Body() createVacationRuleDto: CreateVacationRuleDto) {
    return this.vacationRuleService.create(createVacationRuleDto);
  }

  @Get()
  findAll() {
    return this.vacationRuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacationRuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVacationRuleDto: UpdateVacationRuleDto) {
    return this.vacationRuleService.update(+id, updateVacationRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacationRuleService.remove(+id);
  }
}
