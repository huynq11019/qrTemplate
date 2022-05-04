export class UserPrimary {
  constructor(
    public buildingIds?: string[],
    public grantedPermissions?: any,
    public isRoot?: boolean,
    public lastAuthChangeAt?: any,
    public organizationId?: string,
    public userId?: string,
    public userLevel?: string,
  ) {
    this.buildingIds = buildingIds;
    this.grantedPermissions = grantedPermissions;
    this.isRoot = isRoot;
    this.lastAuthChangeAt = lastAuthChangeAt;
    this.organizationId = organizationId;
    this.userId = userId;
    this.userLevel = userLevel;
  }
}
