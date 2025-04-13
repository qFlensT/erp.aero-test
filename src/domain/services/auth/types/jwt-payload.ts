import { UserEntity } from 'src/domain/entities/user.entity';

export type JwtPayload = Pick<UserEntity, 'id'>;
