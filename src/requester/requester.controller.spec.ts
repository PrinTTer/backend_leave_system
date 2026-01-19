import { Test, TestingModule } from '@nestjs/testing';
import { RequesterController } from './requester.controller';
import { RequesterService } from './requester.service';

describe('RequesterController', () => {
  let controller: RequesterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequesterController],
      providers: [RequesterService],
    }).compile();

    controller = module.get<RequesterController>(RequesterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
