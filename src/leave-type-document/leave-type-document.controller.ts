import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeaveTypeDocumentService } from './leave-type-document.service';
import { CreateLeaveTypeDocumentDto } from './dto/create-leave-type-document.dto';
import { UpdateLeaveTypeDocumentDto } from './dto/update-leave-type-document.dto';

@Controller('leave-type-document')
export class LeaveTypeDocumentController {
  constructor(private readonly leaveTypeDocumentService: LeaveTypeDocumentService) {}

  @Post()
  create(@Body() createLeaveTypeDocumentDto: CreateLeaveTypeDocumentDto) {
    return this.leaveTypeDocumentService.create(createLeaveTypeDocumentDto);
  }

  @Get()
  findAll() {
    return this.leaveTypeDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveTypeDocumentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveTypeDocumentDto: UpdateLeaveTypeDocumentDto) {
    return this.leaveTypeDocumentService.update(+id, updateLeaveTypeDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveTypeDocumentService.remove(+id);
  }
}
