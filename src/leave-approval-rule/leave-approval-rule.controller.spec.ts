import { Test, TestingModule } from '@nestjs/testing';
import { LeaveApprovalRuleController } from './leave-approval-rule.controller';
import { LeaveApprovalRuleService } from './leave-approval-rule.service';

describe('LeaveApprovalRuleController', () => {
  let controller: LeaveApprovalRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveApprovalRuleController],
      providers: [LeaveApprovalRuleService],
    }).compile();

    controller = module.get<LeaveApprovalRuleController>(LeaveApprovalRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
