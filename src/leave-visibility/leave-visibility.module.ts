import { Module } from '@nestjs/common';
import { LeaveVisibilityService } from './leave-visibility.service';
import { LeaveVisibilityController } from './leave-visibility.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [LeaveVisibilityController],
  providers: [LeaveVisibilityService, PrismaService],
  exports: [LeaveVisibilityService],
})
export class LeaveVisibilityModule {}
