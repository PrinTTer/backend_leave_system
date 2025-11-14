import { Controller, Get, Body, Post } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeWithRelationsDto } from './dto/create-leave-type-with-relations.dto';

@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Get()
  async getAllLeaveType() {
    return this.leaveTypeService.getAllLeaveType();
  }

  @Post()
  async createLeaveType(@Body() dto: CreateLeaveTypeWithRelationsDto) {
    return this.leaveTypeService.createLeaveType(dto);
  }
}
