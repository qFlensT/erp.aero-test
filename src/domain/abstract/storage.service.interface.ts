export type SavedFileType = {
  id: string;
  mimeType: string;
  totalBytes: number;
  sha256: string;
  extension?: string;
};

export type SaveFileInputType = {
  buffer: Buffer;
  name: string;
  mimeType: string;
};

export type UpdateFileInputType = SaveFileInputType;

export abstract class IStorageService {
  abstract save(file: SaveFileInputType): Promise<SavedFileType>;
  abstract delete(id: string): Promise<void>;
  abstract get(id: string): Promise<Buffer>;
  abstract update(
    id: string,
    input: UpdateFileInputType,
  ): Promise<SavedFileType>;
}
