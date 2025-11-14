import { Controller } from '@nestjs/common';
import { LeaveTypeDocumentService } from './leave-type-document.service';

@Controller('leave-type-document')
export class LeaveTypeDocumentController {
  constructor(private readonly leaveTypeDocumentService: LeaveTypeDocumentService) {}
}
