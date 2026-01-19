import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateApprovalDto, ApprovalStatus } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { UserMock } from 'src/mock/user.mock';

@Injectable()
export class ApprovalService {
  constructor(private readonly prisma: PrismaService) {}
  async createApproval(dto: CreateApprovalDto[]) {
    return await this.prisma.approval.createMany({
      data: dto.map((dto) => ({
        nontri_account: dto.nontri_account,
        approver_nontri_account: dto.nontri_account,
        fact_form_id: dto.fact_form_id,
        status: ApprovalStatus.PENDING,
      })),
    });
  }
  async updateApprovalStatus(dto: UpdateApprovalDto) {
    return await this.prisma.approval.updateMany({
      where: {
        nontri_account: dto.nontri_account,
        fact_form_id: dto.fact_form_id,
        approver_nontri_account: dto.approver_nontri_account,
      },
      data: {
        status: dto.status,
      },
    });
  }
  async getApprovalsByUserId(nontri_account: string) {
    const req = await this.prisma.approval.findMany({
      where: { nontri_account: nontri_account },
      include: {
        fact_form: {
          include: {
            leave_type: true,
          },
        },
      },
    });
    const user = UserMock.list.find((u) => u.nontri_account === nontri_account) || null;
    return {
      approvals: req,
      user: user,
    };
  }
  // async getApprovalsByApproverId(approverId: number) {
  //   const req = await this.prisma.approval.findMany({
  //     where: { approver_id: approverId },
  //     include: {
  //       fact_form: {
  //         include: {
  //           leave_type: true,
  //         },
  //       },
  //     },
  //   });
  //   const user = UserMock.list.find((u) => u.id === userId) || null;
  //   return {
  //     approvals: req,
  //     user: user,
  //   };
  // }
}
