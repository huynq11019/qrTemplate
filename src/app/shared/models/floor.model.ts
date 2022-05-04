import {IUnit} from './unit.model';

export interface IFloor {
  id?: string;
  buildingId?: string;
  name?: string;
  code?: string;
  description?: string;
  status?: string;
  floorNumber?: number;
  totalArea?: number;
  availableArea?: number;
  deleted?: boolean;
  checked?: boolean;
  defaultUnit?: IUnit;
  units?: IUnit[];
  usedArea?: number;
}

export class Floor implements IFloor {
  constructor(
    public id?: string,
    public buildingId?: string,
    public name?: string,
    public code?: string,
    public description?: string,
    public status?: string,
    public floorNumber?: number,
    public totalArea?: number,
    public availableArea?: number,
    public deleted?: boolean,
    public checked?: boolean,
    public defaultUnit?: IUnit,
    public units?: IUnit[],
    public usedArea?: number
  ){
    this.id = id;
    this.buildingId = buildingId;
    this.name = name;
    this.code = code;
    this.description = description;
    this.status = status;
    this.floorNumber = floorNumber;
    this.totalArea = totalArea;
    this.availableArea = availableArea;
    this.deleted = deleted;
    this.checked = checked;
    this.defaultUnit = defaultUnit;
    this.units = units;
    this.usedArea = usedArea;
  }
}

