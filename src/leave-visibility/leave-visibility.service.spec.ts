import { Test, TestingModule } from '@nestjs/testing';
import { LeaveVisibilityService } from './leave-visibility.service';

describe('LeaveVisibilityService', () => {
  let service: LeaveVisibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveVisibilityService],
    }).compile();

    service = module.get<LeaveVisibilityService>(LeaveVisibilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
