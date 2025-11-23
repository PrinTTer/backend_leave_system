import { Controller, Body, Post, Patch } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';

@Controller('approval')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}
  @Post()
  create(@Body() dto: CreateApprovalDto[]) {
    return this.approvalService.createApproval(dto);
  }

  @Patch()
  update(@Body() dto: CreateApprovalDto) {
    return this.approvalService.updateApprovalStatus(dto);
  }
}
