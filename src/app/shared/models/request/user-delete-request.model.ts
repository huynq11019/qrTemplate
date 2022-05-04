export interface IUserDeleteRequest {
  ids?: string[];
}

export class UserDeleteRequest {
  constructor(
    public ids?: string[],
  ) {
    this.ids = ids;
  }
}
