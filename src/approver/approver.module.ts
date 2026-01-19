import { Module } from '@nestjs/common';
import { ApproverService } from './approver.service';
import { ApproverController } from './approver.controller';

@Module({
  controllers: [ApproverController],
  providers: [ApproverService],
  exports: [ApproverService],
})
export class ApproverModule {}
