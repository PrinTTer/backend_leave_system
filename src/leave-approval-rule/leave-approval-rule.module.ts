import { Module } from '@nestjs/common';
import { LeaveApprovalRuleService } from './leave-approval-rule.service';
import { LeaveApprovalRuleController } from './leave-approval-rule.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LeaveApprovalRuleController],
  providers: [LeaveApprovalRuleService],
  exports: [LeaveApprovalRuleService],
})
export class LeaveApprovalRuleModule {}
