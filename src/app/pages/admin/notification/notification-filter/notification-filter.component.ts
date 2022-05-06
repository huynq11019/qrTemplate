import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CUSTOMER } from '@shared/constants/customer.constants';
import { NOTIFICATION_STATUS } from '@shared/constants/notification.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { Building } from '@shared/models/building.model';
import { Customer } from '@shared/models/customer.model';
import { Floor } from '@shared/models/floor.model';
import { User } from '@shared/models/user.model';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-notification-filter',
  templateUrl: './notification-filter.component.html',
  styleUrls: ['./notification-filter.component.scss'],
})
export class NotificationFilterComponent implements OnInit {
  form: FormGroup = new FormGroup({
    buildingIds: new FormControl(null),
    floorIds: new FormControl(null),
    organizationIds: new FormControl(null),
    senderIds: new FormControl(null),
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    status: new FormControl(null),
  });

  buildings: Building[] = [];
  floors: Floor[] = [];
  organizations: Customer[] = [];
  users: User[] = [];

  @Input() buildingIds = null;
  @Input() floorIds = null;
  @Input() organizationIds = null;
  @Input() senderIds = null;
  @Input() startDate = null;
  @Input() endDate = null;
  @Input() status = null;
  @Input() type = null;
  @Input() isLeaderManagement = false;

  statusList = NOTIFICATION_STATUS;
  CUSTOMER = CUSTOMER;

  @ViewChild('startDatePicker') startDatePicker!: NzDatePickerComponent;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  constructor(
    private modalRef: NzModalRef,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    // this.getBuildings();
  }

  ngOnInit(): void {
    this.initForm();
    this.valueChanges();
    this.getCustomersFromBuilding();
  }
  //
  // getBuildings(): void {
  //   this.accountService.getBuildings(true).subscribe((res: { body: { data: Building[]; }; }) => {
  //     this.buildings = res?.body?.data as Array<Building>;
  //   });
  // }

  initForm(): void {
    this.form = this.fb.group({
      buildingIds: [this.buildingIds || null],
      floorIds: [this.floorIds || null],
      organizationIds: [this.organizationIds || null],
      senderIds: [this.senderIds || null],
      startDate: [this.startDate || null],
      endDate: [this.endDate || null],
      status: [this.status || null],
    });
    this.getExitedData();
  }

  getExitedData(): void {
    if (this.form.get('buildingIds')?.value) {
      const buildingId = this.form.get('buildingIds')?.value;
      // this.buildingService
      //   .searchFloorByBuilding(buildingId, {}, true)
      //   .subscribe((response: any) => {
      //     this.floors = response?.body?.data;
      //   });
      // this.customerService
      //   .findCustomers({ ids: buildingId })
      //   .subscribe((res: any) => {
      //     this.organizations = res?.body?.data;
      //   });
    }
  }

  onSearch(): void {
    this.modalRef.close({
      success: true,
      value: this.form.value,
    });
  }

  onReset(): void {
    this.form.reset();
  }

  enterStartDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.startDate?.setValue(
        this.form.controls.startDate?.value
      );
      this.startDatePicker.close();
    } else {
      this.form.controls.startDate?.setValue(CommonUtil.newDate(date));
      this.endDatePicker.close();
    }
  }

  enterEndDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.endDate?.setValue(this.form.controls.endDate?.value);
      this.startDatePicker.close();
    } else {
      this.form.controls.endDate?.setValue(CommonUtil.newDate(date));
      this.endDatePicker.close();
    }
  }

  disabledBeforeStartDate(current: Date): boolean {
    const date = document.getElementById('startDatePicker') as HTMLInputElement;
    return (
      differenceInCalendarDays(
        current,
        moment(date?.value, 'DD/MM/yyyy').toDate()
      ) < 0
    );
  }

  valueChanges(): void {
    this.form?.controls.startDate?.valueChanges.subscribe((startDate) => {
      if (startDate) {
        const endDate = this.form.controls.endDate?.value;
        if (endDate) {
          if (differenceInCalendarDays(startDate, endDate) > 0) {
            this.form.controls.endDate?.setValue(null);
          }
        }
      }
    });
    this.form?.controls.buildingIds?.valueChanges.subscribe((value) => {
      if (value && value.length === 0) {
        if (this.type === CUSTOMER) {
          this.form?.get('floorIds')?.setValue(null);
          this.form?.get('organizationIds')?.setValue(null);
          this.floors = [];
          this.organizations = [];
        }
        if (!this.isLeaderManagement) {
          this.getCustomersFromBuilding({
            pageIndex: PAGINATION.PAGE_DEFAULT,
            pageSize: PAGINATION.SIZE_DEFAULT,
          });
        }
      } else if (value && value.length === 1) {
        if (this.type === CUSTOMER) {
          const buildingId = value[0];
          const request = {
            pageIndex: PAGINATION.PAGE_DEFAULT,
            pageSize: PAGINATION.MAX_SIZE_DEFAULT,
          };
          // this.buildingService
          //   .searchFloorByBuilding(buildingId, request, true)
          //   .subscribe((response: any) => {
          //     this.floors = response?.body?.data;
          //   });
          // this.customerService
          //   .findCustomers({ ids: value })
          //   .subscribe((res: any) => {
          //     this.organizations = res?.body?.data;
          //   });
          this.form?.get('floorIds')?.setValue(null);
          this.form?.get('organizationIds')?.setValue(null);
        }
        if (!this.isLeaderManagement) {
          this.getCustomersFromBuilding({
            buildingIds: value[0],
            pageIndex: PAGINATION.PAGE_DEFAULT,
            pageSize: PAGINATION.SIZE_DEFAULT,
          });
        }
      } else if (value && value.length > 1) {
        if (this.type === CUSTOMER) {
          // this.customerService
          //   .findCustomers({ ids: value })
          //   .subscribe((res: any) => {
          //     this.organizations = res?.body?.data;
          //   });
          this.floors = [];
          this.form?.get('floorIds')?.setValue(null);
          this.form?.get('organizationIds')?.setValue(null);
        }
        if (!this.isLeaderManagement) {
          this.getCustomersFromBuilding({
            buildingIds: value,
            pageIndex: PAGINATION.PAGE_DEFAULT,
            pageSize: PAGINATION.SIZE_DEFAULT,
          });
        }
      }
    });
    this.form?.controls.floorIds?.valueChanges.subscribe((value) => {
      if (this.type === CUSTOMER) {
        if (value) {
          if (value && value.length > 0) {
            // this.customerService
            //   .findFloors({ ids: value })
            //   .subscribe((res: any) => {
            //     this.organizations = res?.body?.data;
            //     this.form?.get('organizationIds')?.setValue(null);
            //   });
          } else {
            const buildingIds = this.form?.controls.buildingIds?.value || [];
            if (buildingIds.length > 0) {
              // this.customerService
              //   .findCustomers({ ids: buildingIds })
              //   .subscribe((res: any) => {
              //     this.organizations = res?.body?.data;
              //     this.form?.get('organizationIds')?.setValue(null);
              //   });
            }
          }
        }
      }
    });
  }

  getCustomersFromBuilding(options?: any): void {
    this.userService.searchUsersAutoComplete(options).subscribe((res) => {
      this.form?.controls.senderIds?.setValue(null);
      this.users = res.body?.data as Array<User>;
    });
  }

  onSearchSender(event: any): void {
    const keyword = event.target.value.trim();
    const buildingIds = this.form?.controls.buildingIds?.value;
    this.getCustomersFromBuilding({
      keyword,
      buildingIds,
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
    });
  }
  public limitText(text: string, limit: number): string {
    return CommonUtil.getLimitLength(text, limit);
  }
}
