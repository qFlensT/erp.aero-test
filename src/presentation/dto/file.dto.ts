export class FileDto {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: Date;
  ext?: string;
}
