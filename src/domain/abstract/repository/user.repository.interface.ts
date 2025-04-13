import { UserEntity } from 'src/domain/entities/user.entity';

export type CreateUserInput = {
  id: string;
  password: string;
};

export abstract class IUserRepository {
  abstract create(input: CreateUserInput): Promise<UserEntity>;
  abstract getById(id: string): Promise<UserEntity>;
}
