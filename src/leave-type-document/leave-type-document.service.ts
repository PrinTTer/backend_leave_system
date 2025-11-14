import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLeaveTypeDocumentDto } from './dto/create-leave-type-document.dto';
import { UpdateLeaveTypeDocumentDto } from './dto/update-leave-type-document.dto';
import type { Prisma } from '@prisma/client';

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
  async syncForLeaveType(
    leaveTypeId: number,
    items: UpdateLeaveTypeDocumentDto[] = [],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const existing = await client.leave_type_document.findMany({
      where: { leave_type_id: leaveTypeId },
    });
    const existingById = new Map(existing.map((e) => [e.leave_type_document_id, e]));

    const incomingIds = items
      .filter((i) => i.leave_type_document_id)
      .map((i) => i.leave_type_document_id);
    const idsToDelete = existing
      .map((e) => e.leave_type_document_id)
      .filter((id) => !incomingIds.includes(id));
    if (idsToDelete.length) {
      await client.leave_type_document.deleteMany({
        where: { leave_type_document_id: { in: idsToDelete } },
      });
    }

    const ops: Promise<any>[] = [];
    for (const item of items) {
      if (item.leave_type_document_id && existingById.has(item.leave_type_document_id)) {
        const prev = existingById.get(item.leave_type_document_id)!;
        if (
          prev.name !== item.name ||
          String(prev.file_type) !== String(item.file_type) ||
          prev.is_required !== !!item.is_required
        ) {
          ops.push(
            client.leave_type_document.update({
              where: { leave_type_document_id: item.leave_type_document_id },
              data: {
                name: item.name,
                file_type: item.file_type,
                is_required: item.is_required ?? false,
              },
            }),
          );
        }
      } else {
        ops.push(
          client.leave_type_document.create({
            data: {
              leave_type_id: leaveTypeId,
              name: item.name,
              file_type: item.file_type,
              is_required: item.is_required ?? false,
            },
          }),
        );
      }
    }

    return Promise.all(ops);
  }
}
