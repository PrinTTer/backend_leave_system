import { Test, TestingModule } from '@nestjs/testing';
import { LeaveApprovalRuleService } from './leave-approval-rule.service';

describe('LeaveApprovalRuleService', () => {
  let service: LeaveApprovalRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveApprovalRuleService],
    }).compile();

    service = module.get<LeaveApprovalRuleService>(LeaveApprovalRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
