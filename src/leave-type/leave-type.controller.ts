import { Controller, Get, Body, Post, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeWithRelationsDto } from './dto/create-leave-type-with-relations.dto';

@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Get()
  async getAllLeaveType() {
    return this.leaveTypeService.getAllLeaveType();
  }

  @Get(':id')
  async getLeaveTypeById(@Param('id', ParseIntPipe) id: number) {
    return this.leaveTypeService.getLeaveTypeById(id);
  }

  @Post()
  async createLeaveType(@Body() dto: CreateLeaveTypeWithRelationsDto) {
    return this.leaveTypeService.createLeaveType(dto);
  }

  @Put(':id')
  async updateLeaveType(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateLeaveTypeWithRelationsDto,
  ) {
    return this.leaveTypeService.updateLeaveType(id, dto);
  }

  @Delete(':id')
  async deleteLeaveType(@Param('id', ParseIntPipe) id: number) {
    return this.leaveTypeService.deleteLeaveType(id);
  }
}
