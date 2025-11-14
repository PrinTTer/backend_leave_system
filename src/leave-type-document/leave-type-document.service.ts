import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLeaveTypeDocumentDto } from './dto/create-leave-type-document.dto';

@Injectable()
export class LeaveTypeDocumentService {
  constructor(private readonly prisma: PrismaService) {}
  async createLeaveDocument(dto: CreateLeaveTypeDocumentDto) {
    return await this.prisma.leave_type_document.create({
      data: {
        leave_type_id: dto.leave_type_id,
        name: dto.name,
        file_type: dto.file_type,
        is_required: dto.is_required,
      },
    });
  }
}
