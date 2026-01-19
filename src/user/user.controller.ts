import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../mock/user.mock';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get('departments')
  getAllDepartments(): string[] {
    return this.userService.getAllDepartments();
  }

  @Get('faculties')
  getAllFaculties(): string[] {
    return this.userService.getAllFaculties();
  }

  @Get(':nontri_account')
  findByNontriAccount(@Param('nontri_account') nontri_account: string): User | undefined {
    return this.userService.findByNontriAccount(nontri_account);
  }
}
