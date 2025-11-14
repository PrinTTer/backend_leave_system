import { Test, TestingModule } from '@nestjs/testing';
import { VacationRuleController } from './vacation-rule.controller';
import { VacationRuleService } from './vacation-rule.service';

describe('VacationRuleController', () => {
  let controller: VacationRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacationRuleController],
      providers: [VacationRuleService],
    }).compile();

    controller = module.get<VacationRuleController>(VacationRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
