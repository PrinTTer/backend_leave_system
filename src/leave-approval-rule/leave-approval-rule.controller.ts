import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeaveApprovalRuleService } from './leave-approval-rule.service';
import { CreateLeaveApprovalRuleDto } from './dto/create-leave-approval-rule.dto';
import { UpdateLeaveApprovalRuleDto } from './dto/update-leave-approval-rule.dto';

@Controller('leave-approval-rule')
export class LeaveApprovalRuleController {
  constructor(private readonly leaveApprovalRuleService: LeaveApprovalRuleService) {}

  @Post()
  create(@Body() createLeaveApprovalRuleDto: CreateLeaveApprovalRuleDto) {
    return this.leaveApprovalRuleService.create(createLeaveApprovalRuleDto);
  }

  @Get()
  findAll() {
    return this.leaveApprovalRuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveApprovalRuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveApprovalRuleDto: UpdateLeaveApprovalRuleDto) {
    return this.leaveApprovalRuleService.update(+id, updateLeaveApprovalRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveApprovalRuleService.remove(+id);
  }
}
