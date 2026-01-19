import { Controller, Body, Post, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RequesterService } from './requester.service';
import { CreateRequesterDto } from './dto/create-requester.dto';

@Controller('requester')
export class RequesterController {
  constructor(private readonly requesterService: RequesterService) {}
  @Get()
  async getAllRequester() {
    return this.requesterService.getAllRequester();
  }

  @Get('by-user/:nontri_account')
  async getRequesterByUserId(@Param('nontri_account') nontri_account: string) {
    return this.requesterService.getRequesterByUserId(nontri_account);
  }

  @Get('by-approver/:approver_nontri_account')
  async getRequesterByApproverId(
    @Param('approver_nontri_account') approver_nontri_account: string,
  ) {
    return this.requesterService.getRequesterByApproverId(approver_nontri_account);
  }

  @Post()
  async createRequester(@Body() dto: CreateRequesterDto[]) {
    return this.requesterService.createAndUpdateRequester(dto);
  }

  @Delete()
  async deleteRequester(@Body() dto: CreateRequesterDto[]) {
    return this.requesterService.deleteRequester(dto);
  }
}
