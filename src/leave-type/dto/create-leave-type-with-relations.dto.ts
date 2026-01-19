import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { CreateLeaveTypeDto } from './create-leave-type.dto';
import { CreateLeaveApprovalRuleDto } from 'src/leave-approval-rule/dto/create-leave-approval-rule.dto';
import { CreateLeaveTypeDocumentDto } from 'src/leave-type-document/dto/create-leave-type-document.dto';
import { CreateVacationRuleDto } from 'src/vacation-rule/dto/create-vacation-rule.dto';

export class CreateLeaveTypeWithRelationsDto extends CreateLeaveTypeDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLeaveApprovalRuleDto)
  leave_approval_rule?: CreateLeaveApprovalRuleDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLeaveTypeDocumentDto)
  leave_type_document?: CreateLeaveTypeDocumentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVacationRuleDto)
  vacation_rule?: CreateVacationRuleDto[];
}
