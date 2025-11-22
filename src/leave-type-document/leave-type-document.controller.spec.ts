import { Test, TestingModule } from '@nestjs/testing';
import { LeaveTypeDocumentController } from './leave-type-document.controller';
import { LeaveTypeDocumentService } from './leave-type-document.service';

describe('LeaveTypeDocumentController', () => {
  let controller: LeaveTypeDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveTypeDocumentController],
      providers: [LeaveTypeDocumentService],
    }).compile();

    controller = module.get<LeaveTypeDocumentController>(LeaveTypeDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
