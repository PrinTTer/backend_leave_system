import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveTypeDocumentDto } from './create-leave-type-document.dto';

export class UpdateLeaveTypeDocumentDto extends PartialType(CreateLeaveTypeDocumentDto) {}
