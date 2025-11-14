import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveApprovalRuleDto } from './create-leave-approval-rule.dto';

export class UpdateLeaveApprovalRuleDto extends PartialType(CreateLeaveApprovalRuleDto) {}
