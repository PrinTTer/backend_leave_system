import { Test, TestingModule } from '@nestjs/testing';
import { LeaveVisibilityController } from './leave-visibility.controller';
import { LeaveVisibilityService } from './leave-visibility.service';

describe('LeaveVisibilityController', () => {
  let controller: LeaveVisibilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveVisibilityController],
      providers: [LeaveVisibilityService],
    }).compile();

    controller = module.get<LeaveVisibilityController>(LeaveVisibilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
