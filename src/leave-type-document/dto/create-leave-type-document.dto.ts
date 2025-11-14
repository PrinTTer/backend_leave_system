import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsBoolean,
  MaxLength,
  IsOptional,
} from 'class-validator';

export enum FileType {
  PDF = 'pdf',
  PNG = 'png',
  DOC = 'doc',
  JPG = 'jpg',
}

export class CreateLeaveTypeDocumentDto {
  @IsOptional()
  @IsInt()
  leave_type_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEnum(FileType)
  file_type: FileType;

  @IsNotEmpty()
  @IsBoolean()
  is_required: boolean;
}
