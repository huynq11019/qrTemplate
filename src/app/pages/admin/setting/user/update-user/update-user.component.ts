import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { STATUS } from '@shared/constants/status.constants';
import {
  ACTION_TYPE,
  USER_ACTIVE,
  USER_GENDER,
  USER_LEVEL,
  USER_LEVEL_CENTER,
  USER_PROFILE_INTERNAL,
  USER_PROFILE_LDAP,
  USER_STATUS,
  USER_TYPE,
} from '@shared/constants/user.constant';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import { IBuilding } from '@shared/models/building.model';
import { ICustomer } from '@shared/models/customer.model';
import { IRole } from '@shared/models/role.model';
import { IUserLevel } from '@shared/models/user-level.models';
import { User } from '@shared/models/user.model';
import { AccountService } from '@shared/services/account.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { BuildingService } from '@shared/services/building.service';
import { CustomerService } from '@shared/services/customer.service';
import { FileService } from '@shared/services/file.service';
import { LoadingService } from '@shared/services/helpers/loading.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { RoleService } from '@shared/services/role.service';
import { UserService } from '@shared/services/user.service';
import CommonUtil from '@shared/utils/common-utils';
import Validation from '@shared/validators/confirmed-password.validator';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  id = '';
  isUpdate = false;
  contact = false;
  isVisible = false;
  user: User = new User();
  typeUser = '';
  isInternal = false;
  isLdap = false;
  userTypeLocal = '';
  userCenter = false;
  buildings: IBuilding[] = [];
  roles: IRole[] = [];
  customers: ICustomer[] = [];
  userLevels?: IUserLevel[] = [];
  form: FormGroup = new FormGroup({});
  passwordVisible = false;
  rePasswordVisible = false;
  files: [] | any;
  userStatus = USER_STATUS;
  userGender = USER_GENDER;
  userLevel = USER_LEVEL;
  userLevelCenter = USER_LEVEL_CENTER;
  userType = USER_TYPE;
  userActive = USER_ACTIVE;
  ownerId = '';
  userProfileInternal = USER_PROFILE_INTERNAL;
  userProfileLdap = USER_PROFILE_LDAP;
  contactObject: User = new User();
  ACTION_TYPE = ACTION_TYPE;
  groupConfirmUser = {
    title: 'model.user.managerUser.create',
    content: 'common.confirmSave',
    okText: 'action.save',
    callBack: () => {},
  };
  imageUrl?: any;
  userLevelRole = '';
  keyword = '';
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;

  @ViewChild('datePicker') datePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private userService: UserService,
    private buildingService: BuildingService,
    private roleService: RoleService,
    private customerService: CustomerService,
    // private modalRef: NzModalRef,
    private toast: ToastService,
    private fileService: FileService,
    private accountService: AccountService,
    private router: ActivatedRoute,
    private routerLink: Router,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.contactObject = this.routerLink?.getCurrentNavigation()?.extras
      ?.state as User;
    this.router.paramMap.subscribe((res) => {
      this.id = res.get('id') || '';
    });
  }

  ngOnInit(): void {
    this.getProfile();
    this.initData();
    this.initForm();
    this.getDataParam();
  }

  // Clear validate form theo từng tài khoản nội bộ, khách hàng ngoai, tài khoản liên hệ
  clearValid(): void {
    if (this.isInternal) {
      this.form.controls.password.clearValidators();
      this.form.controls.repeatPassword.clearValidators();
      this.form.controls.organizationId.clearValidators();
      this.form.controls.password.updateValueAndValidity();
      this.form.controls.repeatPassword.updateValueAndValidity();
      this.form.controls.organizationId.updateValueAndValidity();
    }
    if (this.isLdap) {
      this.form.controls.employeeCode.clearValidators();
      this.form.controls.userLevel.clearValidators();
      this.form.controls.employeeCode.updateValueAndValidity();
      this.form.controls.userLevel.updateValueAndValidity();
    }
    if (this.contact) {
      this.form.controls.organizationId.clearValidators();
      this.form.controls.organizationId.updateValueAndValidity();
    }
    if (this.userCenter) {
      this.form.controls.buildingIds.clearValidators();
      this.form.controls.buildingIds.updateValueAndValidity();
    }
  }

  // Load data
  initData(): void {
    this.getDataParam();
    this.searchBuilding(true);
    this.searchCompany(true);
    this.findId();
    this.getUserLevel(true);
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        buildingIds: [
          {
            value: this.isUpdate
              ? this.user?.buildings?.map((item) => item.id)
              : null,
            disabled: this.isLdap
              ? this.contact || !!this.user?.organizationId
                ? false
                : true
              : false,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.IDS_MAX_LENGTH.MAX),
          ],
        ],
        employeeCode: [
          this.isUpdate ? this.user?.employeeCode : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.CODE_MAX_LENGTH.MAX),
          ],
        ],
        roleIds: [
          {
            value: this.isUpdate
              ? this.user?.roles?.map((item) => item.id)
              : null,
            disabled: this.isInternal ? (this.isUpdate ? false : true) : false,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.IDS_MAX_LENGTH.MAX),
          ],
        ],
        dayOfBirth: [
          this.isUpdate ? this.user?.dayOfBirth : null,
          [Validators.maxLength(LENGTH_VALIDATOR.BIRTH_MAX_LENGTH.MAX)],
        ],
        description: [
          this.isUpdate ? this.user?.description : null,
          [Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX)],
        ],
        gender: [
          this.isUpdate ? this.user?.gender : null,
          [Validators.maxLength(LENGTH_VALIDATOR.GENDER_MAX_LENGTH.MAX)],
        ],
        departmentName: [
          this.isUpdate ? this.user?.departmentName : null,
          [Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX)],
        ],
        organizationId: [
          {
            value: this.isUpdate ? this.user?.organizationId : null,
            disabled: this.isUpdate ? true : false,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.ID_MAX_LENGTH.MAX),
          ],
        ],
        // companyName: [{this.contactObject ? this.contactObject.companyName : null,disabled:thi}],
        companyName: [
          {
            value: this.contactObject ? this.contactObject.companyName : null,
            disabled: true,
          },
          [],
        ],

        username: [
          {
            value: this.isUpdate ? this.user?.username : null,
            disabled: this.isUpdate,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.USERNAME_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.USERNAME),
          ],
        ],
        password: [
          {
            value: this.isUpdate ? this.user?.password : null,
            disabled: this.isUpdate,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.PASSWORD_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.PASSWORD),
          ],
        ],
        repeatPassword: [
          {
            value: this.isUpdate ? this.user?.repeatPassword : null,
            disabled: this.isUpdate,
          },
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.PASSWORD_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.PASSWORD),
          ],
        ],

        fullName: [
          !this.contact
            ? this.isUpdate
              ? this.user?.fullName
              : null
            : this.contactObject
            ? this.contactObject.fullName
            : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
          ],
        ],
        email: [
          !this.contact
            ? this.isUpdate
              ? this.user?.email
              : null
            : this.contactObject
            ? this.contactObject.email
            : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.EMAIL_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.EMAIL),
          ],
        ],
        phoneNumber: [
          !this.contact
            ? this.isUpdate
              ? this.user?.phoneNumber
              : null
            : this.contactObject
            ? this.contactObject.phoneNumber
            : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.PHONE_MAX_LENGTH.MAX),
            Validators.pattern(VALIDATORS.PHONE),
          ],
        ],

        status: [
          this.isUpdate ? this.user?.status : this.userActive,
          [Validators.maxLength(LENGTH_VALIDATOR.STATUS_MAX_LENGTH.MAX)],
        ],
        title: [
          this.isUpdate ? this.user?.title : null,
          [Validators.maxLength(LENGTH_VALIDATOR.TITLE_MAX_LENGTH.MAX)],
        ],
        userLevel: [
          this.isUpdate ? this.user?.userLevel : null,
          [
            Validators.required,
            Validators.maxLength(LENGTH_VALIDATOR.STATUS_MAX_LENGTH.MAX),
          ],
        ],
      },
      {
        validators: [Validation.match('password', 'repeatPassword')],
      }
    );
  }

  // Kiểm tra mật khẩu khác nhau hay không
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // Lấy param trên URL và kiểm tra đây là tài khoản nội bộ hay tài khoản khách hàng **/
  getDataParam(): void {
    const typeUser = this.router.snapshot.queryParamMap.get('typeUser');
    const contactUser = this.router.snapshot.queryParamMap.get('contact');
    if (
      typeUser !== this.userProfileInternal &&
      typeUser !== this.userProfileLdap
    ) {
      this.routerLink.navigate([`setting/user`]);
    }
    if (typeUser === this.userProfileInternal) {
      this.isInternal = true;
    } else {
      this.isLdap = true;
    }

    if (this.id) {
      this.isUpdate = true;
    } else {
      this.isUpdate = false;
      this.searchRoles(this.keyword, true);
    }

    if (contactUser) {
      this.contact = true;
    }
    if (this.contactObject?.organizationId) {
      this.searchBuildingsByOrganizationId(
        this.contactObject?.organizationId,
        true
      );
    }
    this.initForm();
    this.clearValid();
  }

  /*Tim thông tin cua user do*/
  findId(): void {
    if (!!this.id) {
      this.userService.find(this.id, true).subscribe((res: any) => {
        this.user = res.body?.data;
        // const fileUser = this.user.file as File;
        if (this.user.userLevel === this.userLevelCenter) {
          this.userCenter = true;
          this.form.controls.buildingIds.disable();
          this.form.controls.buildingIds.updateValueAndValidity();
        }
        // this.getAvatarFile(this.user.avatarFileId || '');
        if (this.user?.avatarFileUrl) {
          this.imageUrl =
            this.user?.avatarFileUrl + '?token=' + this.authService.getToken();
        }
        this.userLevelRole = this.user.userLevel || '';
        this.searchRoles(this.keyword, true);
        if (this.user?.organizationId) {
          this.searchBuildingsByOrganizationId(this.user?.organizationId, true);
        }
        this.initForm();
        this.clearValid();
      });
    }
  }

  // Lấy thông tin của tài khoản đang đăng nhập **/
  getProfile(): void {
    const user = this.authService.getCurrentUser() as User;
    this.ownerId = user?.id || '';
    this.userTypeLocal = user?.authenticationType || '';
  }

  // Lấy thông tin building fill ra ô select building **/
  searchBuilding(isLoading = false): void {
    if (!this.contact && !this.isLdap) {
      this.accountService.getBuildings(isLoading).subscribe((res: any) => {
        this.buildings = res.body?.data;
      });
    }
  }

  // Lấy thông tin role fill ra ô select role **/
  searchRoles(keyword: any, isLoading = false): void {
    const options = {
      keyword: keyword.trim(),
      userLevel: this.userLevelRole.trim(),
    };
    this.roleService
      .searchAutoComplete(options, isLoading)
      .subscribe((res: any) => {
        this.roles = res.body?.data;
      });
  }

  // Lấy thông tin company fill ra ô select company **/
  searchCompany(isLoading = false): void {
    this.customerService.findByCurrentUser(isLoading).subscribe((res: any) => {
      this.customers = res.body?.data;
    });
  }

  // Lấy thông tin building search theo công ty **/
  searchBuildingsByOrganizationId(id: string, isLoading = false): void {
    if (this.contact) {
      this.customerService
        .findBuildingsByOrganizationId(id, isLoading)
        .subscribe((res: any) => {
          this.buildings = res.body?.data;
          if (this.buildings.length === 1) {
            this.form
              .get('buildingIds')
              ?.setValue(this.buildings.map((item) => item.id));
          }
        });
    } else {
      if (this.user?.buildings) {
      } else {
        this.form.get('buildingIds')?.reset();
      }
      this.form.get('buildingIds')?.enable();
      this.customerService
        .findBuildingsByOrganizationId(id, isLoading)
        .subscribe((res: any) => {
          this.buildings = res.body?.data;
          if (this.buildings.length === 1) {
            this.form
              .get('buildingIds')
              ?.setValue(this.buildings.map((item) => item.id));
          }
        });
    }
  }

  getUserLevel(isLoading = false): void {
    this.userService.findUserLevel(isLoading).subscribe((res: any) => {
      this.userLevels = res.body?.data;
    });
  }

  // Lấy thông tin file ảnh **/
  getAvatarFile(id: string): void {
    if (id) {
      this.imageUrl = this.fileService.viewFileResource(id);
    }
  }

  // downloadFile(file: any) {
  //   this.fileService.downloadFile(file);
  // }

  // Nút Tạo mới **/
  onSubmit(): void {
    this.clearValid();
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const user: User = {
      ...this.form.value,
      file: null,
      avatarFileId: null,
      contactId: null,
    };

    if (this.userCenter) {
      user.buildingIds = [];
    }

    if (this.isLdap && this.contact) {
      user.contactId = this.contactObject?.contactId;
    }

    if (this.form.get('dayOfBirth')?.value) {
      user.dayOfBirth = moment(user.dayOfBirth).format('yyyy-MM-DD');
    }
    if (this.files) {
      this.fileService
        .uploadFile(this.files, this.ownerId, this.userType)
        .subscribe((res: any) => {
          const file = res.body?.data;
          user.avatarFileId = file.id;
          if (this.isInternal) {
            this.createInternal(user);
          } else if (this.isLdap && this.contact) {
            this.createContact(user);
          } else {
            this.createLdap(user);
          }
        });
    } else {
      if (this.isInternal) {
        this.createInternal(user);
      } else if (this.isLdap && this.contact) {
        this.createContact(user);
      } else {
        this.createLdap(user);
      }
    }
  }

  // Tạo mới theo tài khoản nội bộ **/
  createInternal(user: User): void {
    const body = CommonUtil.trim(user);
    this.userService.create(body).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.user.success.create');
        window.history.back();
      }
    });
  }

  // Tạo mới theo tài khoản khách hàng **/
  createLdap(user: User): void {
    const body = CommonUtil.trim(user);
    this.userService.createLdap(body).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.user.success.create');
        window.history.back();
      }
    });
  }

  // Tạo mới theo thông tin liên hệ khách hàng **/
  createContact(user: User): void {
    const body = CommonUtil.trim(user);
    this.userService.createContact(body).subscribe((res) => {
      if (res.status === STATUS.SUCCESS_200) {
        this.toast.success('model.user.success.create');
        window.history.back();
      }
    });
  }

  // Cập nhật thông tin khách hàng **/
  onUpdateSubmit(): void {
    this.clearValid();
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const user: User = {
      username: this.user.username,
      ...this.form.value,
    };

    if (this.userCenter) {
      user.buildingIds = [];
    }

    if (this.user?.avatarFileId) {
      user.avatarFileId = this.user?.avatarFileId;
    }

    if (this.form.get('dayOfBirth')?.value) {
      user.dayOfBirth = moment(user.dayOfBirth).format('yyyy-MM-DD');
    }
    if (this.files) {
      this.fileService
        .uploadFile(this.files, this.ownerId, this.userType)
        .subscribe((res: any) => {
          const file = res.body?.data;
          user.avatarFileId = file.id;
          this.onUpdate(user);
        });
    } else {
      this.onUpdate(user);
    }
  }

  async onUpdate(user: User): Promise<void> {
    const body = CommonUtil.trim(user);
    if (this.user?.id) {
      await this.userService.update(body, this.user.id).subscribe((res) => {
        if (res.status === STATUS.SUCCESS_200) {
          this.toast.success('model.user.success.update');
          window.history.back();
        }
      });
    }
  }

  // Lấy file **/
  getFiles(files: any): void {
    if (files) {
      this.files = files[0];
      this.getBase64(files[0]).then((data) => {
        this.imageUrl = data;
      });
    }
  }

  getBase64(image: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // Nút hủy **/
  onCancel(): void {
    window.history.back();
  }

  onChangeDate(result: Date): void {}

  openConfirm(actionType: string): void {
    if (actionType === ACTION_TYPE.CREATE_USER) {
      this.groupConfirmUser.callBack = this.onSubmit.bind(this);
    } else if (actionType === ACTION_TYPE.UPDATE_USER) {
      this.groupConfirmUser.title = 'model.user.managerUser.update';
      this.groupConfirmUser.callBack = this.onUpdateSubmit.bind(this);
    }
    this.isVisible = true;
  }

  /*handle confirm*/
  handleConfirm(result: { success: boolean }): void {
    if (!!result && result.success) {
    }
    this.groupConfirmUser.callBack = () => {};
    this.isVisible = false;
  }

  mappingBuildings(buildings: IBuilding[]): (string | undefined)[] {
    return buildings.map((building: IBuilding) => building.id);
  }

  selectAll(controls: string, value: any[]): void {
    const formControl = this.form.controls[controls];
    if (formControl.value?.length === value.length) {
      formControl.setValue([]);
    } else {
      if (controls === 'buildingIds') {
        formControl.setValue(this.mappingBuildings(value));
      }
    }
  }

  disabledAfterToday(current: Date): boolean {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  }

  enterDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.dayOfBirth.setValue(
        this.form.controls.dayOfBirth.value
      );
      this.datePicker.close();
    } else if (!this.disabledAfterToday(CommonUtil.newDate(date))) {
      this.form.controls.dayOfBirth.setValue(CommonUtil.newDate(date));
      this.datePicker.close();
    } else {
      this.form.controls.dayOfBirth.setValue(
        this.form.controls.dayOfBirth.value
      );
      this.datePicker.close();
    }
  }

  changeBuilding(event: any): void {
    if (event) {
      this.userLevelRole = event;
      if (event === this.userLevelCenter) {
        this.userCenter = true;
        this.form.controls.buildingIds.clearValidators();
        this.form.controls.buildingIds.disable();
        this.form.controls.buildingIds.updateValueAndValidity();
      } else {
        this.userCenter = false;
        this.form.controls.buildingIds.setValidators(Validators.required);
        this.form.controls.buildingIds.enable();
        this.form.controls.buildingIds.updateValueAndValidity();
      }
      this.searchRoles(this.keyword);
      this.form.get('roleIds')?.reset();
      this.form.get('roleIds')?.enable();
    } else {
      this.form.get('roleIds')?.reset();
      this.form.get('roleIds')?.disable();
    }
  }
}
