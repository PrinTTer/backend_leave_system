import { Test, TestingModule } from '@nestjs/testing';
import { FactFormService } from './fact-form.service';

describe('FactFormService', () => {
  let service: FactFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactFormService],
    }).compile();

    service = module.get<FactFormService>(FactFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
