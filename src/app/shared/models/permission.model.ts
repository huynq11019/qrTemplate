export interface IPermission {
  id?: string;
  resourceCode?: string;
  resourceName?: string;
  name?: string;
  scope?: any;
  deleted?: boolean;
  checked?: boolean;
}

export class Permission implements IPermission {
  constructor(
    public id?: string,
    public resourceCode?: string,
    public resourceName?: string,
    public name?: string,
    public scope?: any,
    public deleted?: boolean,
    public checked?: boolean,
  ) {
    this.id = id;
    this.resourceCode = resourceCode;
    this.resourceName = resourceName;
    this.name = name;
    this.scope = scope;
    this.deleted = deleted;
    this.checked = checked;
  }
}
