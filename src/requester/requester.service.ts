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
        nontri_account: dto.nontri_account,
        approver_nontri_account: dto.approver_nontri_account,
        approver_order: dto.approver_order,
      })),
      skipDuplicates: true,
    });
  }

  async deleteRequester(dtos: CreateRequesterDto[]) {
    const deletePromises = dtos.map((dto) =>
      this.prisma.requester.deleteMany({
        where: {
          nontri_account: dto.nontri_account,
          approver_nontri_account: dto.approver_nontri_account,
          approver_order: dto.approver_order,
        },
      }),
    );

    return await Promise.all(deletePromises);
  }

  private mapApproversByOrder(requesters: CreateRequesterDto[]) {
    const grouped: Record<string, Requester> = {};

    requesters.forEach((r) => {
      const userId = r.nontri_account;
      if (!grouped[userId]) {
        grouped[userId] = {
          nontri_account: userId,
          user: UserMock.list.find((u) => u.nontri_account === userId) || null,
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

      const approver =
        ApproverMock.list.find((a) => a.nontri_account === r.approver_nontri_account) || null;
      if (approver) {
        grouped[userId][orderKey].push(approver);
      }
    });

    return Object.values(grouped);
  }

  async getRequesterByUserId(nontri_account: string) {
    const req = await this.prisma.requester.findMany({
      where: { nontri_account: nontri_account },
    });

    return this.mapApproversByOrder(req);
  }

  async getRequesterByApproverId(approver_nontri_account: string) {
    const req = await this.prisma.requester.findMany({
      where: { approver_nontri_account: approver_nontri_account },
    });
    return this.mapApproversByOrder(req);
  }

  async getAllRequester() {
    const req = await this.prisma.requester.findMany();

    return this.mapApproversByOrder(req);
  }
}
