import { ICustomerContact } from './customer-contact.model';

export interface ICustomer {
  id?: string;
  name?: string;
  code?: string;
  taxNumber?: string;
  contacts?: ICustomerContact[];
  phoneNumber?: string;
  email?: string;
  legalRepresentative?: string;
  businessCode?: string;
  invoiceIssuingAddress?: string;
  checked?: boolean;
  disabled?: boolean;
  deleted?: boolean;
  status?: string;
  type?: string;
  incorporationDate?: string;
}

export class Customer implements ICustomer {
  constructor(
    public id?: string,
    public name?: string,
    public code?: string,
    public taxNumber?: string,
    public contacts?: ICustomerContact[],
    public phoneNumber?: string,
    public email?: string,
    public legalRepresentative?: string,
    public businessCode?: string,
    public invoiceIssuingAddress?: string,
    public checked?: boolean,
    public disabled?: boolean,
    public deleted?: boolean,
    public status?: string,
    public type?: string,
    public incorporationDate?: string,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.taxNumber = taxNumber;
    this.contacts = contacts;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.legalRepresentative = legalRepresentative;
    this.businessCode = businessCode;
    this.invoiceIssuingAddress = invoiceIssuingAddress;
    this.checked = checked;
    this.disabled = disabled;
    this.deleted = deleted;
    this.status = status;
    this.type = type;
    this.incorporationDate = incorporationDate;
  }
}
