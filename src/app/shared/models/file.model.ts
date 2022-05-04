export interface IFile {
  id?: string;
  originalName?: string;
  path?: string;
  hashed?: string;
  ownerId?: string;
  ownerType?: string;

  version?: number;
  size?: number;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;

  downloadUrl?: string;
  viewUrl?: string;
}

export class File implements IFile {
  id?: string;
  originalName?: string;
  path?: string;
  hashed?: string;
  ownerId?: string;
  ownerType?: string;

  version?: number;
  size?: number;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;

  downloadUrl?: string;
  viewUrl?: string;

  constructor(data?: IFile) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) {
          (this as any)[property] = (data as any)[property];
        }
      }
    }
  }
}
