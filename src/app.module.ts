import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeaveTypeModule } from './leave-type/leave-type.module';
import { LeaveTypeDocumentModule } from './leave-type-document/leave-type-document.module';
import { VacationRuleModule } from './vacation-rule/vacation-rule.module';
import { LeaveApprovalRuleModule } from './leave-approval-rule/leave-approval-rule.module';

@Module({
  imports: [LeaveTypeModule, LeaveTypeDocumentModule, VacationRuleModule, LeaveApprovalRuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
