import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateLeaveVisibilityDto } from './dto/create-leave-visibility.dto';
import { UpdateLeaveVisibilityDto } from './dto/update-leave-visibility.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeaveVisibilityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeaveVisibilityDto) {
    return this.bulkUpdate(dto);
  }

  async bulkUpdate(dto: CreateLeaveVisibilityDto) {
    const { viewer_user_ids, target_user_ids, action, created_by_user_id } = dto;

    if (action === 'grant') {
      const data = viewer_user_ids.flatMap((viewerId) =>
        target_user_ids.map((targetId) => ({
          viewer_user_id: viewerId,
          target_user_id: targetId,
          created_by_user_id: created_by_user_id ?? null,
        })),
      );

      const result = await this.prisma.leave_visibility.createMany({
        data,
        skipDuplicates: true,
      });

      return {
        action: 'grant',
        createdCount: result.count,
      };
    }

    if (action === 'revoke') {
      const result = await this.prisma.leave_visibility.deleteMany({
        where: {
          viewer_user_id: { in: viewer_user_ids },
          target_user_id: { in: target_user_ids },
        },
      });

      return {
        action: 'revoke',
        deletedCount: result.count,
      };
    }
    throw new Error('Invalid action');
  }
  findAll() {
    return this.prisma.leave_visibility.findMany();
  }

  findOne(id: number) {
    return this.prisma.leave_visibility.findUnique({
      where: { leave_visibility_id: id },
    });
  }

  update(id: number, dto: UpdateLeaveVisibilityDto) {
    return this.prisma.leave_visibility.update({
      where: { leave_visibility_id: id },
      data: {
        viewer_user_id: dto.viewer_user_id,
        target_user_id: dto.target_user_id,
        created_by_user_id: dto.created_by_user_id ?? undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.leave_visibility.delete({
      where: { leave_visibility_id: id },
    });
  }
  findTargetsForViewer(viewer_user_id: number) {
    return this.prisma.leave_visibility.findMany({
      where: { viewer_user_id: viewer_user_id },
    });
  }
  findViewersForTarget(target_user_id: number) {
    return this.prisma.leave_visibility.findMany({
      where: { target_user_id: target_user_id },
    });
  }
  async canViewerSeeTarget(viewer_user_id: number, target_user_id: number) {
    const record = await this.prisma.leave_visibility.findFirst({
      where: {
        viewer_user_id: viewer_user_id,
        target_user_id: target_user_id,
      },
    });
    return !!record;
  }

  async getConfig(): Promise<{ viewers: number[]; targets: number[] }> {
    const viewerRows = await this.prisma.leave_visibility.findMany({
      select: { viewer_user_id: true },
      distinct: ['viewer_user_id'],
    });

    const targetRows = await this.prisma.leave_visibility.findMany({
      select: { target_user_id: true },
      distinct: ['target_user_id'],
    });

    return {
      viewers: viewerRows.map((v) => v.viewer_user_id),
      targets: targetRows.map((t) => t.target_user_id),
    };
  }

  async saveConfig(viewers: number[], targets: number[]): Promise<void> {
    if (!viewers.length) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      // 1) ลบสิทธิ์เดิมของ viewer กลุ่มนี้
      await tx.leave_visibility.deleteMany({
        where: {
          viewer_user_id: { in: viewers },
        },
      });

      // ถ้าไม่มี target → แปลว่าต้องการเคลียร์สิทธิ์ของ viewer กลุ่มนี้ทิ้งเฉย ๆ
      if (!targets.length) {
        return;
      }

      // 2) สร้างสิทธิ์ใหม่ = viewers x targets
      const data: Prisma.leave_visibilityCreateManyInput[] = viewers.flatMap((viewerId) =>
        targets.map((targetId) => ({
          viewer_user_id: viewerId,
          target_user_id: targetId,
        })),
      );

      await tx.leave_visibility.createMany({
        data,
        skipDuplicates: true,
      });
    });
  }
}
