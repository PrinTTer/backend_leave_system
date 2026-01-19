import { Module } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { LeaveTypeController } from './leave-type.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { LeaveApprovalRuleModule } from 'src/leave-approval-rule/leave-approval-rule.module';
import { LeaveTypeDocumentModule } from 'src/leave-type-document/leave-type-document.module';
import { VacationRuleModule } from 'src/vacation-rule/vacation-rule.module';

@Module({
  imports: [PrismaModule, LeaveApprovalRuleModule, LeaveTypeDocumentModule, VacationRuleModule],
  controllers: [LeaveTypeController],
  providers: [LeaveTypeService],
  exports: [LeaveTypeService],
})
export class LeaveTypeModule {}
