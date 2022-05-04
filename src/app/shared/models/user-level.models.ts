
export interface IUserLevel {
  userLevelKey?: string;
  userLevelValue?: string;
}

export class UserLevel implements IUserLevel {
  constructor(
    public userLevelKey?: string,
    public userLevelValue?: string,
  ){
    this.userLevelKey = userLevelKey;
    this.userLevelValue = userLevelValue;
  }
}
