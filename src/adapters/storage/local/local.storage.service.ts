import {
  IStorageService,
  SavedFileType,
  SaveFileInputType,
} from 'src/domain/abstract/storage.service.interface';
import { promises as fs } from 'fs';
import { join, extname, parse } from 'path';
import { createHash } from 'crypto';

export class LocalStorageService implements IStorageService {
  private readonly storagePath = join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'uploads',
  );

  // assume that only 1 file with a unique base name can exist
  async getPath(id: string): Promise<string> {
    const files = await fs.readdir(this.storagePath);

    const targetFile = files.find((file) => parse(file).name === id);

    if (!targetFile) {
      throw new Error(`File not found`);
    }

    return join(this.storagePath, targetFile);
  }

  async save(
    { buffer, name, mimeType }: SaveFileInputType,
    id?: string,
  ): Promise<SavedFileType> {
    const sha256 = createHash('sha256').update(buffer).digest('hex');
    const fileExt = extname(name);
    const fileId = id || `${Date.now()}-${sha256}`;

    const fullPath = join(this.storagePath, `${fileId}${fileExt}`);

    await fs.mkdir(this.storagePath, { recursive: true });

    await fs.writeFile(fullPath, buffer);

    return {
      id: fileId,
      mimeType,
      totalBytes: buffer.length,
      sha256,
      extension: fileExt || undefined,
    };
  }

  async delete(id: string): Promise<void> {
    const fullPath = await this.getPath(id);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      if ('code' in error && (error as { code: string }).code === 'ENOENT') {
        return;
      }

      throw error;
    }
  }

  async get(id: string): Promise<Buffer> {
    const fullPath = await this.getPath(id);

    return fs.readFile(fullPath);
  }

  async update(id: string, { buffer, mimeType, name }: SaveFileInputType) {
    // checking if file exists
    await this.delete(id);
    return await this.save({ buffer, mimeType, name }, id);
  }
}
