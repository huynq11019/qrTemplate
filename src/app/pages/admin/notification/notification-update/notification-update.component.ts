import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MAX_LENGTH_EDITOR } from '@shared/constants/common.constant';
import { NOTIFICATION_URL } from '@shared/constants/component-url.constant';
import { CUSTOMER, INTERNAL } from '@shared/constants/customer.constants';
import { OWNER_TYPE } from '@shared/constants/file.constant';
import { LOCAL_STORAGE } from '@shared/constants/local-session-cookies.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { STATUS } from '@shared/constants/status.constants';
import { USER_LEVEL_CENTER } from '@shared/constants/user.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { Building, IBuilding } from '@shared/models/building.model';
import { Customer, ICustomer } from '@shared/models/customer.model';
import { Floor, IFloor } from '@shared/models/floor.model';
import { INotification, Notification } from '@shared/models/notification.model';
import { IUser } from '@shared/models/user.model';
import { AccountService } from '@shared/services/account.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { BuildingService } from '@shared/services/building.service';
import { CustomerService } from '@shared/services/customer.service';
import { FileService } from '@shared/services/file.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { NotificationService } from '@shared/services/notification.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-notification-update',
  templateUrl: './notification-update.component.html',
  styleUrls: ['./notification-update.component.scss'],
})
export class NotificationUpdateComponent implements OnInit, AfterViewInit {
  currentUser: IUser = {};
  isUpdate = false;
  isDetail = false;
  notification: Notification = {};
  isInternal = false;
  form: FormGroup = new FormGroup({
    buildingIds: new FormControl(null),
    floorIds: new FormControl(null),
    customerIds: new FormControl(null),
    title: new FormControl(null),
    content: new FormControl(null),
    note: new FormControl(null),
    date: new FormControl(null),
  });

  notificationId: string | null = '';
  content = '';
  isInvalid = false;

  files: [] | any; // event file
  filesUpload = [];
  maxFileUpload = 5;

  buildings: IBuilding[] = [];
  floors: Floor[] = [];
  customers: Customer[] = [];

  buildingsPrevious: string[] = [];
  floorsPrevious: string[] = [];
  customersPrevious: string[] = [];

  USER_LEVEL_CENTER = USER_LEVEL_CENTER;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  navigationExtras: NavigationExtras = {};
  NOTIFICATION_URL = NOTIFICATION_URL;

