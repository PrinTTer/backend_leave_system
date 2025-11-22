import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { FileType } from './create-leave-type-document.dto';
export class UpdateLeaveTypeDocumentDto {
  @IsOptional()
  @IsInt()
  leave_type_document_id?: number;

  @IsString() name: string;

  @IsEnum(FileType) file_type: FileType;

  @IsOptional() @IsBoolean() is_required?: boolean;
}
