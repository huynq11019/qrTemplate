export interface IUnit {
  id?: string;
  name?: string;
  code?: string;
  type?: string;
  price?: number;
  area?: number;
  status?: string;
  leasingStatus?: string;
  note?: string;
  deleted?: boolean;
  checked?: boolean;
  buildingId?: string;
  buildingCode?: string;
  floorId?: string;
  floorNumber?: number;
  floorName?: string;
  fileIds?: string;
  organizationName?: string;
  legalRepresentative?: string;
  isDefault?: boolean;
}

export class Unit implements IUnit {
  constructor(
    public id?: string,
    public name?: string,
    public type?: string,
    public code?: string,
    public price?: number,
    public area?: number,
    public status?: string,
    public note?: string,
    public deleted?: boolean,
    public checked?: boolean,
    public buildingId?: string,
    public buildingCode?: string,
    public floorId?: string,
    public floorNumber?: number,
    public fileIds?: string,
    public organizationName?: string,
    public legalRepresentative?: string,
    public isDefault?: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.type = type;
    this.code = code;
    this.price = price;
    this.area = area;
    this.status = status;
    this.deleted = deleted;
    this.checked = checked;
    this.buildingId = buildingId;
    this.buildingCode = buildingCode;
    this.floorId = floorId;
    this.floorNumber = floorNumber;
    this.fileIds = fileIds;
    this.organizationName = organizationName;
    this.legalRepresentative = legalRepresentative;
    this.isDefault = isDefault;
  }
}
