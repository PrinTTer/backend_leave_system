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
    const { viewer_nontri_accounts, target_nontri_accounts, action, created_by_nontri_account } =
      dto;

    if (action === 'grant') {
      const data = viewer_nontri_accounts.flatMap((viewerId) =>
        target_nontri_accounts.map((targetId) => ({
          viewer_nontri_account: viewerId,
          target_nontri_account: targetId,
          created_by_nontri_account: created_by_nontri_account ?? null,
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
          viewer_nontri_account: { in: viewer_nontri_accounts },
          target_nontri_account: { in: target_nontri_accounts },
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
        viewer_nontri_account: dto.viewer_nontri_account,
        target_nontri_account: dto.target_nontri_account,
        created_by_nontri_account: dto.created_by_nontri_account ?? undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.leave_visibility.delete({
      where: { leave_visibility_id: id },
    });
  }
  findTargetsForViewer(viewer_nontri_account: string) {
    return this.prisma.leave_visibility.findMany({
      where: { viewer_nontri_account: viewer_nontri_account },
    });
  }
  findViewersForTarget(target_nontri_account: string) {
    return this.prisma.leave_visibility.findMany({
      where: { target_nontri_account: target_nontri_account },
    });
  }
  async canViewerSeeTarget(viewer_nontri_account: string, target_nontri_account: string) {
    const record = await this.prisma.leave_visibility.findFirst({
      where: {
        viewer_nontri_account: viewer_nontri_account,
        target_nontri_account: target_nontri_account,
      },
    });
    return !!record;
  }

  async getConfig(): Promise<{ viewers: string[]; targets: string[] }> {
    const viewerRows = await this.prisma.leave_visibility.findMany({
      select: { viewer_nontri_account: true },
      distinct: ['viewer_nontri_account'],
    });

    const targetRows = await this.prisma.leave_visibility.findMany({
      select: { target_nontri_account: true },
      distinct: ['target_nontri_account'],
    });

    return {
      viewers: viewerRows.map((v) => v.viewer_nontri_account),
      targets: targetRows.map((t) => t.target_nontri_account),
    };
  }

  async saveConfig(viewers: string[], targets: string[]): Promise<void> {
    if (!viewers.length) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      // 1) ลบสิทธิ์เดิมของ viewer กลุ่มนี้
      await tx.leave_visibility.deleteMany({
        where: {
          viewer_nontri_account: { in: viewers },
        },
      });

      // ถ้าไม่มี target → แปลว่าต้องการเคลียร์สิทธิ์ของ viewer กลุ่มนี้ทิ้งเฉย ๆ
      if (!targets.length) {
        return;
      }

      // 2) สร้างสิทธิ์ใหม่ = viewers x targets
      const data: Prisma.leave_visibilityCreateManyInput[] = viewers.flatMap((viewerId) =>
        targets.map((targetId) => ({
          viewer_nontri_account: viewerId,
          target_nontri_account: targetId,
        })),
      );

      await tx.leave_visibility.createMany({
        data,
        skipDuplicates: true,
      });
    });
  }
}
