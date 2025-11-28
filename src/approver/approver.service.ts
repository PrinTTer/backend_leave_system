import { Injectable } from '@nestjs/common';
import { ApproverDto } from './dto/approver.dto';
import { Role } from 'src/mock/role.mock';
import { UserMock } from 'src/mock/user.mock';

@Injectable()
export class ApproverService {
  getApprovers(): ApproverDto[] {
    const users = UserMock.list;
    const roles = Role.list;

    const approvers: ApproverDto[] = roles
      .map((roleItem) => {
        const user = users.find((u) => u.nontri_account === roleItem.nontri_account);
        if (!user) return null;
        const levels = roleItem.role.filter((r) => r.visibility === 'show').map((r) => r.priority);
        const dto = new ApproverDto();
        dto.nontri_account = user.nontri_account;
        dto.academic_position = user.other_prefix || null;
        dto.pronoun = user.prefix || null;
        dto.thai_name = user.fullname;
        dto.department = user.department;
        dto.position = user.position;
        dto.position_approver = roleItem.approve_position;
        dto.level = levels;
        return dto;
      })
      .filter((a): a is ApproverDto => a !== null);

    return approvers;
  }
}
