import { Injectable } from '@nestjs/common';
import { CreateLeaveTypeDocumentDto } from './dto/create-leave-type-document.dto';
import { UpdateLeaveTypeDocumentDto } from './dto/update-leave-type-document.dto';

@Injectable()
export class LeaveTypeDocumentService {
  create(createLeaveTypeDocumentDto: CreateLeaveTypeDocumentDto) {
    return 'This action adds a new leaveTypeDocument';
  }

  findAll() {
    return `This action returns all leaveTypeDocument`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaveTypeDocument`;
  }

  update(id: number, updateLeaveTypeDocumentDto: UpdateLeaveTypeDocumentDto) {
    return `This action updates a #${id} leaveTypeDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaveTypeDocument`;
  }
}
