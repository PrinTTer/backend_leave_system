import { Injectable } from '@nestjs/common';
import { User, UserMock } from '../mock/user.mock';

@Injectable()
export class UserService {
  findAll(): User[] {
    return UserMock.list;
  }

  getAllDepartments(): string[] {
    const departments = UserMock.list.map((u) => u.department);
    return [...new Set(departments)];
  }

  getAllFaculties(): string[] {
    const faculties = UserMock.list.map((u) => u.faculty);
    return [...new Set(faculties)];
  }

  findByNontriAccount(nontri_account: string): User | undefined {
    return UserMock.list.find((u) => u.nontri_account === nontri_account);
  }
}
