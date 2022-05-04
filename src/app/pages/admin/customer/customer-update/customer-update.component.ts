import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CUSTOMER_TYPE,
  LEASED,
  LEASING_STATUS,
  RETURNED,
} from '@shared/constants/customer.constants';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  COMMON_STATUS,
  STATUS,
  STATUS_ACTIVE,
} from '@shared/constants/status.constants';
import { USER_PROFILE_LDAP } from '@shared/constants/user.constant';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import {
  CustomerContact,
  ICustomerContact,
} from '@shared/models/customer-contact.model';
import { ICustomerRent } from '@shared/models/customer-rent.model';
import { ICustomer } from '@shared/models/customer.model';
import { CustomerService } from '@shared/services/customer.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CustomerContactComponent } from '../customer-contact/customer-contact.component';
import { CustomerLeasingComponent } from '../customer-leasing/customer-leasing.component';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss'],
})
export class CustomerUpdateComponent implements OnInit {
  // @Input
  isUpdate = false;
  customerId = '';

  isVisibleContact = false;
  isVisibleLeasing = false;
  modalSearch = {
    isShowBusinessCodeUse: false,
    isShowBusinessCodeNotUse: false,
    show: false,
    customerId: '',
  };

  groupLeasingPopup = {
    title: '',
    content: '',
    type: '',
  };

  itemDelete: any;

  contactRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    total: 0,
  };

  leasingRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    total: 0,
  };

  // Tab
  tabIndex = 0;
  THONG_TIN = {
    KHACH_HANG: 0,
    THUE: 1,
    LIEN_HE: 2,
  };

  // Init form
  form: FormGroup = new FormGroup({
    type: new FormControl(null),
    code: new FormControl(null),
    name: new FormControl(null),
    legalRepresentative: new FormControl(null),
    email: new FormControl(null),
    businessCode: new FormControl(null),
    phoneNumber: new FormControl(null),
    taxNumber: new FormControl(null),
    invoiceIssuingAddress: new FormControl(null),
    status: new FormControl(null),
    incorporationDate: new FormControl(null),
  });
  // formContact: FormGroup = new FormGroup({});
  // formRent: FormGroup = new FormGroup({
  //   unitId: new FormControl(null),
  //   leasingStatus: new FormControl(null),
  // });

  // Data
  customer: ICustomer = {};
  contactList: ICustomerContact[] = [];
  leasingList: ICustomerRent[] = [];

  // Constant
  customerType = CUSTOMER_TYPE;
  status = COMMON_STATUS;
  leasingStatus = LEASING_STATUS;
  LEASED = LEASED;
  RETURNED = RETURNED;
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  STATUS_ACTIVE = STATUS_ACTIVE;

  @ViewChild('datePicker') datePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private translateService: TranslateService,
    private modalService: NzModalService,
    private toast: ToastService,
    private router: Router
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      const customerId = params.get('customerId');
      this.isUpdate = !!customerId;
      this.customerId = customerId ? customerId : '';
      if (this.isUpdate) {
        const state = this.router.getCurrentNavigation()?.extras?.state as any;
        if (state?.tabIndex) {
          this.tabIndex = state?.tabIndex;
        }
        this.findCustomer(this.customerId);
      } else {
        this.initForm();
      }
    });
  }

  ngOnInit(): void {}

  initForm(): void {
    this.form = this.fb.group({
      type: [
        {
          value: this.isUpdate ? this.customer?.type : CUSTOMER_TYPE[0].value,
          disabled: false,
        },
        [Validators.required],
      ],
      code: [
        {
          value: this.isUpdate ? this.customer?.code : null,
          disabled: this.isUpdate,
        },
        // [
        //   Validators.required,
        //   Validators.maxLength(255)
        // ]
      ],
      name: [
        { value: this.isUpdate ? this.customer?.name : null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      legalRepresentative: [
        {
          value: this.isUpdate ? this.customer?.legalRepresentative : null,
          disabled: false,
        },
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
        ],
      ],
      email: [
        this.isUpdate ? this.customer?.email : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.EMAIL_MAX_LENGTH.MAX),
          Validators.pattern(VALIDATORS.EMAIL),
        ],
      ],
      businessCode: [
        this.isUpdate ? this.customer?.businessCode : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
        ],
      ],
      phoneNumber: [
        this.isUpdate ? this.customer?.phoneNumber : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.PHONE_MAX_LENGTH.MAX),
          Validators.pattern(VALIDATORS.PHONE),
        ],
      ],
      taxNumber: [this.isUpdate ? this.customer?.phoneNumber : null],
      invoiceIssuingAddress: [
        this.isUpdate ? this.customer?.invoiceIssuingAddress : null,
        [
          // Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.ADDRESS_MAX_LENGTH.MAX),
        ],
      ],
      status: [
        {
          value: this.isUpdate ? this.customer?.status : COMMON_STATUS[0].value,
          disabled: false,
        },
        [Validators.required],
      ],
      incorporationDate: [
        this.isUpdate
          ? this.customer?.incorporationDate
            ? new Date(this.customer?.incorporationDate)
            : null
          : null,
        [
          // Validators.required
        ],
      ],
    });
  }

  initFormContact(): void {
    // this.formContact = this.fb.group({
    //   contacts: this.fb.array([]),
    // });
  }

  createInformationCustomer(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const body = { ...this.form.value };
    body.taxNumber = body.phoneNumber;
    if (body?.incorporationDate) {
      body.incorporationDate = moment(body?.incorporationDate).format(
        'yyyy-MM-DD'
      );
    }
    this.customerService
      .findByBusinessCode(body.businessCode.trim(), true)
      .subscribe((res) => {
        if (res?.body?.code === STATUS.ERROR_404 || !res?.body?.success) {
          this.customerService
            .create(CommonUtil.trim(body), true)
            .subscribe((response: any) => {
              if (response.status === STATUS.SUCCESS_200) {
                this.toast.success('common.success');
                const data = response?.body?.data;

                const navigationExtras: NavigationExtras = {
                  state: {
                    tabIndex: this.THONG_TIN.THUE,
                  },
                };
                this.router.navigate(
                  [`/customer/${data.id}/update`],
                  navigationExtras
                );
              }
            });
        } else {
          this.modalSearch.isShowBusinessCodeUse = true;
        }
      });
  }

  updateInformationCustomer(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const body = { ...this.form.value };
    body.code = this.customer.code;
    body.taxNumber = body.phoneNumber;
    if (body?.incorporationDate) {
      body.incorporationDate = moment(body?.incorporationDate).format(
        'yyyy-MM-DD'
      );
    }
    this.customerService
      .update(CommonUtil.trim(body), this.customerId, true)
      .subscribe((res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success('common.success');
          this.findCustomer(this.customerId);
        }
      });
  }

  createOrUpdateInformationContact(): void {
    // const contacts = this.formContact.value.contacts as Array<CustomerContact>;
    // contacts.forEach(contact => {
    //   if (this.contactValid(contact)) {
    //     contact.dayOfBirth = moment(new Date()).format('yyyy-MM-DD');
    //     contact.gender = GENDER.OTHER;
    //     if (contact?.id) {
    //       this.customerService.updateContacts(this.customerId, contact.id, contact, true).subscribe(res => {
    //       });
    //     } else {
    //       this.customerService.createContacts(this.customerId, contact, true).subscribe(res => {
    //       });
    //     }
    //   }
    // });
  }

  contactValid(contact: CustomerContact): boolean {
    const temp = CommonUtil.formatParams({ ...contact });
    return Object.keys(temp).length > 0;
  }

  onCreateContact(): void {
    const base = CommonUtil.modalBase(
      CustomerContactComponent,
      {
        isUpdate: false,
        organizationId: this.customerId,
      },
      '25%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.contactRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.searchContacts(this.customerId, {
          pageIndex: this.contactRequest.pageIndex,
          pageSize: this.contactRequest.pageSize,
        });
      }
    });
  }

  onUpdateContact(item: ICustomerContact): void {
    const base = CommonUtil.modalBase(
      CustomerContactComponent,
      {
        isUpdate: true,
        organizationId: this.customerId,
        customerContact: item,
      },
      '25%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.contactRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.searchContacts(this.customerId, {
          pageIndex: this.contactRequest.pageIndex,
          pageSize: this.contactRequest.pageSize,
        });
      }
    });
  }

  onCreateLeasing(): void {
    const base = CommonUtil.modalBase(
      CustomerLeasingComponent,
      {
        isUpdate: false,
        organizationId: this.customerId,
      },
      '45%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.leasingRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.searchLeasing(this.customerId, {
          pageIndex: this.leasingRequest.pageIndex,
          pageSize: this.leasingRequest.pageSize,
        });
      }
    });
  }

  onUpdateLeasing(item: ICustomerRent): void {
    const base = CommonUtil.modalBase(
      CustomerLeasingComponent,
      {
        isUpdate: true,
        organizationId: this.customerId,
        leasing: item,
      },
      '35%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.leasingRequest.pageIndex = PAGINATION.PAGE_DEFAULT;
        this.searchLeasing(this.customerId, {
          pageIndex: this.leasingRequest.pageIndex,
          pageSize: this.leasingRequest.pageSize,
        });
      }
    });
  }

  updateInformationRent(): void {}

  findCustomer(customerId: string): void {
    this.customerService.find(customerId, true).subscribe((res: any) => {
      this.customer = res?.body?.data;

      this.initForm();
      this.searchContacts(this.customerId, this.contactRequest, true);
      this.searchLeasing(this.customerId, this.leasingRequest, true);
      // this.initFormContact();
    });
  }

  searchContacts(customerId: any, request: object, isLoading = false): void {
    this.customerService
      .searchContacts(customerId, request, isLoading)
      .subscribe((response: any) => {
        this.contactList = response?.body?.data;
        const pageResponse = response?.body?.page;
        this.contactRequest.total = pageResponse?.total || 0;
        // contacts.forEach(contact => {
        //   this.contacts.push(this.createContact(contact));
        // })
      });
  }

  searchLeasing(customerId: any, request: object, isLoading = false): void {
    this.customerService
      .searchLeasing(customerId, request, isLoading)
      .subscribe((response: any) => {
        this.leasingList = response?.body?.data;
        const pageResponse = response?.body?.page;
        this.leasingRequest.total = pageResponse?.total || 0;
      });
  }

  onChangeTab(tabIndex: number): any {
    this.tabIndex = tabIndex;
    // const self = this;
    // switch (this.tabIndex) {
    //   case self.THONG_TIN.LIEN_HE: {
    //     this.searchContacts(this.customerId, this.contactRequest);
    //     break;
    //   }
    //   case self.THONG_TIN.THUE: {
    //     this.searchLeasing(this.customerId, this.leasingRequest);
    //     break;
    //   }
    //   default:
    //     break;
    // }
  }

  getIndex(index: number): number {
    const self = this;
    const request = {
      pageIndex: 0,
      pageSize: 0,
    };
    switch (this.tabIndex) {
      case self.THONG_TIN.LIEN_HE: {
        request.pageIndex = this.contactRequest.pageIndex;
        request.pageSize = this.contactRequest.pageSize;
        break;
      }
      case self.THONG_TIN.THUE: {
        request.pageIndex = this.leasingRequest.pageIndex;
        request.pageSize = this.leasingRequest.pageSize;
        break;
      }
      default:
        break;
    }
    return CommonUtil.getIndex(index, request.pageIndex, request.pageSize);
  }

  onSubmit(): void {
    const self = this;
    switch (this.tabIndex) {
      case self.THONG_TIN.KHACH_HANG: {
        if (this.isUpdate) {
          this.updateInformationCustomer();
        } else {
          this.createInformationCustomer();
        }
        break;
      }
      case self.THONG_TIN.LIEN_HE: {
        this.createOrUpdateInformationContact();
        break;
      }
      case self.THONG_TIN.THUE: {
        this.updateInformationRent();
        break;
      }
      default: {
        self.toast.error('error.msg');
        break;
      }
    }
  }

  onCancel(): void {
    this.router.navigate([`/customer`]);
  }

  onQuerySearchContact(params: any): void {
    const { pageIndex, pageSize } = params;
    this.contactRequest.pageIndex = pageIndex;
    this.contactRequest.pageSize = pageSize;
    this.searchContacts(this.customerId, this.contactRequest, true);
  }

  onQuerySearchLeasing(params: any): void {
    const { pageIndex, pageSize } = params;
    this.leasingRequest.pageIndex = pageIndex;
    this.leasingRequest.pageSize = pageSize;
    this.searchLeasing(this.customerId, this.leasingRequest, true);
  }

  format(value: any, type: string): any {
    if (type === 'leasing') {
      const leasingStatus = this.leasingStatus.filter(
        (item: { label: string; value: string }) => item.value === value
      );
      if (leasingStatus.length > 0) {
        const translate = leasingStatus[0].label;
        return this.translateService.instant(translate);
      }
    } else if (type === 'customer') {
      const translate = this.customerType.filter(
        (item: any) => item.value === value
      );
      if (translate.length > 0) {
        return this.translateService.instant(translate[0]?.label);
      }
    }
  }

  //  get contacts(): FormArray {
  //   return this.formContact?.get('contacts') as FormArray;
  // }

  //  createContact(contact?: CustomerContact | null) {
  //   if (contact) {
  //     return this.fb.group({
  //       id: [contact?.id],
  //       fullName: [contact?.fullName || null,
  //         [Validators.required, Validators.maxLength(256)]
  //       ],
  //       phoneNumber: [contact?.phoneNumber || null,
  //         [Validators.required, Validators.pattern(VALIDATORS.PHONE), Validators.maxLength(256)]
  //       ],
  //       email: [contact?.email || null,
  //         [Validators.required, Validators.pattern(VALIDATORS.EMAIL), Validators.maxLength(256)]
  //       ],
  //     });
  //   } else {
  //     return this.fb.group({
  //       fullName: [null,
  //         [Validators.required, Validators.maxLength(256)]
  //       ],
  //       phoneNumber: [null,
  //         [Validators.required, Validators.pattern(VALIDATORS.PHONE), Validators.maxLength(256)]
  //       ],
  //       email: [null,
  //         [Validators.required, Validators.pattern(VALIDATORS.EMAIL), Validators.maxLength(256)]
  //       ],
  //     });
  //   }
  // }

  //  addContact() {
  //   (this.formContact?.get('contacts') as FormArray).push(this.createContact(null));
  // }

  //  removeContact(index: number) {
  //   (this.formContact?.get('contacts') as FormArray).removeAt(index);
  // }

  onAddLinkUserToContact(item: ICustomerContact): void {
    const { id, fullName, phoneNumber, email, organizationId } = item;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        typeUser: USER_PROFILE_LDAP,
        contact: true,
      },
      state: {
        contactId: id,
        companyName: this.customer.name,
        fullName,
        phoneNumber,
        email,
        organizationId,
      },
    };
    this.router.navigate([`/setting/user/create`], navigationExtras);
  }

  onOpenDeleteContact(item: ICustomerContact): void {
    this.isVisibleContact = true;
    this.itemDelete = item;
  }

  onDeleteContact(result: { success: boolean }): void {
    if (result && result?.success) {
      this.customerService
        .deleteContact(this.customerId, this.itemDelete.id, true)
        .subscribe((res) => {
          this.toast.success('model.customer.success.deleteContact');
          this.isVisibleContact = false;
          this.searchContacts(this.customerId, this.contactRequest);
        });
    } else {
      this.isVisibleContact = false;
    }
  }

  onClickActionLeasing(item: ICustomerRent, type: string): void {
    switch (type) {
      case 'delete': {
        this.groupLeasingPopup.title = 'model.customer.titleDeleteLeasing';
        this.groupLeasingPopup.content = 'model.customer.contentDeleteLeasing';
        break;
      }
      case 'paid': {
        this.groupLeasingPopup.title = 'model.customer.titlePaidLeasing';
        this.groupLeasingPopup.content = 'model.customer.contentPaidLeasing';
        break;
      }
      case 'returned': {
        this.groupLeasingPopup.title = 'model.customer.titleResetLeasing';
        this.groupLeasingPopup.content = 'model.customer.contentResetLeasing';
        break;
      }
    }
    this.itemDelete = item;
    this.groupLeasingPopup.type = type;
    this.isVisibleLeasing = true;
  }

  onHandleActionLeasing(result: { success: boolean }): void {
    if (result && result?.success) {
      switch (this.groupLeasingPopup.type) {
        case 'delete': {
          const unitId = {
            unitId: this.itemDelete.unitId,
          };
          this.customerService
            .deleteUnit(this.customerId, unitId, true)
            .subscribe((res) => {
              this.toast.success('model.customer.success.deleteLeasing');
              this.isVisibleLeasing = false;
              this.searchLeasing(this.customerId, this.leasingRequest);
            });
          break;
        }
        case 'paid': {
          const unitId = {
            unitId: this.itemDelete.unitId,
          };
          this.customerService
            .leaseUnit(this.customerId, unitId, true)
            .subscribe((res) => {
              this.toast.success('model.customer.success.paidLeasing');
              this.isVisibleLeasing = false;
              this.searchLeasing(this.customerId, this.leasingRequest);
            });
          break;
        }
        case 'returned': {
          const unitId = {
            unitId: this.itemDelete.unitId,
          };
          this.customerService
            .returnUnit(this.customerId, unitId, true)
            .subscribe((res) => {
              this.toast.success('model.customer.success.returnedLeasing');
              this.isVisibleLeasing = false;
              this.searchLeasing(this.customerId, this.leasingRequest);
            });
          break;
        }
      }
    } else {
      this.isVisibleLeasing = false;
    }
  }

  disabledAfterToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  }

  enterDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.incorporationDate.setValue(
        this.form.controls.incorporationDate.value
      );
      this.datePicker.close();
    } else if (!this.disabledAfterToday(CommonUtil.newDate(date))) {
      this.form.controls.incorporationDate.setValue(CommonUtil.newDate(date));
      this.datePicker.close();
    } else {
      this.form.controls.incorporationDate.setValue(
        this.form.controls.incorporationDate.value
      );
      this.datePicker.close();
    }
  }

  clickOnSearch(): void {
    const event = {
      target: {
        value: this.form.controls.businessCode.value || '',
      },
    };
    this.search(event);
  }

  search(event: any): void {
    const code = event?.target?.value || '';
    if (code.length > 0) {
      this.customerService
        .findByBusinessCode(code.trim(), true)
        .subscribe((res: any) => {
          if (res?.body?.code === STATUS.ERROR_404 || !res?.body?.success) {
            this.modalSearch.isShowBusinessCodeNotUse = true;
          } else {
            const data = res?.body?.data;
            this.modalSearch.show = true;
            this.modalSearch.customerId = data?.id || '';
          }
        });
    }
  }

  onHandleSearch(event: any): void {
    if (event.success) {
      this.modalSearch.isShowBusinessCodeUse = false;
      this.modalSearch.isShowBusinessCodeNotUse = false;
      this.modalSearch.show = false;
      this.router.navigate([`/customer/${this.modalSearch.customerId}/update`]);
    } else {
      this.modalSearch.isShowBusinessCodeUse = true;
      this.modalSearch.isShowBusinessCodeNotUse = false;
      this.modalSearch.show = false;
    }
  }

  clearBusinessCodeValidate(event: Event): void {
    this.modalSearch.isShowBusinessCodeUse = false;
    this.modalSearch.isShowBusinessCodeNotUse = false;
  }
}
