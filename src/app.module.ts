import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarModule } from './calendar/calendar.module';
import { LeaveTypeModule } from './leave-type/leave-type.module';
import { LeaveTypeDocumentModule } from './leave-type-document/leave-type-document.module';
import { VacationRuleModule } from './vacation-rule/vacation-rule.module';
import { LeaveApprovalRuleModule } from './leave-approval-rule/leave-approval-rule.module';
import { FactLeaveCreditModule } from './fact-leave-credit/fact-leave-credit.module';
import { FactFormModule } from './fact-form/fact-form.module';
import { LeaveVisibilityService } from './leave-visibility/leave-visibility.service';
import { LeaveVisibilityModule } from './leave-visibility/leave-visibility.module';

@Module({
  imports: [
    LeaveTypeModule,
    LeaveTypeDocumentModule,
    VacationRuleModule,
    LeaveApprovalRuleModule,
    FactLeaveCreditModule,
    CalendarModule,
    FactFormModule,
    LeaveVisibilityModule,
  ],
  controllers: [AppController],
  providers: [AppService, LeaveVisibilityService],
})
export class AppModule {}
