import { Injectable } from '@nestjs/common';
import {
  IFileRepository,
  ListFileParamsType,
} from 'src/domain/abstract/repository/file.repository.interface';
import {
  IStorageService,
  SavedFileType,
} from 'src/domain/abstract/storage.service.interface';
import { FileEntity } from 'src/domain/entities/file.entity';
import { FileSaveError } from 'src/domain/services/file/errors/file-save.error';
import { SaveFileInputType } from './types/save.input';
import { FileDeleteError } from 'src/domain/services/file/errors/file-delete.error';
import { FileNotFoundError } from 'src/domain/services/file/errors/file-not-found.error';
import { UpdateFileInputType } from './types/update.input';
import { FileUpdateError } from './errors/file-update.error';

@Injectable()
export class FileService {
  constructor(
    private readonly repository: IFileRepository,
    private readonly storage: IStorageService,
  ) {}

  async getById(id: string): Promise<FileEntity> {
    try {
      return await this.repository.getById(id);
    } catch {
      throw new FileNotFoundError(id);
    }
  }

  async getWithDataById(
    id: string,
  ): Promise<{ data: Buffer; file: FileEntity }> {
    try {
      const [file, data] = await Promise.all([
        this.repository.getById(id),
        this.storage.get(id),
      ]);

      return { file, data };
    } catch {
      throw new FileNotFoundError(id);
    }
  }

  async list({ listSize, page }: ListFileParamsType = {}): Promise<{
    listSize: number;
    page: number;
    data: FileEntity[];
  }> {
    return this.repository.list({ listSize, page });
  }

  async save({ file, user }: SaveFileInputType): Promise<FileEntity> {
    let savedFile: SavedFileType | undefined;

    try {
      savedFile = await this.storage.save(file);

      return await this.repository.create({
        id: savedFile.id,
        mimeType: savedFile.mimeType,
        name: file.name,
        sizeBytes: savedFile.totalBytes,
        ext: savedFile.extension,
        userId: user?.id,
      });
    } catch {
      if (savedFile) {
        await this.storage.delete(savedFile.id);
      }

      throw new FileSaveError(savedFile?.id);
    }
  }

  async delete(id: string): Promise<FileEntity> {
    // можно реализовать rollback логику на восстановление файла

    try {
      const [file] = await Promise.all([
        this.repository.delete(id),
        this.storage.delete(id),
      ]);
      return file;
    } catch {
      throw new FileDeleteError(id);
    }
  }

  async update(id: string, { file }: UpdateFileInputType) {
    // можно реализовать rollback логику на восстановление файла
    let updatedFile: SavedFileType | undefined;

    try {
      updatedFile = await this.storage.update(id, {
        buffer: file.buffer,
        mimeType: file.mimeType,
        name: file.name,
      });

      return await this.repository.update(id, {
        sizeBytes: updatedFile.totalBytes,
        ext: updatedFile.extension || null,
        mimeType: updatedFile.mimeType,
        name: file.name,
      });
    } catch {
      throw new FileUpdateError(id);
    }
  }
}
