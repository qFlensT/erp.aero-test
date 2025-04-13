import { FileEntity } from 'src/domain/entities/file.entity';
import { FileDto } from '../dto/file.dto';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserDto } from '../dto/user.dto';

export class EntityToDtoMapper {
  mapFile({
    id,
    mimeType,
    name,
    sizeBytes,
    uploadedAt,
    ext,
  }: FileEntity): FileDto {
    return { id, mimeType, name, sizeBytes, uploadedAt, ext };
  }

  mapUser({ id }: Omit<UserEntity, 'password'>): UserDto {
    return { id };
  }
}
