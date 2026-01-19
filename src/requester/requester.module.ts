import { Module } from '@nestjs/common';
import { RequesterService } from './requester.service';
import { RequesterController } from './requester.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RequesterController],
  providers: [RequesterService],
  exports: [RequesterService],
})
export class RequesterModule {}
