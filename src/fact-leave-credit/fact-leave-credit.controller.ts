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

  @Get(':user_id')
  findByUserId(@Param('user_id') user_id: string) {
    return this.service.findByUserId(Number(user_id));
  }

  @Get(':user_id/:leave_type_id')
  findOne(@Param('user_id') user_id: string, @Param('leave_type_id') leave_type_id: string) {
    return this.service.findOne(Number(user_id), Number(leave_type_id));
  }

  @Patch(':user_id/')
  update(@Param('user_id') user_id: string, @Body() dto: UpdateFactLeaveCreditDto[]) {
    return this.service.update(Number(user_id), dto);
  }

  @Delete(':user_id/:leave_type_id')
  remove(@Param('user_id') user_id: string, @Param('leave_type_id') leave_type_id: string) {
    return this.service.remove(Number(user_id), Number(leave_type_id));
  }
}
