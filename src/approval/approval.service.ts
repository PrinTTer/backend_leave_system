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
        user_id: dto.user_id,
        approver_id: dto.approver_id,
        fact_form_id: dto.fact_form_id,
        status: ApprovalStatus.PENDING,
      })),
    });
  }
  async updateApprovalStatus(dto: UpdateApprovalDto) {
    return await this.prisma.approval.updateMany({
      where: {
        user_id: dto.user_id,
        fact_form_id: dto.fact_form_id,
        approver_id: dto.approver_id,
      },
      data: {
        status: dto.status,
      },
    });
  }
  async getApprovalsByUserId(userId: number) {
    const req = await this.prisma.approval.findMany({
      where: { user_id: userId },
      include: {
        fact_form: {
          include: {
            leave_type: true,
          },
        },
      },
    });
    const user = UserMock.list.find((u) => u.id === userId) || null;
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
