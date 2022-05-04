import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BUILDING_VALIDATOR } from '@shared/constants/building.constants';
import { MAX_NUMBER_VALUE } from '@shared/constants/common.constant';
import { STATUS } from '@shared/constants/status.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { Building } from '@shared/models/building.model';
import { Floor } from '@shared/models/floor.model';
import { BuildingService } from '@shared/services/building.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-floor-update',
  templateUrl: './floor-update.component.html',
  styleUrls: ['./floor-update.component.scss'],
})
export class FloorUpdateComponent implements OnInit {
  isUpdate = false;
  floor: Floor = new Floor();
  building: Building = new Building();
  form: FormGroup = new FormGroup({});
  buildingId = '';
  isDelete = false;
  maxFloorNumber = 200;
  maxNumber = MAX_NUMBER_VALUE;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  isUpdating = false;
  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private translate: TranslateService,
    private modalRef: NzModalRef,
    private toast: ToastService,
    private translateService: TranslateService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [
        { value: this.isUpdate ? this.floor?.name : null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      // description: [{value: this.isUpdate ? this.floor?.description : null, disabled: this.isDelete},
      //   [Validators.required, Validators.maxLength(50)]],
      totalArea: [
        {
          value: this.isUpdate ? this.floor?.totalArea : null,
          disabled: false,
        },
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.building?.area || BUILDING_VALIDATOR.area.max),
        ],
      ],
      // availableArea: [{value: this.isUpdate ? this.floor?.availableArea : null, disabled: true},
      //   [Validators.required, Validators.min(1)]],
      floorNumber: [
        {
          value: this.isUpdate ? this.floor?.floorNumber : null,
          disabled: this.isUpdate,
        },
        [
          Validators.required,
          Validators.min(-18),
          Validators.max(
            this.building?.totalFloor || BUILDING_VALIDATOR.area.max
          ),
        ],
      ],
      // code: [{value: this.isUpdate ? this.floor?.code : null, disabled: true},
      //   [Validators.required, Validators.maxLength(100)]],
      status: [1],
      // deleted: [false],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    if (this.form?.value?.totalArea) {
      this.form
        .get('totalArea')
        ?.setValue(Number(this.form.value?.totalArea || 0));
    }
    if (this.form?.value?.floorNumber) {
      this.form
        .get('floorNumber')
        ?.setValue(Number(this.form.value?.floorNumber || 0));
    }
    const floor: Floor = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(floor);
    this.isUpdating = true;
    this.buildingService.createFloor(this.buildingId, body, true).subscribe(
      (res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success('model.floor.success.create');
          this.modalRef.close({
            success: true,
            value: floor,
          });
        }
      },
      (e) => {
        this.isUpdating = false;
      },
      () => {
        this.isUpdating = false;
      }
    );
  }

  onUpdateSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    if (this.form?.value?.totalArea) {
      this.form
        .get('totalArea')
        ?.setValue(Number(this.form.value?.totalArea || 0));
    }
    if (this.form?.value?.floorNumber) {
      this.form
        .get('floorNumber')
        ?.setValue(Number(this.form.value?.floorNumber || 0));
    }
    const floor: Floor = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(floor);
    this.buildingService
      .updateFloor(body, this.buildingId, this.floor.id, true)
      .subscribe((res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success('model.floor.success.update');
          this.modalRef.close({
            success: true,
            value: floor,
          });
        }
      });
  }

  delete(): void {
    /** isArray là true => forEach users get những bản ghi có checked = true */
    const form = CommonUtil.modalConfirm(
      this.translateService,
      'model.floor.deleteFloorTitle',
      'model.floor.deleteFloorContent',
      { name: this.floor.name || '', floorNumber: this.floor.floorNumber || '' }
    );
    const modal = this.modalService.confirm(form);
    modal.afterClose.subscribe((result) => {
      if (result?.success) {
        this.buildingService
          .deleteFloor(this.buildingId, this.floor.id)
          .subscribe((res) => {
            if (res.status === STATUS.SUCCESS_200) {
              this.toast.success('model.floor.success.delete');
              this.modalRef.close({
                success: true,
                value: this.floor,
              });
            }
          });
      }
    });
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  onMaxFloorNumber(event: number): void {
    this.form.get('floorNumber')?.setValue(event);
  }

  onMaxTotalArea(event: number): void {
    this.form.get('totalArea')?.setValue(event);
  }
}
