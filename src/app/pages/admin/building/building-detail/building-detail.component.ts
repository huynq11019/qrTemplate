import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ACTION_TYPE,
  BUILDING_STATUS,
  BUILDING_VALIDATOR,
} from '@shared/constants/building.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS } from '@shared/constants/status.constants';
import {
  USER_CUSTOMER,
  USER_EMPLOYEE,
  USER_LEVEL_CENTER,
  USER_PROFILE_INTERNAL,
  USER_PROFILE_LDAP,
} from '@shared/constants/user.constant';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import { IValidateMessage } from '@shared/interface/validate-message';
import { Building, IBuilding } from '@shared/models/building.model';
import { Floor, IFloor } from '@shared/models/floor.model';
import { Pageable } from '@shared/models/pageable.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { BuildingService } from '@shared/services/building.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FloorUpdateComponent } from '../floor-update/floor-update.component';

@Component({
  selector: 'app-building-detail',
  templateUrl: './building-detail.component.html',
  styleUrls: ['./building-detail.component.scss'],
})
export class BuildingDetailComponent implements OnInit {
  floors: Floor[] = [];
  buildingManagers: User[] = []; // manager of building
  detailTab = {
    building: 0,
    manager: 1,
    floor: 2,
  };

  isCallFirstRequest = true;
  totalManager = 0;
  totalFloor = 0;
  loading = false;
  buildingStatus = BUILDING_STATUS;
  ACTION_TYPE = ACTION_TYPE;
  pageSizeOptions = PAGINATION.OPTIONS;
  floorQuery = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
    keyword: '',
  };
  managerQuery = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
    keyword: '',
  };
  groupConfirmBuilding = {
    title: 'model.building.managerBuilding.message.create',
    content: 'common.confirmSave',
    okText: 'action.save',
    callBack: () => {},
  };
  groupConfirmFloor = {
    title: 'model.floor.confirmDeleteFloor',
    content: 'action.confirmDelete',
    okText: 'action.delete',
    callBack: () => {},
  };
  isVisible = false;
  buildingId = ''; // buildingId
  isUpdate = window.location.href.includes('detail');
  isCreate = window.location.href.includes('create');
  building: Building = new Building();
  form: FormGroup = new FormGroup({});
  public selectedIndex = 0;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  maxArea = BUILDING_VALIDATOR.area.max;

  public validateMessages: IValidateMessage[] = [
    {
      field: 'code',
      fieldName: 'model.building.code',
      valid: [
        {
          type: 'required',
        },
        { type: 'pattern' },
      ],
    },
    {
      field: 'name',
      fieldName: 'model.building.name',
      valid: [
        {
          type: 'required',
        },
        {
          type: 'maxLength',
          param: LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX,
        },
      ],
    },
    {
      field: 'totalFloor',
      fieldName: 'model.building.totalFloor',
      valid: [
        { type: 'required' },
        {
          type: 'min',
          param: 1,
        },
        {
          type: 'max',
          param: 200,
        },
      ],
    },
    {
      field: 'area',
      fieldName: 'model.building.area',
      valid: [
        { type: 'required' },
        {
          type: 'min',
          param: 1,
        },
        {
          type: 'max',
          param: BUILDING_VALIDATOR.area.max,
        },
      ],
    },
    {
      field: 'address',
      fieldName: 'model.building.address',
      valid: [
        {
          type: 'maxLength',
          param: LENGTH_VALIDATOR.ADDRESS_MAX_LENGTH.MAX,
        },
        {
          type: 'required',
        },
      ],
    },
    {
      field: 'status',
      fieldName: 'model.building.status',
      valid: [
        {
          type: 'required',
        },
      ],
    },
    {
      field: 'note',
      fieldName: 'model.building.note',
      valid: [
        {
          type: 'maxLength',
          param: LENGTH_VALIDATOR.NOTE_MAX_LENGTH.MAX,
        },
      ],
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private route: Router,
    private translateService: TranslateService,
    private buildingService: BuildingService,
    private toast: ToastService,
    private modalService: NzModalService,
    private authService: AuthService
  ) {
    this.router.paramMap.subscribe((res) => {
      this.buildingId = res.get('id') || '';
      if (this.buildingId) {
        this.findBuildingId(this.buildingId);
        this.loadManager();
      }
    });
    this.router.queryParams.subscribe((res) => {
      if (!!res?.tab && res.tab === 'floor') {
        this.selectedIndex = 2;
      }
    });
  }

  ngOnInit(): void {
    if (this.isCreate) {
      this.authService.hasPermissionAccess(
        ['building:create'],
        [USER_LEVEL_CENTER]
      );
    }
    this.initForm();
    // this.loadDataFloor();
  }

  /*Form tap thong tin chung toa nha*/
  initForm(): void {
    this.form = this.fb.group({
      code: [
        { value: this.building?.code || '', disabled: this.isUpdate },
        [
          Validators.required,
          Validators.pattern(VALIDATORS.CODE),
          Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
        ],
      ],
      name: [
        this.building?.name || '',
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      totalFloor: [
        { value: this.building?.totalFloor || '', disabled: false },
        [Validators.required, Validators.min(1), Validators.max(200)],
      ],
      address: [
        this.building?.address || '',
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ADDRESS_MAX_LENGTH.MAX),
        ],
      ],
      note: [
        { value: this.building?.note || null, disabled: false },
        [Validators.maxLength(LENGTH_VALIDATOR.NOTE_MAX_LENGTH.MAX)],
      ],
      status: [
        this.building?.status || this.buildingStatus.ACTIVE.value,
        [Validators.required],
      ],
      deleted: [false],
      area: [
        this.building?.area || null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(BUILDING_VALIDATOR.area.max),
        ],
      ],
    });

    this.form.setValidators(this.isUpdate ? [Validators.required] : []);
  }

  /*Tim thông tin cua toa nha do va mat bang cua toa nha*/
  findBuildingId(id: string): void {
    if (!!id) {
      this.buildingService.getById(id).subscribe((response) => {
        const building = response.body?.data as Building;
        const floors = building.floors as Array<Floor>;
        this.building = building || {};
        this.floors = floors as Floor[];
        this.buildingId = id;
        this.isUpdate = !!(
          this.buildingId && window.location.href.includes('detail')
        );
        this.form.patchValue({
          code: this.building.code,
          name: this.building.name,
          totalFloor: this.building.totalFloor,
          address: this.building.address,
          note: this.building.note,
          status: this.building.status,
          deleted: this.building.deleted,
          area: this.building.area,
        });
      });
    }
  }

  /* Tim kiem mat tầng cua toa nha*/
  searchFloor(event: any): void {
    this.floorQuery.keyword = event.target.value;
    this.loadDataFloor();
  }

  /* Tim kiem quản lý cua toa nha*/
  searchManager(event: any): void {
    this.managerQuery.keyword = event.target.value;
    this.loadManager();
  }

  /* Danh sach mat bang cua toa nha do tim theo Id*/
  loadDataFloor(isLoading = true): void {
    if (!this.buildingId) {
      return;
    }
    const id = this.buildingId;
    this.buildingService
      .searchFloorByBuilding(id, this.floorQuery, isLoading)
      .subscribe((response) => {
        const data = response?.body?.data as Array<Floor>;
        const page = response?.body?.page as Pageable;
        if (data?.length > 0) {
          data.map((floor: Floor): any => (floor.checked = false));
        }
        this.floors = data;
        this.totalFloor = page?.total || 0;
      });
  }

  /* load danh sách ban quản lý toàn nhà */
  loadManager(keyword?: string, isLoading = true): void {
    if (!this.buildingId) {
      return;
    }
    this.buildingService
      .searchManagerByBuilding(this.buildingId, this.managerQuery, isLoading)
      .subscribe((response) => {
        this.buildingManagers = response?.body?.data as Array<User>;
        const page = response?.body?.page as Pageable;
        this.totalManager = page?.total || 0;
        this.loading = false;
      });
  }

  /* Phan trang ban quan lý toàn nhà sort */
  onQueryParamsChange(params: NzTableQueryParams, type: number): void {
    if (this.isCallFirstRequest) {
      this.isCallFirstRequest = false;
      return;
    }
    const { sortBy } = CommonUtil.onQueryParam(params);
    if (type === this.detailTab.manager) {
      this.managerQuery.sortBy = sortBy;
      this.loadManager();
    } else if (type === this.detailTab.floor) {
      this.floorQuery.sortBy = !!sortBy ? sortBy : 'floorNumber.asc';
      this.loadDataFloor();
    }
  }

  /* query phân trang manager building*/
  onQuerySearch(params: any, type: number): void {
    const { pageIndex, pageSize } = params;
    if (type === this.detailTab.manager) {
      this.managerQuery.pageIndex = pageIndex;
      this.managerQuery.pageSize = pageSize;
      this.loadManager();
    } else if (type === this.detailTab.floor) {
      this.floorQuery.pageIndex = pageIndex;
      this.floorQuery.pageSize = pageSize;
      this.loadDataFloor();
    }
  }

  /* Tạo moi thông tin tòa nhà */
  onCreateBuilding(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    if (!!this.form.get('area')) {
      this.form.get('area')?.setValue(Number(this.form.value.area || 0));
    }
    if (!!this.form.get('totalFloor')) {
      this.form
        .get('totalFloor')
        ?.setValue(Number(this.form.value.totalFloor || 0));
    }
    const building: Building = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(building);
    this.buildingService.create(body, true).subscribe((res: any) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.building.success.create');
        this.selectedIndex = 2;
        this.isUpdate = true;
        this.building = res.body?.data as IBuilding;
        this.buildingId = this.building.id || '';
        this.redirectToUpdateBuilding(this.buildingId);
      }
    });
  }

  /* Cap nhat thong tin chung cua toa nha */
  onUpdateSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    if (!!this.form.get('area')) {
      this.form.get('area')?.setValue(Number(this.form.value.area || 0));
    }
    if (!!this.form.get('totalFloor')) {
      this.form
        .get('totalFloor')
        ?.setValue(Number(this.form.value.totalFloor || 0));
    }
    const building: Building = {
      ...this.form.value,
    };
    console.log(building);
    const body = CommonUtil.trim(building);
    if (!this.building?.id) {
      this.toast.error(
        this.translateService.instant('model.building.error.buildingId')
      );
      return;
    }
    this.buildingService
      .update(body, this.building.id, true)
      .subscribe((res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success('model.building.success.update');
          this.findBuildingId(this.buildingId);
        }
      });
  }

  /* them moi tang cua toa nha */
  createFloor(): void {
    const base = CommonUtil.modalBase(
      FloorUpdateComponent,
      {
        isUpdate: false,
        buildingId: this.buildingId,
        building: this.building,
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.floorQuery.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.loadDataFloor();
      }
    });
  }

  /* opent confirm */
  openConfirm(actionType: string): void {
    if (actionType === ACTION_TYPE.CREATE_BUILDING) {
      this.groupConfirmBuilding.callBack = this.onCreateBuilding.bind(this);
    } else if (actionType === ACTION_TYPE.UPDATE_BUILDING) {
      this.groupConfirmBuilding.callBack = this.onUpdateSubmit.bind(this);
      this.groupConfirmBuilding.title =
        'model.building.managerBuilding.message.create';
      this.groupConfirmBuilding.content = 'common.confirmSave';
      this.groupConfirmBuilding.okText = 'action.save';
    }
    this.isVisible = true;
  }

  /*handle confirm*/
  handleConfirm(result: { success: boolean }): void {
    if (!!result && result.success) {
    }
    this.groupConfirmBuilding.callBack = () => {};
    this.isVisible = false;
  }

  // update floor in building
  updateFloor(floor: IFloor): void {
    const base = CommonUtil.modalBase(
      FloorUpdateComponent,
      {
        isUpdate: true,
        building: this.building,
        buildingId: this.buildingId,
        floor,
      },
      '30%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.loadDataFloor();
      }
    });
  }

  /* Nut huy, quay lai man hinh danh sach toa nha*/
  onCancel(): void {
    this.route.navigate(['/building/list']);
  }

  public getTranslateManager(key: string): string {
    return this.translateService.instant(
      `model.building.managerBuilding.${key}`
    );
  }

  redirectToUpdateAccount(userid?: string, accountType?: string): void {
    if (userid && accountType) {
      let type = '';
      if (accountType === USER_EMPLOYEE) {
        type = USER_PROFILE_INTERNAL;
      } else if (accountType === USER_CUSTOMER) {
        type = USER_PROFILE_LDAP;
      }
      this.route.navigate([`setting/user/${userid}/update`], {
        queryParams: { typeUser: type },
      });
    }
  }

  confirmDeleteFloor(floor: IFloor): void {
    this.groupConfirmBuilding = this.groupConfirmFloor;
    this.groupConfirmBuilding.callBack = this.deleteFloor.bind(this, floor);
    this.isVisible = true;
  }

  deleteFloor(floor: IFloor): void {
    this.buildingService
      .deleteFloor(this.buildingId, floor.id)
      .subscribe((res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success(
            this.translateService.instant('model.floor.success.delete')
          );
          this.loadDataFloor();
        }
      });
    this.isVisible = true;
  }

  getIndex(index: number, pageIndex: number, pageSize: number): number {
    return CommonUtil.getIndex(index, pageIndex, pageSize);
  }

  hasUserLevel(): boolean {
    const myProfile: User = this.authService.getCurrentUser() || {};
    if (
      USER_LEVEL_CENTER.includes(myProfile?.userLevel || '') ||
      !!myProfile.userPrimary?.isRoot
    ) {
      return true;
    }
    return false;
  }

  onMaxValue(event: any): void {
    this.form.get('totalFloor')?.setValue(event?.value);
  }

  redirectToUpdateBuilding(buildingId: string): void {
    this.route.navigate([`building/${buildingId}/detail`], {
      queryParams: { tab: 'floor' },
    });
  }

  onMaxAreaBuilding(event: any): void {
    this.form.get('area')?.setValue(BUILDING_VALIDATOR.area.max);
    console.log('onMaxAreaBuilding', event);
  }
}
