import { Controller, Get } from '@nestjs/common';
import { ApproverService } from './approver.service';
import { ApproverDto } from './dto/approver.dto';

@Controller('approvers')
export class ApproverController {
  constructor(private readonly approverService: ApproverService) {}

  @Get()
  getApprovers(): ApproverDto[] {
    return this.approverService.getApprovers();
  }
}
