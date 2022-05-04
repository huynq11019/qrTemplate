import {IBuilding} from './building.model';
import {IFloor} from './floor.model';
import {IUnit} from './unit.model';

export interface ICustomerRent {
  id?: string;
  buildingId?: string;
  floorId?: string;
  unitId?: string;
  building?: IBuilding;
  floor?: IFloor;
  unit?: IUnit;
  organizationId?: string;
  leasingStatus?: string;
  deleted?: boolean;
}

export class CustomerRent implements ICustomerRent {
  constructor(
    public id?: string,
    public buildingId?: string,
    public floorId?: string,
    public unitId?: string,
    public building?: IBuilding,
    public floor?: IFloor,
    public unit?: IUnit,
    public organizationId?: string,
    public leasingStatus?: string,
    public deleted?: boolean,
  ) {
    this.id = id;
    this.buildingId = buildingId;
    this.floorId = floorId;
    this.unitId = unitId;
    this.building = building;
    this.floor = floor;
    this.unit = unit;
    this.organizationId = organizationId;
    this.leasingStatus = leasingStatus;
    this.deleted = deleted;
  }
}
