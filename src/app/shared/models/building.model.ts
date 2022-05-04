import {Floor} from './floor.model';

export interface IBuilding {
  id?: string;
  name?: string;
  totalFloor?: number;
  code?: string;
  address?: string;
  provinceCode?: string;
  districtCode?: string;
  description?: string;
  wardCode?: string;
  location?: string;
  deleted?: boolean;
  active?: boolean;
  status?: string;
  checked?: boolean;
  note?: string;
  area?: number;
  floors?: Array<Floor>;
}

export class Building implements IBuilding{
  constructor(
    public id?: string,
    public name?: string,
    public totalFloor?: number,
    public code?: string,
    public address?: string,
    public provinceCode?: string,
    public districtCode?: string,
    public wardCode?: string,
    public location?: string,
    public deleted?: boolean,
    public active?: boolean,
    public status?: string,
    public checked?: boolean,
    public note?: string,
    public area?: number,
    public description?: string,
    public floors?: Array<Floor>,
  ){
    this.id = id;
    this.name = name;
    this.totalFloor = totalFloor;
    this.code = code;
    this.address = address;
    this.provinceCode = provinceCode;
    this.districtCode = districtCode;
    this.wardCode = wardCode;
    this.location = location;
    this.deleted = deleted;
    this.active = active;
    this.status = status;
    this.checked = checked;
    this.area = area;
    this.floors = floors;
    this.note = note;
    this.description = description;
  }
}
