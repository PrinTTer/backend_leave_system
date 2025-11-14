import { Module } from '@nestjs/common';
import { LeaveTypeDocumentService } from './leave-type-document.service';
import { LeaveTypeDocumentController } from './leave-type-document.controller';

@Module({
  controllers: [LeaveTypeDocumentController],
  providers: [LeaveTypeDocumentService],
})
export class LeaveTypeDocumentModule {}
