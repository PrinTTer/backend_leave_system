import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { FactFormController } from './fact-form.controller';
import { FactFormService } from './fact-form.service';
import { FactLeaveCreditModule } from 'src/fact-leave-credit/fact-leave-credit.module';

@Module({
  imports: [FactLeaveCreditModule],
  controllers: [FactFormController],
  providers: [FactFormService, PrismaService],
  exports: [FactFormService],
})
export class FactFormModule {}
