import { Module } from '@nestjs/common';
import { FactLeaveCreditService } from './fact-leave-credit.service';
import { FactLeaveCreditController } from './fact-leave-credit.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  controllers: [FactLeaveCreditController],
  providers: [FactLeaveCreditService, PrismaService],
  exports: [FactLeaveCreditService],
})
export class FactLeaveCreditModule {}
