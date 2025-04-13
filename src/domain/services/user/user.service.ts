import { Injectable } from '@nestjs/common';
import {
  CreateUserInput,
  IUserRepository,
} from 'src/domain/abstract/repository/user.repository.interface';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserNotFoundError } from './errors/user-not-found.error';
import { UserCreateError } from './errors/user-create.error';

@Injectable()
export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async create({ id, password }: CreateUserInput): Promise<UserEntity> {
    try {
      return await this.repository.create({ id, password });
    } catch {
      throw new UserCreateError();
    }
  }

  async getById(id: string): Promise<UserEntity> {
    try {
      return await this.repository.getById(id);
    } catch {
      throw new UserNotFoundError();
    }
  }
}
