export interface ICustomerContact {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dayOfBirth?: string;
  gender?: string;
  organizationId?: string;
  userId?: any;
  deleted?: boolean;
}

export class CustomerContact implements ICustomerContact {
  constructor(
    public id?: string,
    public fullName?: string,
    public email?: string,
    public phoneNumber?: string,
    public dayOfBirth?: string,
    public gender?: string,
    public organizationId?: string,
    public userId?: any,
    public deleted?: boolean,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.dayOfBirth = dayOfBirth;
    this.gender = gender;
    this.organizationId = organizationId;
    this.userId = userId;
    this.deleted = deleted;
  }
}
