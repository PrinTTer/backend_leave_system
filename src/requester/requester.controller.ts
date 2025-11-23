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

  @Get('by-user/:userId')
  async getRequesterByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.requesterService.getRequesterByUserId(userId);
  }

  @Get('by-approver/:approverId')
  async getRequesterByApproverId(@Param('approverId', ParseIntPipe) approverId: number) {
    return this.requesterService.getRequesterByApproverId(approverId);
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
