import { File, User } from 'generated/prisma';
import { FileEntity } from 'src/domain/entities/file.entity';
import { UserEntity } from 'src/domain/entities/user.entity';

export class Mapper {
  mapUser({ id, password }: User): UserEntity {
    return { id, password };
  }

  mapFile({
    createdAt,
    ext,
    id,
    mimeType,
    name,
    sizeBytes,
    updatedAt,
  }: File): FileEntity {
    const uploadedAt =
      createdAt.getTime() === updatedAt.getTime() ? createdAt : updatedAt;

    return { id, mimeType, name, sizeBytes, ext: ext || undefined, uploadedAt };
  }
}
