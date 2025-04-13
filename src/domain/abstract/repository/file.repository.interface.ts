import { FileEntity } from 'src/domain/entities/file.entity';

export type CreateFileInputType = {
  id?: string;

  name: string;
  mimeType: string;
  sizeBytes: number;
  ext?: string;

  userId?: string;
};

export type UpdateFileInputType = Partial<
  Omit<CreateFileInputType, 'userId' | 'id' | 'ext'> & { ext?: string | null }
>;

export type ListFileParamsType = {
  listSize?: number;
  page?: number;
};

export abstract class IFileRepository {
  abstract create(input: CreateFileInputType): Promise<FileEntity>;
  abstract getById(id: string): Promise<FileEntity>;
  abstract list(
    params: ListFileParamsType,
  ): Promise<{ listSize: number; page: number; data: FileEntity[] }>;
  abstract delete(id: string): Promise<FileEntity>;
  abstract update(id: string, input: UpdateFileInputType): Promise<FileEntity>;
}
