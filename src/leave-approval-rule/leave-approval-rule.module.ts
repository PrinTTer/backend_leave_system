import { Module } from '@nestjs/common';
import { LeaveApprovalRuleService } from './leave-approval-rule.service';
import { LeaveApprovalRuleController } from './leave-approval-rule.controller';

@Module({
  controllers: [LeaveApprovalRuleController],
  providers: [LeaveApprovalRuleService],
})
export class LeaveApprovalRuleModule {}
