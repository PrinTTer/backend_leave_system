import { Test, TestingModule } from '@nestjs/testing';
import { FactLeaveCreditController } from './fact-leave-credit.controller';
import { FactLeaveCreditService } from './fact-leave-credit.service';

describe('FactLeaveCreditController', () => {
  let controller: FactLeaveCreditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FactLeaveCreditController],
      providers: [FactLeaveCreditService],
    }).compile();

    controller = module.get<FactLeaveCreditController>(FactLeaveCreditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
