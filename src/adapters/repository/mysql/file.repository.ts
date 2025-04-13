import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Mapper } from './mapper';
import {
  CreateFileInputType,
  IFileRepository,
  ListFileParamsType,
  UpdateFileInputType,
} from 'src/domain/abstract/repository/file.repository.interface';
import { FileEntity } from 'src/domain/entities/file.entity';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: Mapper,
  ) {}

  async create({
    mimeType,
    name,
    sizeBytes,
    ext,
    userId,
    id,
  }: CreateFileInputType): Promise<FileEntity> {
    const file = await this.prisma.file.create({
      data: {
        id,
        mimeType,
        name,
        sizeBytes,
        ext,
        ...(userId && { user: { connect: { id: userId } } }),
      },
    });

    return this.mapper.mapFile(file);
  }

  async getById(id: string): Promise<FileEntity> {
    const file = await this.prisma.file.findUniqueOrThrow({ where: { id } });

    return this.mapper.mapFile(file);
  }

  async list({ listSize = 10, page = 1 }: ListFileParamsType): Promise<{
    listSize: number;
    page: number;
    data: FileEntity[];
  }> {
    const skip = (page - 1) * listSize;

    const files = await this.prisma.file.findMany({
      skip,
      take: listSize,
      orderBy: { createdAt: 'desc' }, // или другой критерий сортировки
    });

    return {
      listSize,
      page,
      data: files.map((file) => this.mapper.mapFile(file)),
    };
  }

  async delete(id: string): Promise<FileEntity> {
    const file = await this.prisma.file.delete({ where: { id } });

    return this.mapper.mapFile(file);
  }

  async update(id: string, input: UpdateFileInputType): Promise<FileEntity> {
    const file = await this.prisma.file.update({
      where: { id },
      data: {
        sizeBytes: input.sizeBytes,
        name: input.name,
        mimeType: input.mimeType,
        ext: input.ext,
      },
    });

    return this.mapper.mapFile(file);
  }
}
