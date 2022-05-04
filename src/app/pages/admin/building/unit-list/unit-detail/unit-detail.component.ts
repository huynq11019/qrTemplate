import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BUILDING_STATUS,
  BUILDING_VALIDATOR,
  LEASING_STATUS,
  LEASING_STATUS_LIST,
  UNIT_STATUS,
  UNIT_TYPE,
  UNIT_TYPE_LIST,
} from '@shared/constants/building.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS } from '@shared/constants/status.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IBuilding } from '@shared/models/building.model';
import { IFloor } from '@shared/models/floor.model';
import { IBuildingRequest } from '@shared/models/request/building-request.model';
import { IUnit, Unit } from '@shared/models/unit.model';
import { AccountService } from '@shared/services/account.service';
import { BuildingService } from '@shared/services/building.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { UnitService } from '@shared/services/unit.service';
import CommonUtil from '@shared/utils/common-utils';

@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss'],
})
export class UnitDetailComponent implements OnInit {
  pathTranslate = 'model.unit.';
  form: FormGroup = new FormGroup({});
  buildingSelected?: IBuilding;
  floorSelected?: IFloor;
  buildingList: IBuilding[] = [];
  buildingStatus = BUILDING_STATUS;
  floorList: IFloor[] = [];
  unitTypeList = UNIT_TYPE_LIST;
  unitStatusList = LEASING_STATUS_LIST;
  leasingStatus = LEASING_STATUS;
  uStatus = UNIT_STATUS;
  unitId?: string;
  unitDetail: IUnit = new Unit();
  isEdit = false;
  isDetail = window.location.href.includes('detail');
  isUpdate = window.location.href.includes('update');
  maxAreaAvailable = BUILDING_VALIDATOR.area.max;
  maxPrice = BUILDING_VALIDATOR.price.maxValue;
  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private unitService: UnitService,
    private buildingService: BuildingService,
    private toastService: ToastService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUrlParam();
    this.initForm();
    if (!(this.isUpdate || this.isDetail)) {
      this.loadDataBuilding();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      buildingId: [
        {
          value: this.unitDetail?.buildingId || null,
          disabled: this.isDetail || this.isUpdate,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ID_MAX_LENGTH.MAX),
        ],
      ],
      floorId: [
        { value: this.unitDetail?.floorId || null, disabled: true },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ID_MAX_LENGTH.MAX),
        ],
      ],
      price: [
        { value: this.unitDetail?.price || 0, disabled: this.isDetail },
        [Validators.min(0)],
      ],
      area: [
        { value: this.unitDetail?.area || null, disabled: this.isDetail },
        [Validators.required, Validators.min(1)],
      ],
      leasingStatus: [
        {
          value: this.unitDetail?.status || this.leasingStatus.AVAILABLE.value,
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
      note: [
        { value: this.unitDetail?.note || null, disabled: this.isDetail },
        [Validators.maxLength(LENGTH_VALIDATOR.NOTE_MAX_LENGTH.MAX)],
      ],
      type: [
        {
          value: this.unitDetail?.type || UNIT_TYPE.OFFICE.value,
          disabled: this.isDetail,
        },
        [Validators.required],
      ],
    });
  }

  getUrlParam(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params?.unitId) {
        this.unitId = params.unitId;
        this.isEdit = true;
        this.getUnitById(this.unitId || '');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/building/unit']);
  }

  onCreate(): void {
    // format number
    if (!!this.form.get('area')) {
      this.form.get('area')?.setValue(Number(this.form.value?.area || 0));
    }
    if (!!this.form.get('price')) {
      this.form
        .get('price')
        ?.setValue(CommonUtil.formatToNumber(this.form.value.price || 0));
    }

    if (this.form.invalid) {
      this.toastService.error(
        this.translateService.instant('model.unit.error.formInvalid')
      );
      return;
    }
    this.unitService.create(this.form.value, true).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toastService.success(
          this.translateService.instant(this.pathTranslate + 'success.create')
        );
        this.router.navigate(['/building/unit']);
      } else {
        this.toastService.error(
          this.translateService.instant(this.pathTranslate + 'create-fail')
        );
      }
    });
  }

  getTranslate(word: string): string {
    return this.translateService.instant(this.pathTranslate + '' + word);
  }

  loadDataBuilding(keyword?: string, buildingIds?: string[]): void {
    const buildingSearchBuildingRequest: IBuildingRequest = {
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
      buildingIds,
      keyword,
      sortBy: 'code.asc',
    };
    this.buildingService
      .searchBuildingAutoComplete(buildingSearchBuildingRequest)
      .subscribe((data: any) => {
        this.buildingList = data.body.data as Array<IBuilding>;
      });
  }

  getUnitById(id: string): void {
    this.unitService.getById(id).subscribe((res) => {
      this.unitDetail = res.body?.data as IUnit;
      this.form.patchValue({
        buildingId: this.unitDetail.buildingId,
        floorId: this.unitDetail.floorId,
        price: CommonUtil.moneyFormat(this.unitDetail.price + ''),
        area: this.unitDetail.area,
        status: this.unitDetail.status,
        note: this.unitDetail.note,
        type: this.unitDetail.type,
      });
      if (this.unitDetail.isDefault) {
        window.history.back();
      }
      if (
        this.unitDetail.leasingStatus !== this.leasingStatus.AVAILABLE.value &&
        this.isUpdate
      ) {
        window.history.back();
      }
      this.loadDataBuilding('', [this.unitDetail.buildingId || '']);
    });
  }

  searchFloor(keyword?: string): void {
    if (!this.form.get('buildingId')?.value) {
      this.toastService.error(
        this.pathTranslate + 'error.requiredSelectBuilding'
      );
      this.form.get('floorId')?.disable();
      return;
    }
    this.buildingService
      .simpleSearchFloor(this.form.get('buildingId')?.value, {
        keyword,
        minArea: this.isDetail || this.isUpdate ? undefined : 1,
      })
      .subscribe((res) => {
        // show data floor with building
        this.floorList = res.body?.data as Array<IFloor>;
        if (!!this.unitDetail.floorId) {
          this.floorSelected = this.floorList.find(
            (item) => item.id === this.unitDetail.floorId
          );
          if (this.isUpdate) {
            if (this.floorSelected?.availableArea && this.unitDetail?.area) {
              this.maxAreaAvailable = Number(
                (
                  this.floorSelected?.availableArea + +this.unitDetail?.area ||
                  BUILDING_VALIDATOR.area.max
                )?.toFixed(2)
              );
              this.form.controls.area.setValidators([
                Validators.required,
                Validators.max(
                  Number(
                    (
                      this.floorSelected?.availableArea + this.unitDetail?.area
                    )?.toFixed(2)
                  ) || BUILDING_VALIDATOR.area.max
                ),
                Validators.min(1),
              ]);
              this.form.controls.area.updateValueAndValidity();
            }
          } else {
            this.maxAreaAvailable = Number(
              (
                this.floorSelected?.totalArea || BUILDING_VALIDATOR.area.max
              )?.toFixed(2)
            );
            this.form.controls.area.setValidators([
              Validators.required,
              Validators.max(
                Number(this.floorSelected?.totalArea?.toFixed(2)) ||
                  BUILDING_VALIDATOR.area.max
              ),
              Validators.min(1),
            ]);
            this.form.controls.area.updateValueAndValidity();
          }
        }
      });
  }

  selectBuilding(id: string): void {
    this.floorList = [];
    if (!!this.form.get('buildingId')?.value) {
      if (!this.isDetail && !this.isUpdate) {
        this.form.get('floorId')?.enable();
      }
      this.buildingSelected = this.buildingList.find((item) => item.id === id);
      this.form.get('floorId')?.setValue(null);
      this.searchFloor('');
    } else {
      this.form.get('floorId')?.disable();
    }
  }

  public selectFloor(floorId: string): void {
    if (!!this.form.get('floorId')?.value) {
      this.floorSelected = this.floorList.find((item) => item.id === floorId);
      if (
        !!this.floorSelected?.availableArea ||
        this.floorSelected?.availableArea === 0
      ) {
        if (this.floorSelected.availableArea === 0) {
          this.form.get('floorId')?.setValue(null);
        }
        this.form.controls.area.setValidators([
          Validators.required,
          Validators.max(Number(this.floorSelected.availableArea?.toFixed(2))),
          Validators.min(1),
        ]);
        this.form.controls.area.updateValueAndValidity();
        this.maxAreaAvailable =
          Number(this.floorSelected?.availableArea?.toFixed(2)) ||
          BUILDING_VALIDATOR.area.max;
        if (this.form.get('area')?.value > this.floorSelected.availableArea) {
          this.toastService.warning(
            this.translateService.instant(
              this.pathTranslate + 'error.notEnoughArea',
              { areaAvailable: this.floorSelected.availableArea }
            )
          );
          this.form.get('area')?.setValue(this.floorSelected?.availableArea);
        }
      }
    }
  }

  getTranslateKey(word: string): string {
    return this.translateService.instant(this.pathTranslate + word);
  }

  onUpdate(): void {
    // format number
    if (!!this.form.get('area')) {
      this.form.get('area')?.setValue(Number(this.form.value.area || 0));
    }
    if (!!this.form.get('price')) {
      this.form
        .get('price')
        ?.setValue(CommonUtil.formatToNumber(this.form.value.price || 0));
    }

    if (this.form.invalid) {
      this.toastService.error(
        this.translateService.instant('error.formInvalid')
      );
      return;
    }
    if (!this.unitId) {
      return;
    }
    this.unitService
      .update(this.form.value, this.unitId, true)
      .subscribe((res) => {
        if (res.body?.code === STATUS.SUCCESS_200) {
          this.toastService.success(
            this.translateService.instant(this.pathTranslate + 'success.msg')
          );
          window.history.back();
        }
      });
  }

  format(): { text: string; sClass: string } {
    let text = 'model.unit.uStatus.available';
    let sClass = 'badge-warning';
    if (this.unitDetail) {
      const leasing = this.unitStatusList.find(
        (l) => l.value === this.unitDetail.leasingStatus
      );
      text = this.translateService.instant(
        leasing?.label || 'model.unit.uStatus.available'
      );
      sClass = leasing?.class || 'badge-warning';
    }
    return { text, sClass };
  }

  onMaxValueArea(event: any): void {
    this.form.get('area')?.setValue(Number(event));
  }

  onMaxValuePrice(event: { value: number }): void {
    this.form.get('price')?.setValue(CommonUtil.moneyFormat(event.value + ''));
  }
}
