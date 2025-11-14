import { Test, TestingModule } from '@nestjs/testing';
import { VacationRuleService } from './vacation-rule.service';

describe('VacationRuleService', () => {
  let service: VacationRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VacationRuleService],
    }).compile();

    service = module.get<VacationRuleService>(VacationRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
