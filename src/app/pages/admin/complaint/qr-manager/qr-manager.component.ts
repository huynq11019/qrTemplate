import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QR_STATUS } from '@shared/constants/complaint.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { IComplaintTemplate } from '@shared/models/complaint-template.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { QrTemplateService } from '@shared/services/qr-template.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ComplaintTemplateFilterComponent } from './complaint-template-filter/complaint-template-filter.component';
import { HandleConfirmComponent } from './handle-confirm/handle-confirm.component';

@Component({
  selector: 'app-qr-manager',
  templateUrl: './qr-manager.component.html',
  styleUrls: ['./qr-manager.component.scss'],
})
export class QrManagerComponent implements OnInit {
  total = 0;
  translatePath = 'model.qr-manager.qr-list.';
  public qrList: Array<IComplaintTemplate> = [];
  qrStatus = QR_STATUS;
  loadFirst = true;
  complaintSearchRequest = {
    keyword: '',
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    sortBy: '',
  };
  // qrGroupModal = {
  //   title: 'model.qr-manager.confirm.lock-qr.title',
  //   content: 'model.qr-manager.confirm.lock-qr.content',
  //   okText: 'action.lock',
  //   callBack: () => {
  //   }
  // };
  // isVisible = false;

  constructor(
    private translateService: TranslateService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private qrTemplateService: QrTemplateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.searchQrCode();
  }

  onChangeQueryParams(event: NzTableQueryParams): void {
    if (this.loadFirst) {
      this.loadFirst = false;
      return;
    }
    const { sortBy } = CommonUtil.onQueryParam(event);
    this.complaintSearchRequest.sortBy = sortBy;
    this.searchQrCode();
  }

  public searchQrCode(): void {
    this.qrTemplateService
      .searchComplaintTemplate(this.complaintSearchRequest)
      .subscribe((res) => {
        this.qrList = res.body?.data as Array<IComplaintTemplate>;
        this.total = res.body?.page?.total || 0;
      });
  }

  public getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.complaintSearchRequest.pageIndex,
      this.complaintSearchRequest.pageSize
    );
  }

  public limitText(textInput = '', length = 20): string {
    return CommonUtil.getLimitLength(textInput, length, 20);
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.complaintSearchRequest.pageIndex = pageIndex;
    this.complaintSearchRequest.pageSize = pageSize;
    // this.loadData(this.pageIndex, this.pageSize);
    this.searchQrCode();
  }

  public getTranslate(key: string): string {
    return this.translateService.instant(this.translatePath + key);
  }

  public toCreateQrCode(qrId?: string): void {
    if (qrId) {
      this.route.navigate([`/complaint/${qrId}/qr-update`]);
    } else {
      this.route.navigate(['/complaint/create-qr']);
    }
  }

  public format(value?: string): string {
    if (!!value) {
      return this.translateService.instant(
        ['common', value?.toLowerCase()].join('.')
      );
    }
    return '';
  }

  // public showModal(qrItem: IComplaintTemplate): void {
  //   if (!qrItem.id) {
  //     return;
  //   }
  //   if (qrItem.status === this.qrStatus.ACTIVE.value) {
  //     this.qrGroupModal.title = 'model.qr-manager.confirm.lock-qr.title';
  //     this.qrGroupModal.content = 'model.qr-manager.confirm.lock-qr.content';
  //     this.qrGroupModal.okText = 'action.lock';
  //     this.qrGroupModal.callBack = () => {
  //       this.lockQrCode(qrItem);
  //       this.isVisible = false;
  //     };
  //   } else {
  //     this.qrGroupModal.title = 'model.qr-manager.confirm.unlock-qr.title';
  //     this.qrGroupModal.content = 'model.qr-manager.confirm.unlock-qr.content';
  //     this.qrGroupModal.okText = 'action.unlock';
  //     this.qrGroupModal.callBack = () => {
  //       this.unlockQrCode(qrItem);
  //       this.isVisible = false;
  //     };
  //   }
  //   this.isVisible = true;
  // }

  public showLockConfirm(item: IComplaintTemplate): void {
    const base = CommonUtil.modalBase(
      HandleConfirmComponent,
      {
        complaintItem: item,
      },
      '50%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        if (item.status === this.qrStatus.ACTIVE.value) {
          this.lockQrCode(item?.id || '', result?.data?.reason);
        } else {
          this.unlockQrCode(item?.id || '', result?.data?.reason);
        }
      }
    });
  }

  // public handleConfirmInvalidBuilding(event: any): void {
  //   this.isVisible = false;
  // }

  public unlockQrCode(complaintId: string, reason: string): void {
    if (!complaintId) {
      return;
    }
    this.qrTemplateService.active(complaintId, reason).subscribe((res) => {
      this.searchQrCode();
      this.toastService.success(
        'model.qr-manager.message.unlock-template-success'
      );
    });
  }

  public lockQrCode(complaintId: string, reason: string): void {
    if (!complaintId) {
      return;
    }
    this.qrTemplateService
      .inactive(complaintId, reason, true)
      .subscribe((res) => {
        this.searchQrCode();
        this.toastService.success(
          this.translateService.instant(
            'model.qr-manager.message.lock-template-success'
          )
        );
      });
  }

  public filter(): void {
    const base = CommonUtil.modalBase(
      ComplaintTemplateFilterComponent,
      {
        filterRequest: this.complaintSearchRequest,
      },
      '50%'
    );
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success) {
        this.complaintSearchRequest = {
          ...this.complaintSearchRequest,
          ...result?.value,
        };
        // this.complaintSearchRequest = {...this.complaintSearchRequest, ...this.filterRequest};
        this.searchQrCode();
      }
    });
  }
}
