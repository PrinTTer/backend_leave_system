import { Injectable } from '@nestjs/common';
import { CreateRequesterDto } from './dto/create-requester.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserMock } from 'src/mock/user.mock';
import { ApproverMock } from 'src/mock/approver.mock';
import { Requester } from 'src/mock/approval.mock';

@Injectable()
export class RequesterService {
  constructor(private readonly prisma: PrismaService) {}
  async createAndUpdateRequester(dto: CreateRequesterDto[]) {
    return await this.prisma.requester.createMany({
      data: dto.map((dto) => ({
        user_id: dto.user_id,
        approver_id: dto.approver_id,
        approver_order: dto.approver_order,
      })),
      skipDuplicates: true,
    });
  }

  async deleteRequester(dtos: CreateRequesterDto[]) {
    const deletePromises = dtos.map((dto) =>
      this.prisma.requester.deleteMany({
        where: {
          user_id: dto.user_id,
          approver_id: dto.approver_id,
          approver_order: dto.approver_order,
        },
      }),
    );

    return await Promise.all(deletePromises);
  }

  private mapApproversByOrder(requesters: CreateRequesterDto[]) {
    const grouped: Record<number, Requester> = {};

    requesters.forEach((r) => {
      const userId = r.user_id;
      if (!grouped[userId]) {
        grouped[userId] = {
          user_id: userId,
          user: UserMock.list.find((u) => u.id === userId) || null,
          approver_order1: [],
          approver_order2: [],
          approver_order3: [],
          approver_order4: [],
        };
      }

      const orderKey = `approver_order${r.approver_order}` as
        | 'approver_order1'
        | 'approver_order2'
        | 'approver_order3'
        | 'approver_order4';

      const approver = ApproverMock.list.find((a) => a.id === r.approver_id) || null;
      if (approver) {
        grouped[userId][orderKey].push(approver);
      }
    });

    return Object.values(grouped);
  }

  async getRequesterByUserId(userId: number) {
    const req = await this.prisma.requester.findMany({
      where: { user_id: userId },
    });

    return this.mapApproversByOrder(req);
  }

  async getRequesterByApproverId(approverId: number) {
    const req = await this.prisma.requester.findMany({
      where: { approver_id: approverId },
    });
    return this.mapApproversByOrder(req);
  }

  async getAllRequester() {
    const req = await this.prisma.requester.findMany();

    return this.mapApproversByOrder(req);
  }
}
