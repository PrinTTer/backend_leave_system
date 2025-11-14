import { Injectable } from '@nestjs/common';
import { CreateLeaveApprovalRuleDto } from './dto/create-leave-approval-rule.dto';
import { UpdateLeaveApprovalRuleDto } from './dto/update-leave-approval-rule.dto';

@Injectable()
export class LeaveApprovalRuleService {
  create(createLeaveApprovalRuleDto: CreateLeaveApprovalRuleDto) {
    return 'This action adds a new leaveApprovalRule';
  }

  findAll() {
    return `This action returns all leaveApprovalRule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaveApprovalRule`;
  }

  update(id: number, updateLeaveApprovalRuleDto: UpdateLeaveApprovalRuleDto) {
    return `This action updates a #${id} leaveApprovalRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaveApprovalRule`;
  }
}