  @ViewChild('datePicker') datePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private buildingService: BuildingService,
    private fileService: FileService,
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private $localStorage: LocalStorageService,
    private authService: AuthService,
    private toast: ToastService
  ) {
    this.currentUser = this.$localStorage.retrieve(LOCAL_STORAGE.PROFILE);
    this.activatedRoute.data.subscribe((res) => {
      const { isDetail } = res;
      if (isDetail) {
        this.isDetail = isDetail;
      }
    });
    this.activatedRoute.paramMap.subscribe((res) => {
      this.isInternal = res.get('type') === INTERNAL.toLowerCase();
      this.notificationId = res.get('notificationId') || null;
      // if (this.notificationId) {
      //   this.isUpdate = true;
      //   this.getNotificationById(this.notificationId);
      // } else {
      //   this.initForm();
      //   this.getBuildings();
      // }
      const navigationExtras: NavigationExtras = {
        state: {
          tabIndex: this.isInternal ? INTERNAL : CUSTOMER,
        },
      };
      this.navigationExtras = navigationExtras;
    });
  }

  ngOnInit(): void {
    if (this.notificationId) {
      this.isUpdate = true;
      this.getNotificationById(this.notificationId);
    } else {
      this.initFormGroup();
      // this.initForm();
      this.getBuildings();
    }
    this.valueChangesForm();
  }

  valueChangesForm(): void {
    this.form?.controls.buildingIds?.valueChanges.subscribe((value) => {
      if (!this.isInternal) {
        if (value.length === 1) {
          this.getFloorsByBuildings(value[0]);
          this.getCustomersByBuildings(value);
        } else {
          this.form.controls.floorIds?.setValue(null);
          this.form.controls.customerIds?.setValue(null);
          this.floors = [];
          this.customers = [];
        }
      }
    });
    this.form?.controls.floorIds?.valueChanges.subscribe((value) => {
      if (!this.isInternal) {
        if (value && value.length > 0) {
          this.getCustomersByFloors({ ids: value });
        } else {
          const buildingIds = this.form?.controls.buildingIds.value;
          this.getCustomersByBuildings(buildingIds);
        }
        this.form.controls.customerIds?.setValue(null);
        this.customers = [];
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const notification = this.getFormValue();
    const originFiles: any[] = [];

    if (CommonUtil.stripHTML(notification.content).length > MAX_LENGTH_EDITOR) {
      this.toast.warning('error.editorMaxLength', {
        fieldName: this.translate.instant('model.notification.list.content'),
        length: MAX_LENGTH_EDITOR,
      });
      return;
    }

    if (this.filesUpload?.length > 0) {
      this.filesUpload.forEach((file: any) => {
        originFiles.push(file?.originFileObj);
      });

      this.fileService
        .uploadListFile(originFiles, '', OWNER_TYPE.NOTIFICATION)
        .subscribe((res) => {
          const ids = res.body?.data as any;
          notification.fileIds = ids.map((item: { id: string }) => item.id);
          this.save(CommonUtil.trim(notification));
        });
    } else {
      this.save(CommonUtil.trim(notification));
    }
  }

  save(body: object): void {
    this.notificationService.create(body).subscribe((res) => {
      if (res.status) {
        const navigationExtras: NavigationExtras = {
          state: {
            tabIndex: this.isInternal ? INTERNAL : CUSTOMER,
          },
        };
        this.toast.success('model.notification.success.create');
        this.router.navigate([`/notification`], navigationExtras);
      }
    });
  }

  onUpdateSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const notification = this.getFormValue();

    const originFileIds: string[] = [];
    const originFiles: any[] = [];

    if (CommonUtil.stripHTML(notification.content).length > MAX_LENGTH_EDITOR) {
      this.toast.warning('error.editorMaxLength', {
        fieldName: this.translate.instant('model.notification.list.content'),
        length: MAX_LENGTH_EDITOR,
      });
      return;
    }

    if (this.files?.length > 0) {
      this.files?.forEach((file: any) => {
        originFileIds.push(file.fileId);
      });
    }

    if (this.filesUpload?.length > 0) {
      this.filesUpload.forEach((file: any) => {
        originFiles.push(file?.originFileObj);
      });

      this.fileService
        .uploadListFile(originFiles, '', OWNER_TYPE.NOTIFICATION)
        .subscribe((res) => {
          const ids = res.body?.data as any;
          const fileUploadIds = ids.map(
            (item: { id: string }) => item.id
          ) as [];
          const fileOriginIds = [...originFileIds] as [];
          notification.fileIds = [...fileUploadIds, ...fileOriginIds];
          this.update(CommonUtil.trim(notification));
        });
    } else {
      const fileOriginIds = [...originFileIds] as [];
      notification.fileIds = [...fileOriginIds];
      this.update(CommonUtil.trim(notification));
    }
  }

  update(body: object): void {
    if (this.notification?.id) {
      this.notificationService
        .update(body, this.notification?.id)
        .subscribe((res) => {
          if (res.status) {
            const navigationExtras: NavigationExtras = {
              state: {
                tabIndex: this.isInternal ? INTERNAL : CUSTOMER,
              },
            };
            this.toast.success('model.notification.success.update');
            this.router.navigate([`/notification`], navigationExtras);
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate([`/notification`], this.navigationExtras);
  }

  onChangeBuilding(): void {
    const buildingIds = this.form.get('buildingIds')?.value;
    if (buildingIds) {
      const isEqual = CommonUtil.compareArrayIsEqual(
        this.buildingsPrevious,
        buildingIds
      );
      this.buildingsPrevious = buildingIds;
      if (!isEqual && !this.isInternal) {
        if (buildingIds.length === 1) {
          const request = {
            pageIndex: PAGINATION.PAGE_DEFAULT,
            pageSize: PAGINATION.MAX_SIZE_DEFAULT,
          };
          this.buildingService
            .searchFloorByBuilding(buildingIds[0], request)
            .subscribe((res) => {
              this.floors = res.body?.data as Array<Floor>;
            });
        } else {
          this.form.controls.floorIds?.setValue(null);
          this.floors = [];
        }
      }
    }
  }

  getFormValue(): any {
    const data = { ...this.form.value };
    return {
      // buildingIds: this.buildings.length === data?.buildingIds?.length ? [] : data?.buildingIds,
      // floorIds: this.floors.length === data?.floorIds?.length ? [] : data?.floorIds,
      // organizationIds: this.customers.length === data?.customerIds?.length ? [] : data?.customerIds,
      buildingIds: data?.buildingIds,
      floorIds: data?.floorIds,
      organizationIds: data?.customerIds,
      title: data?.title,
      content: data?.content,
      note: data?.note,
      expectedNotificationAt: CommonUtil.getEndOfDay(
        new Date(data?.date).getTime()
      ),
      fileIds: [],
      eventTargetType: this.isInternal ? INTERNAL : CUSTOMER,
      eventType:
        this.currentUser?.userLevel === USER_LEVEL_CENTER && !this.isInternal
          ? 'NOTIFICATION_EMAIL'
          : 'NOTIFICATION',
      eventLevel:
        this.currentUser?.userLevel === USER_LEVEL_CENTER
          ? 'CENTER'
          : 'MANAGER',
    };
  }

  disabledBeforeToday(current: Date): boolean {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  getFiles(filesUpload: any): void {
    this.filesUpload = filesUpload;
  }

  getFilesOrigin(files: any): void {
    this.files = files;
  }

  onChangeData(content: string): void {
    this.form.controls.content?.setValue(content);
  }

  initFormGroup(
    notification?: INotification,
    isUpdate = false,
    isDetail = false
  ): void {
    this.form = this.fb.group({
      buildingIds: [
        {
          value: isUpdate
            ? this.mappingBuildings(notification?.buildings || [])
            : [],
          disabled: isDetail,
        },
        [Validators.required],
      ],
      floorIds: [
        {
          value: isUpdate ? this.mappingFloors(notification?.floors || []) : [],
          disabled: isDetail,
        },
        [
          // Validators.required
        ],
      ],
      customerIds: [
        {
          value: isUpdate
            ? this.mappingOrganizations(notification?.organizations || [])
            : [],
          disabled: isDetail,
        },
        [
          // Validators.required
        ],
      ],
      title: [
        { value: isUpdate ? notification?.title : null, disabled: isDetail },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.TITLE_MAX_LENGTH.MAX),
        ],
      ],
      content: [
        {
          value: isUpdate ? this.notification?.content : null,
          disabled: isDetail,
        },
        [Validators.required],
      ],
      note: [
        { value: isUpdate ? notification?.note : null, disabled: isDetail },
        [Validators.maxLength(LENGTH_VALIDATOR.NOTE_MAX_LENGTH.MAX)],
      ],
      date: [
        {
          value: isUpdate
            ? new Date(this.notification?.expectedNotificationAt)
            : new Date(),
          disabled: isDetail,
        },
        [Validators.required],
      ],
    });
    this.valueChangesForm();
  }

  // initForm(): void {
  //   this.form = this.fb.group({
  //     buildingIds: [
  //       {value: this.isUpdate ? this.mappingBuildings(this.notification?.buildings || []) : [], disabled: false},
  //       [
  //         Validators.required
  //       ]
  //     ],
  //     floorIds: [
  //       {value: this.isUpdate ? this.mappingFloors(this.notification?.floors || []) : [], disabled: false},
  //       [
  //         // Validators.required
  //       ]
  //     ],
  //     customerIds: [
  //       {value: this.isUpdate ? this.mappingOrganizations(this.notification?.organizations || []) : [], disabled: false},
  //       [
  //         // Validators.required
  //       ]
  //     ],
  //     title: [
  //       {value: this.isUpdate ? this.notification?.title : null, disabled: this.isDetail},
  //       [
  //         Validators.required,
  //         Validators.maxLength(LENGTH_VALIDATOR.TITLE_MAX_LENGTH.MAX)
  //       ]
  //     ],
  //     content: [
  //       {value:  this.isUpdate ? this.notification?.content : null, disabled: this.isDetail},
  //       [
  //         Validators.required
  //       ]
  //     ],
  //     note: [
  //       {value: this.isUpdate ? this.notification?.note : null, disabled: this.isDetail},
  //       [
  //         Validators.maxLength(LENGTH_VALIDATOR.NOTE_MAX_LENGTH.MAX)
  //       ]
  //     ],
  //     date: [
  //       {value: this.isUpdate ? this.notification?.expectedNotificationAt : moment(new Date()).format('yyyy-MM-DD'),
  //         disabled: this.isDetail},
  //       [
  //         Validators.required
  //       ]
  //     ],
  //   });
  //   this.valueChangesForm();
  // }

  mappingBuildings(buildings: IBuilding[]): (string | undefined)[] {
    return buildings.map((building: IBuilding) => building.id);
  }

  mappingFloors(floors: IFloor[]): (string | undefined)[] {
    return floors.map((floor: IFloor) => floor.id);
  }

  mappingOrganizations(customers: ICustomer[]): (string | undefined)[] {
    return customers.map((customer: ICustomer) => customer.id);
  }

  getBuildings(): void {
    this.accountService.getBuildings(true).subscribe((res) => {
      this.buildings = res?.body?.data as Array<Building>;
    });
  }

  getCustomersByFloors(ids: any): void {
    this.customerService.findFloors(ids, true).subscribe((res: any) => {
      this.customers = res.body?.data;
    });
  }

  getCustomersByBuildings(ids: any): void {
    const request = {
      ids,
    };
    this.customerService.findCustomers(request, true).subscribe((res: any) => {
      this.customers = res.body?.data;
    });
  }

  getFloorsByBuildings(buildingId: string): void {
    const request = {
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.MAX_SIZE_DEFAULT,
    };
    this.buildingService
      .searchFloorByBuilding(buildingId, request, true)
      .subscribe((res) => {
        this.floors = res.body?.data as Array<Floor>;
      });
  }

  getNotificationById(notificationId: string): void {
    this.notificationService.find(notificationId, true).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.notification = res?.body?.data as Notification;
        this.files = this.notification?.eventFiles || [];
        this.initFormGroup(
          res?.body?.data as Notification,
          this.isUpdate,
          this.isDetail
        );
        if (this.isInternal) {
          if (
            this.notification?.buildings &&
            this.notification?.buildings?.length > 0
          ) {
            this.getBuildings();
            const buildingIds = this.mappingBuildings(
              this.notification?.buildings || []
            );
            this.form.controls.buildingIds?.setValue(buildingIds);
          } else {
            this.accountService.getBuildings(true).subscribe((reS) => {
              this.buildings = reS?.body?.data || [];
              const buildingIds = this.mappingBuildings(this.buildings);
              this.form.controls.buildingIds?.setValue(buildingIds);
            });
          }
        } else {
          if (
            this.notification?.buildings &&
            this.notification?.buildings?.length === 1
          ) {
            this.getBuildings();
            const buildingIds = this.mappingBuildings(
              this.notification?.buildings
            );
            this.getFloorsByBuildings(buildingIds[0] || '');
            if (
              !this.notification?.floors &&
              !this.notification?.organizations
            ) {
              this.getCustomersByBuildings(buildingIds);
            } else if (
              this.notification?.floors &&
              this.notification?.floors.length > 0
            ) {
              const floorIds = this.mappingFloors(this.notification?.floors);
              this.getCustomersByFloors({ ids: floorIds });
            }
          } else if (
            this.notification?.buildings &&
            this.notification?.buildings?.length > 1
          ) {
            this.getBuildings();
            this.floors = [];
            const buildingIds = this.mappingBuildings(
              this.notification?.buildings
            );
            this.getCustomersByBuildings(buildingIds);
          } else {
            this.accountService.getBuildings(true).subscribe((response) => {
              this.buildings = response?.body?.data as Array<Building>;
              const buildingIds = this.mappingBuildings(this.buildings);
              this.form.controls.buildingIds?.setValue(buildingIds);
            });
          }
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isInternal) {
      this.form.controls.floorIds?.clearValidators();
      this.form.controls.customerIds?.clearValidators();
      this.form.controls.floorIds?.updateValueAndValidity();
      this.form.controls.customerIds?.updateValueAndValidity();
    }
    if (this.notification) {
      this.form.controls.content?.setValue(this.notification.content);
    }
  }

  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    } else {
      if (controls === 'buildingIds') {
        formControl.setValue(this.mappingBuildings(value));
      } else if (controls === 'floorIds') {
        formControl.setValue(this.mappingFloors(value));
      } else if (controls === 'customerIds') {
        formControl.setValue(this.mappingOrganizations(value));
      }
    }
  }

  enterDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.date?.setValue(this.form.controls.date?.value);
      this.datePicker.close();
    } else if (!this.disabledBeforeToday(CommonUtil.newDate(date))) {
      this.form.controls.date?.setValue(CommonUtil.newDate(date));
      this.datePicker.close();
    } else {
      this.form.controls.date?.setValue(this.form.controls.date?.value);
      this.datePicker.close();
    }
  }

  onHandleEditorInvalid(isInvalid: any): void {
    this.isInvalid = isInvalid;
  }

  getLimitLength(str: string, length?: number): string {
    return CommonUtil.getLimitLength(str, length);
  }
}
