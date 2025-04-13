import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import {
  CreateUserInput,
  IUserRepository,
} from 'src/domain/abstract/repository/user.repository.interface';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Mapper } from './mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: Mapper,
  ) {}

  async create({ id, password }: CreateUserInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({ data: { id, password } });

    return this.mapper.mapUser(user);
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });

    return this.mapper.mapUser(user);
  }
}
