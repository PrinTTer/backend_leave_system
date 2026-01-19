import { Test, TestingModule } from '@nestjs/testing';
import { FactLeaveCreditService } from './fact-leave-credit.service';

describe('FactLeaveCreditService', () => {
  let service: FactLeaveCreditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactLeaveCreditService],
    }).compile();

    service = module.get<FactLeaveCreditService>(FactLeaveCreditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
