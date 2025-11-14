import { Controller, Body } from '@nestjs/common';
import { LeaveApprovalRuleService } from './leave-approval-rule.service';

@Controller('leave-approval-rule')
export class LeaveApprovalRuleController {
  constructor(private readonly leaveApprovalRuleService: LeaveApprovalRuleService) {}
}
