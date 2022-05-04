import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  BUILDING_STATUS,
  LEASING_STATUS,
} from '@shared/constants/building.constants';
import {
  LEASED,
  LEASING_STATUS_CREATE,
} from '@shared/constants/customer.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS } from '@shared/constants/status.constants';
import { Building, IBuilding } from '@shared/models/building.model';
import { CustomerRent } from '@shared/models/customer-rent.model';
import { Floor, IFloor } from '@shared/models/floor.model';
import { IUnit, Unit } from '@shared/models/unit.model';
import { AccountService } from '@shared/services/account.service';
import { BuildingService } from '@shared/services/building.service';
import { CustomerService } from '@shared/services/customer.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UnitService } from '@shared/services/unit.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-leasing',
  templateUrl: './customer-leasing.component.html',
  styleUrls: ['./customer-leasing.component.scss'],
})
export class CustomerLeasingComponent implements OnInit {
  @Input() isUpdate = false;
  @Input() organizationId = '';
  @Input() leasing: CustomerRent = {};

  form: FormGroup = new FormGroup({
    buildingId: new FormControl(null),
    floorId: new FormControl(null),
    unitId: new FormControl(null),
    leasingStatus: new FormControl(null),
  });

  pagingRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.MAX_SIZE_DEFAULT,
  };

  buildings: IBuilding[] = [];
  floors: IFloor[] = [];
  units: IUnit[] = [];
  leasingStatus = LEASING_STATUS_CREATE;
  buildingStatus = BUILDING_STATUS;
  unitStatus = LEASING_STATUS;
  buildingIdPrevious = '';
  floorIdPrevious = '';

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private translate: TranslateService,
    private toast: ToastService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private buildingService: BuildingService,
    private unitService: UnitService
  ) {}

  ngOnInit(): void {
    this.getBuildings();
    this.initForm();
    this.valueChangesForm();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const body = this.form.value;
    delete body.buildingId;
    delete body.floorId;
    if (this.isUpdate) {
      this.toast.success('Chức năng này đang được phát triển ^^!');
      this.modalRef.close({
        success: true,
        value: body,
      });
    } else {
      this.customerService
        .createUnit(this.organizationId, body, true)
        .subscribe((res) => {
          if (res.status === STATUS.SUCCESS_200) {
            this.toast.success('common.success');
            this.modalRef.close({
              success: true,
              value: res?.body?.data,
            });
          }
        });
    }
  }

  onSearchChangeBuilding(keyword: string): void {
    if (keyword.trim() === '') {
      return;
    }
    this.getBuildings({ keyword });
  }

  getBuildings(options?: any): void {
    let request: {};
    if (options) {
      request = { ...options };
    } else {
      request = { ...this.pagingRequest };
    }
    this.buildingService.simpleSearch(request).subscribe((res) => {
      this.buildings = res?.body?.data as Array<Building>;
    });
  }

  onChangeBuilding(): void {
    const buildingId = this.form.get('buildingId')?.value;
    if (buildingId && this.buildingIdPrevious !== buildingId) {
      this.buildingIdPrevious = buildingId;
      this.form.get('floorId')?.setValue(null);
      this.form.get('unitId')?.setValue(null);
      this.units = [];
      this.getFloors(buildingId);
    }
  }

  getFloors(buildingId: string): void {
    const pagingRequest = {
      ...this.pagingRequest,
      isAvailable: true,
    };
    this.buildingService
      .simpleSearchFloor(buildingId, pagingRequest)
      .subscribe((res) => {
        this.floors = res?.body?.data as Array<Floor>;
      });
  }

  onChangeFloor(): void {
    const floorId = this.form.get('floorId')?.value;
    if (floorId && this.floorIdPrevious !== floorId) {
      this.floorIdPrevious = floorId;
      this.form.get('unitId')?.setValue(null);
      this.getUnits(floorId);
    }
  }

  getUnits(floorId: string): void {
    const pagingRequest = {
      floorId,
      status: LEASING_STATUS.AVAILABLE.value,
      ...this.pagingRequest,
      isAvailable: true,
    };
    this.unitService.searchAutoComplete(pagingRequest).subscribe((res) => {
      this.units = res?.body?.data as Array<Unit>;
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      id: [{ value: this.isUpdate ? this.leasing.id : null, disabled: false }],
      buildingId: [
        {
          value: this.isUpdate ? this.leasing.buildingId : null,
          disabled: false,
        },
        [Validators.required],
      ],
      floorId: [
        { value: this.isUpdate ? this.leasing.floorId : null, disabled: false },
        [Validators.required],
      ],
      unitId: [
        { value: this.isUpdate ? this.leasing.unitId : null, disabled: false },
        [Validators.required],
      ],
      leasingStatus: [
        {
          value: this.isUpdate ? this.leasing.leasingStatus : LEASED,
          disabled: false,
        },
        [Validators.required],
      ],
    });
  }

  private valueChangesForm(): void {
    this.form?.get('buildingId')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.form?.get('floorId')?.setValue(null);
        this.form?.get('unitId')?.setValue(null);
      }
    });
    this.form?.get('floorId')?.valueChanges.subscribe((value) => {
      if (!value) {
        this.form?.get('unitId')?.setValue(null);
      }
    });
  }
}
