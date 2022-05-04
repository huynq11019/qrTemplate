export interface IChangePassword {
  oldPassword?: string;
  newPassword?: string;
}
export class ChangePassword implements IChangePassword {
  constructor(
    public oldPassword?: string,
    public newPassword?: string,
  ) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}
