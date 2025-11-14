import { Injectable } from '@nestjs/common';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';

@Injectable()
export class LeaveTypeService {
  create(createLeaveTypeDto: CreateLeaveTypeDto) {
    return 'This action adds a new leaveType';
  }

  findAll() {
    return `This action returns all leaveType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} leaveType`;
  }

  update(id: number, updateLeaveTypeDto: UpdateLeaveTypeDto) {
    return `This action updates a #${id} leaveType`;
  }

  remove(id: number) {
    return `This action removes a #${id} leaveType`;
  }
}
