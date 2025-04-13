import { SaveFileInputType as StorageSaveFileInputType } from 'src/domain/abstract/storage.service.interface';

export type SaveFileInputType = {
  file: StorageSaveFileInputType;
  user?: {
    id: string;
  };
};
