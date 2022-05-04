import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES_CONST } from '@shared/constants/base.constant';
import {
  COMPLAINT_STATUS,
  COMPLAINT_TYPE,
} from '@shared/constants/complaint.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import {
  USER_LEVEL_CENTER,
  USER_LEVEL_LEADER_MANAGEMENT,
} from '@shared/constants/user.constant';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import { Complaint, IComplaint } from '@shared/models/complaint.model';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/services/auth/auth.service';
import { ComplaintService } from '@shared/services/complaint.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { LocalStorageService } from 'ngx-webstorage';
import { LOCAL_STORAGE } from 'src/app/shared/constants/local-session-cookies.constants';

@Component({
  selector: 'app-mark-spams',
  templateUrl: './mark-spams.component.html',
  styleUrls: ['./mark-spams.component.scss'],
})
export class MarkSpamsComponent implements OnInit {
  @Input() complaints: Complaint[] = [];
  @Input() complaint?: IComplaint;
  @Input() isConfirm = false;

  USER_LEVEL_CENTER = USER_LEVEL_CENTER;
  USER_LEVEL_LEADER_MANAGEMENT = USER_LEVEL_LEADER_MANAGEMENT;
  DELETE = 'DELETE';
  CONFIRM = 'CONFIRM';

  complaintStatus = COMPLAINT_STATUS;
  complaintType = COMPLAINT_TYPE;
  currentUser: User | null = null;
  translatePath = 'model.complaint.';
  currentLanguage = '';
  LANGUAGES_CONST = LANGUAGES_CONST;
  MAX_DESCRIPTION_LENGTH = LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX;
  complaintSearchRequest = {
    keyword: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
  };
  checked = true;
  loading = false;
  form: FormGroup = new FormGroup({});
  setOfCheckedId = new Set<string>();
  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private modalRef: NzModalRef,
    private complaintService: ComplaintService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private route: Router
  ) {
    this.currentLanguage =
      this.localStorage.retrieve(LOCAL_STORAGE.LANGUAGE) ||
      LANGUAGES_CONST.VI.code;
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.complaints.forEach((complaint: IComplaint) => {
      this.setOfCheckedId?.add(complaint?.id || '');
    });
    if (this.complaint) {
      this.setOfCheckedId?.add(this.complaint?.id || '');
    }
    this.initForm();
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      reason: [
        null,
        [
          Validators.required,
          Validators.maxLength(this.MAX_DESCRIPTION_LENGTH),
          Validators.pattern(VALIDATORS.SPACE),
        ],
      ],
      setOfCheckedId: [
        this.setOfCheckedId,
        [Validators.required, Validators.minLength(1)],
      ],
    });
  }

  public getTranslate(key: string): string {
    return this.translateService.instant(this.translatePath + key);
  }

  public getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.complaintSearchRequest.pageIndex,
      this.complaintSearchRequest.pageSize
    );
  }

  getLimitLength(text?: string, length?: number): string {
    return CommonUtil.getLimitLength(text, length);
  }

  checkDisableCheckbox(complaint: Complaint): boolean {
    if (this.currentUser?.userLevel === USER_LEVEL_LEADER_MANAGEMENT) {
      return !(
        complaint.status === this.complaintStatus.OPEN.value &&
        complaint.complaintType === this.complaintType.UNDEFINED.value
      );
    }
    if (this.currentUser?.userLevel === USER_LEVEL_CENTER) {
      return complaint.complaintType !== this.complaintType.SPAM.value;
    }
    return false;
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  // Update checked all
  refreshCheckedStatus(complaints: IComplaint[]): void {
    let listOfEnabledData: Array<IComplaint> = new Array<IComplaint>();
    if (this.currentUser?.userLevel === USER_LEVEL_LEADER_MANAGEMENT) {
      listOfEnabledData = this.complaints.filter((complaint) => {
        return (
          complaint.status === this.complaintStatus.OPEN.value &&
          complaint.complaintType === this.complaintType.UNDEFINED.value
        );
      });
    } else if (this.currentUser?.userLevel === USER_LEVEL_CENTER) {
      listOfEnabledData = this.complaints.filter((complaint) => {
        return complaint.complaintType === this.complaintType.SPAM.value;
      });
    }
    this.checked =
      listOfEnabledData.length > 0 &&
      listOfEnabledData.every((complaint) => {
        return this.setOfCheckedId?.has(complaint?.id || '');
      });
  }

  onItemChecked(checked: boolean, id?: string): void {
    if (!!id) {
      this.updateCheckedSet(id, checked);
      this.refreshCheckedStatus(this.complaints);
    }
  }

  onAllChecked(checked: boolean): void {
    if (this.currentUser?.userLevel === USER_LEVEL_LEADER_MANAGEMENT) {
      this.complaints
        .filter((complaint) => {
          return (
            complaint.status === this.complaintStatus.OPEN.value &&
            complaint.complaintType === this.complaintType.UNDEFINED.value
          );
        })
        .forEach((complaint) => {
          if (complaint.id) {
            this.updateCheckedSet(complaint.id, checked);
          }
        });
      this.refreshCheckedStatus(this.complaints);
    }
    if (this.currentUser?.userLevel === USER_LEVEL_CENTER) {
      this.complaints
        .filter((complaint) => {
          return complaint.complaintType === this.complaintType.SPAM.value;
        })
        .forEach((complaint) => {
          if (complaint.id) {
            this.updateCheckedSet(complaint.id, checked);
          }
        });
      this.refreshCheckedStatus(this.complaints);
    }
  }

  action(isAction: string): void {
    if (isAction === this.DELETE) {
      this.complaintService
        .deletes([...this.setOfCheckedId], true)
        .subscribe((res: any) => {
          if (!!res && res?.body?.success) {
            this.toast.success('model.complaint.success.delete');
          }
        });
    } else if (isAction === this.CONFIRM) {
      this.complaintService
        .markAsSpam(
          [...this.setOfCheckedId],
          this.form.controls.reason.value,
          true
        )
        .subscribe((res: any) => {
          if (!!res && res?.body?.success) {
            this.toast.success('model.complaint.success.changeClassify');
          }
        });
    }
    this.modalRef.close({
      success: true,
    });
  }

  cancel(): void {
    this.modalRef.close({
      success: false,
    });
  }
}
