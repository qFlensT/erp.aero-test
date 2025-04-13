export class FileEntity {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: Date;
  ext?: string;
}
