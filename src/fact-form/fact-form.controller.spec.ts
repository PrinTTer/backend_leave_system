import { Test, TestingModule } from '@nestjs/testing';
import { FactFormService } from './fact-form.service';
import { FactFormController } from './fact-form.controller';

describe('FactFormController', () => {
  let controller: FactFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FactFormController],
      providers: [FactFormService],
    }).compile();

    controller = module.get<FactFormController>(FactFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
