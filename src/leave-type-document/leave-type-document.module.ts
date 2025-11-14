import { Module } from '@nestjs/common';
import { LeaveTypeDocumentService } from './leave-type-document.service';
import { LeaveTypeDocumentController } from './leave-type-document.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LeaveTypeDocumentController],
  providers: [LeaveTypeDocumentService],
  exports: [LeaveTypeDocumentService],
})
export class LeaveTypeDocumentModule {}
