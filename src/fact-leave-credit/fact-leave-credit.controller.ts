import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FactLeaveCreditService } from './fact-leave-credit.service';
import { CreateFactLeaveCreditDto } from './dto/create-fact-leave-credit.dto';
import { UpdateFactLeaveCreditDto } from './dto/update-fact-leave-credit.dto';

@Controller('fact-leave-credit')
export class FactLeaveCreditController {
  constructor(private readonly service: FactLeaveCreditService) {}

  @Post()
  createOne(@Body() dto: CreateFactLeaveCreditDto) {
    return this.service.createAllLeaveCreditForOneUser(dto);
  }

  @Post('all')
  createAll() {
    return this.service.createForAll();
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':nontri_account')
  findByUserId(@Param('nontri_account') nontri_account: string) {
    return this.service.findByUserId(nontri_account);
  }

  @Get(':nontri_account/left')
  findLeftByUserId(@Param('nontri_account') nontri_account: string) {
    return this.service.findleftByUserId(nontri_account);
  }

  @Get(':nontri_account/personal-vacation-left')
  findPersonalAndVacationLeave(@Param('nontri_account') nontri_account: string) {
    return this.service.findPersonalAndVacationLeave(nontri_account);
  }
  @Get('/all-leave/:nontri_account')
  findAllByUserId(@Param('nontri_account') nontri_account: string) {
    return this.service.findLeaveByUserIdWithOfficialduty(nontri_account);
  }

  @Get(':nontri_account/:leave_type_id')
  findOne(
    @Param('nontri_account') nontri_account: string,
    @Param('leave_type_id') leave_type_id: string,
  ) {
    return this.service.findOne(nontri_account, Number(leave_type_id));
  }

  @Patch(':nontri_account')
  update(@Param('nontri_account') nontri_account: string, @Body() dto: UpdateFactLeaveCreditDto[]) {
    return this.service.update(nontri_account, dto);
  }

  @Delete(':nontri_account/:leave_type_id')
  remove(
    @Param('nontri_account') nontri_account: string,
    @Param('leave_type_id') leave_type_id: string,
  ) {
    return this.service.remove(nontri_account, Number(leave_type_id));
  }
}
