import { Test, TestingModule } from '@nestjs/testing';
import { LeaveTypeDocumentService } from './leave-type-document.service';

describe('LeaveTypeDocumentService', () => {
  let service: LeaveTypeDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveTypeDocumentService],
    }).compile();

    service = module.get<LeaveTypeDocumentService>(LeaveTypeDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
