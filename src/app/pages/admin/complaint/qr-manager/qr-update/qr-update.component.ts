import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import {
  QR_STATUS,
  TEMPLATE_CHANGE_ACTION,
} from '@shared/constants/complaint.constant';
import { PAGINATION } from '@shared/constants/pagination.constants';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IValidateMessage } from '@shared/interface/validate-message';
import { IBuilding } from '@shared/models/building.model';
import { IComplaintTemplate } from '@shared/models/complaint-template.model';
import { IComplaintTemplateHistory } from '@shared/models/ComplaintTemplateHistory';
import { IFloor } from '@shared/models/floor.model';
import { IBuildingRequest } from '@shared/models/request/building-request.model';
import { BuildingService } from '@shared/services/building.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { QrTemplateService } from '@shared/services/qr-template.service';
import { ScriptPdfService } from '@shared/services/script-pdf.service';
import CommonUtil from '@shared/utils/common-utils';
import { ROUTER_UTILS } from '@shared/utils/router.utils';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { HandleConfirmComponent } from '../handle-confirm/handle-confirm.component';

declare let pdfMake: any;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-qr-update',
  templateUrl: './qr-update.component.html',
  styleUrls: ['./qr-update.component.scss'],
})
export class QrUpdateComponent implements OnInit {
  public translatePath = 'model.qr-manager.qr-create.';
  public isUpdate = window.location.href.includes('qr-update');
  public qrCodeLink?: string;
  public floorId?: string;
  public buildings: Array<IBuilding> = new Array<IBuilding>();
  public floors: Array<IFloor> = new Array<IFloor>();
  public histories: Array<IComplaintTemplateHistory> =
    new Array<IComplaintTemplateHistory>();
  public totalHistories = 0;
  public historiesSearchRequest = {
    pageIndex: PAGINATION.PAGE_DEFAULT,
    pageSize: PAGINATION.SIZE_DEFAULT,
    keyword: '',
    sortBy: '',
  };
  historyAction = TEMPLATE_CHANGE_ACTION;

  public qrCodeDetail?: IComplaintTemplate;
  public qrTemplateId?: string;
  @ViewChild('complaintQrCode') qrCodeInput?: any;

  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  qrStatus = QR_STATUS;
  public qrForm: FormGroup = new FormGroup({});
  public validateMessages: IValidateMessage[] = [
    {
      field: 'buildingId',
      fieldName: 'model.qr-manager.detail.building',
      valid: [
        { type: 'required' },
        {
          type: 'maxLength',
          param: LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX,
        },
      ],
    },
    {
      field: 'status',
      fieldName: 'model.qr-manager.detail.status',
      valid: [{ type: 'required' }],
    },
    {
      field: 'title',
      fieldName: 'model.qr-manager.detail.name',
      valid: [
        { type: 'required' },
        {
          type: 'maxLength',
          param: LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX,
        },
      ],
    },
    {
      field: 'note',
      fieldName: 'model.qr-manager.detail.note',
      valid: [
        { type: 'maxLength', param: LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX },
      ],
    },
  ];

  constructor(
    private translateService: TranslateService,
    private buildingService: BuildingService,
    private qrTemplateService: QrTemplateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private toast: ToastService,
    private scriptPdfService: ScriptPdfService
  ) {}

  ngOnInit(): void {
    this.scriptPdfService.load('pdfMake', 'vfsFonts').finally(() => {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    });
    // this.qrCodeLink = `${environment.domain}/qr/be680605-c3a1-45c4-aa03-09757c904e1c/update`;
    this.initForm();
    if (!this.isUpdate) {
      this.loadDataBuilding();
      this.searchFloorAutoComplete();
    }
  }

  private initForm(): void {
    this.qrForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.TITLE_MAX_LENGTH.MAX),
        ],
      ],
      status: [QR_STATUS.ACTIVE.value, [Validators.required]],
      floorId: [{ value: '', disabled: true }, [Validators.required]],
      note: ['', [Validators.maxLength(LENGTH_VALIDATOR.DESC_MAX_LENGTH.MAX)]],
      buildingId: [
        { value: this.qrCodeDetail?.buildingId || '', disabled: this.isUpdate },
        [Validators.required],
      ],
    });
    this.findTemplateById();
  }

  private findTemplateById(): void {
    this.qrTemplateId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    if (this.qrTemplateId) {
      this.qrTemplateService.findById(this.qrTemplateId).subscribe((res) => {
        this.qrCodeDetail = res.body?.data as IComplaintTemplate;
        this.qrForm.patchValue({
          title: this.qrCodeDetail.title,
          status: this.qrCodeDetail.status,
          note: this.qrCodeDetail.note,
          buildingId: this.qrCodeDetail.buildingId,
          floorId: this.qrCodeDetail.floorId,
          qrUrl: this.qrCodeDetail.qrUrl,
        });
        this.loadDataBuilding(undefined, [this.qrCodeDetail?.buildingId || '']); // lấy thông tin tòa nhà
        this.onCreateQrCode(); // tạo mã QR
        this.loadChangeHistories();
      });
    }
  }

  public onBuildingChange(building: IBuilding): void {
    this.floors = new Array<IFloor>();
    this.qrForm.get('floorId')?.setValue(null);
    this.qrForm.get('floorId')?.enable();
    this.searchFloorAutoComplete();
  }

  public getTranslate(key: string): string {
    return this.translateService.instant(this.translatePath + key);
  }

  loadDataBuilding(keyword?: string, buildingIds?: string[]): void {
    const buildingSearchBuildingRequest: IBuildingRequest = {
      pageIndex: PAGINATION.PAGE_DEFAULT,
      pageSize: PAGINATION.SIZE_DEFAULT,
      keyword,
      sortBy: 'createdAt.desc',
      buildingIds,
    };
    this.buildingService
      .searchBuildingAutoComplete(buildingSearchBuildingRequest)
      .subscribe((res) => {
        this.buildings = res.body?.data as Array<IBuilding>;
      });
  }

  findBuildingByIds(buildingIds: string[]): void {
    if (buildingIds && buildingIds.length > 0) {
      this.buildingService.findByBuildingIds(buildingIds).subscribe((res) => {
        this.buildings = res.body?.data as Array<IBuilding>;
      });
    }
  }

  searchFloorAutoComplete(keyword?: string): void {
    const buildingId = this.qrForm?.get('buildingId')?.value as string;
    if (buildingId) {
      this.buildingService
        .simpleSearchFloor(buildingId, { keyword, sortBy: 'floorNumber.asc' })
        .subscribe((res) => {
          this.floors = res.body?.data as Array<IFloor>;
        });
    }
  }

  private loadChangeHistories(): void {
    if (this.qrTemplateId) {
      this.qrTemplateService
        .getHistoriesComplaintTemplate(
          this.qrTemplateId,
          this.historiesSearchRequest
        )
        .subscribe((res) => {
          this.histories = res.body?.data as Array<IComplaintTemplateHistory>;
        });
    }
  }

  public onSubmit(): void {
    if (this.qrForm?.valid) {
      const qrTemplate = this.qrForm.value as IComplaintTemplate;
      this.qrTemplateService.create(qrTemplate).subscribe((res) => {
        const template = res.body?.data as IComplaintTemplate;
        if (template) {
          this.router.navigate([
            `${ROUTER_UTILS.complaint.root}/${template.id}/qr-update`,
          ]);
        } else {
          this.router.navigate([
            `${ROUTER_UTILS.complaint.root}/${ROUTER_UTILS.complaint.qrList}`,
          ]);
        }
        this.toast.success(
          this.translateService.instant(
            'model.qr-manager.message.create-success'
          )
        );
      });
    }
  }

  public onCancel(): void {
    this.router.navigate(['/complaint/qr-list']);
  }

  public onUpdate(): void {
    if (!this.qrTemplateId) {
      this.toast.error(this.getTranslate('toast-message.qr-code-detail-error'));
    }
    if (this.qrForm?.valid && this.qrTemplateId) {
      // confirm and input reason
      this.showUpdateConfirm();
    }
  }

  public onCreateQrCode(): void {
    this.qrCodeLink = `${environment.domain}/#/feedback-public/${this.qrCodeDetail?.id}`;
  }

  public onChangeFloor(floorId: string): void {
    this.floorId = floorId;
    // this.qrForm.patchValue({
    //   floorId,
    // });
  }

  // public printQrCode2(): void {
  //   const floor = this.floors.find(f => f.id === this.qrCodeDetail?.floorId);
  //   const building = this.buildings.find(b => b.id === this.qrCodeDetail?.buildingId);
  //   const buildingParam = JSON.stringify({
  //     floorName: floor?.name,
  //     buildingName: building?.name,
  //   });
  //
  // tslint:disable-next-line:max-line-length
  //   const pageLink = `${environment.domain}/#/feedback-public/preview-print-qr?download=&id=${this.qrTemplateId}&buildingParam=${buildingParam}`;
  // tslint:disable-next-line:max-line-length
  //   const pwa = window.open(pageLink, 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
  // tslint:disable-next-line:max-line-length
  //   // const strHtml = '<html>\n<head>\n <link rel="stylesheet" type="text/css" href="test.css">\n</head><body onload=\'window.print();window.close()\'><div style="testStyle">\n' + elementHtmlStr + '\n</div>\n</body>\n</html>';
  //   // pwa?.document.writeln(strHtml);
  //   pwa?.document.close();
  //   pwa?.focus();
  // }
  //
  // public downloadQrCode(qrName?: string): void {
  //   const floor = this.floors.find(f => f.id === this.qrCodeDetail?.floorId);
  //   const building = this.buildings.find(b => b.id === this.qrCodeDetail?.buildingId);
  //   const buildingParam = JSON.stringify({
  //     floorName: floor?.name,
  //     buildingName: building?.name,
  //   });
  //   if (!qrName) {
  //     qrName = this.qrCodeDetail?.title || (this.qrCodeDetail?.floorId + '-' + this.qrCodeDetail?.buildingId);
  //   }
  //   this.router.navigate([`/feedback-public/preview-print-qr`], {
  //     queryParams: {
  //       download: true,
  //       id: this.qrTemplateId,
  //       buildingParam,
  //       qrName,
  //     },
  //   });
  // tslint:disable-next-line:max-line-length
  // const pageLink = `${environment.domain}/#/feedback-public/print-qr-preview?download=true&id=${this.qrTemplateId}&buildingParam=${buildingParam}`;
  // tslint:disable-next-line:max-line-length
  //   // const pwa = window.open(pageLink, 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');
  // tslint:disable-next-line:max-line-length
  //   // const strHtml = '<html>\n<head>\n <link rel="stylesheet" type="text/css" href="test.css">\n</head><body onload=\'window.print();window.close()\'><div style="testStyle">\n' + elementHtmlStr + '\n</div>\n</body>\n</html>';
  //   // pwa?.document.writeln(strHtml);
  //   // pwa?.document.close();
  //   // pwa?.focus();
  // }

  public getCurrentBuilding(): IBuilding | undefined {
    return this.buildings.find(
      (building) => building.id === this.qrForm.get('buildingId')?.value
    );
  }

  public onChangeQueryParams(params: NzTableQueryParams): void {
    // if (this.isCallFirstRequest) {
    //   this.isCallFirstRequest = false;
    //   return;
    // }
    const { sortBy } = CommonUtil.onQueryParam(params);
    this.historiesSearchRequest.sortBy = sortBy;
    this.loadChangeHistories();
  }

  onQuerySearch(params: any): void {
    const { pageIndex, pageSize } = params;
    this.historiesSearchRequest.pageIndex = pageIndex;
    this.historiesSearchRequest.pageSize = pageSize;
    // this.loadData(this.pageIndex, this.pageSize);
  }

  public getIndex(index: number): number {
    return CommonUtil.getIndex(
      index,
      this.historiesSearchRequest.pageIndex,
      this.historiesSearchRequest.pageSize
    );
  }

  public formatDateString(time?: number): string {
    if (time) {
      const date: Date = new Date(time);
      return moment(date).format('HH:mm:ss YYYY-MM-DD');
    }
    return '-';
  }

  getActionHistory(action?: string): string {
    return (
      this.historyAction.find((item) => item.value === action)?.label || '-'
    );
  }

  public showUpdateConfirm(): void {
    const base = CommonUtil.modalBase(HandleConfirmComponent, {}, '50%');
    const modal: NzModalRef = this.modalService.create(base);
    modal.afterClose.subscribe((result) => {
      if (result && result?.success && !!this.qrTemplateId) {
        const qrTemplate = this.qrForm.value as IComplaintTemplate;
        qrTemplate.reason = result?.data?.reason;
        this.qrTemplateService
          .update(this.qrTemplateId, qrTemplate, true)
          .subscribe(() => {
            this.toast.success(
              this.translateService.instant(
                'model.qr-manager.message.update-success'
              )
            );
            this.loadChangeHistories();
          });
      }
    });
  }

  getLimitText(text: string, limit: number = 80): string {
    return CommonUtil.getLimitLength(text, limit, 30);
  }

  // export pdf
  generatePdf(action = 'open'): void {
    const floorName =
      this.floors.find((f) => f.id === this.qrCodeDetail?.floorId)?.name ||
      'floorName';
    const buildingName =
      this.buildings.find((b) => b.id === this.qrCodeDetail?.buildingId)
        ?.name || 'buildingName';
    pdfMake.font = {
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    };
    const documentDefinition = this.getDocumentDefinition(
      floorName,
      buildingName
    );
    switch (action) {
      case 'open':
        pdfMake.createPdf(documentDefinition).open();
        break;
      case 'print':
        pdfMake.createPdf(documentDefinition).print();
        break;
      case 'download':
        pdfMake
          .createPdf(documentDefinition)
          .download(`${floorName}_${buildingName}.pdf`);
        // const blobPdf = pdfMake.createPdf(documentDefinition);
        // blobPdf.getBlob((blob: Blob): void => {
        //   CommonUtil.download(blob, `${floorName}_${buildingName}.pdf`);
        // });
        break;
      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }
  }

  getDocumentDefinition(floorName: string, buildingName: string): any {
    // sessionStorage.setItem('resume', JSON.stringify({}));
    return {
      watermark: {
        text: 'MB-AMC',
        angle: 45,
        opacity: 0.1,
        bold: true,
        italics: true,
      },
      info: {
        title: `${floorName}_${buildingName}`,
        author: 'MB-AMC',
        subject: 'Feedback',
      },
      defaultStyle: {
        font: 'Roboto',
      },
      content: [
        {
          image:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATIAAABGCAYAAABPAhimAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABi6SURBVHgB7Z3dclNHtsdXtz6YMGcmogIMhovITxBzcaoSO6nITxA7MRcJk8J+AswTIJ4A8wQ2JzG5gJyIJ7CoBOZUnQucJ0C5GJzBplCSSSD66J5evbWNJHf37r13b2kT+ldlsKWt79ba6+O/VhPIKf+a+WCpAOwyEKgRAm3OodFl/WszP/5fCzwej2cIAjnk6dn5qxxIffxy8WRbHdZf9MbM4/EMQyFn7J15t6oyYggHqJZIYRM8Ho9niNwZskhDRWAOPB6PZ4hcGbIn5+ZXMScWcVgFPB6PZ4jcGDIMKQscrkYeyKEJHo/HM0QRckKJFq5iDizqOM7JNfB4PJ4hcuGRoTcm/luNOk4UAa6d+vG7Jng8Hs8QuTBkZUp3oo6RRuzxd3XweDyeMaYeWg40Y1XjQRxuntr7rg4ej8ejYKqCWAwpy4XCQ871lUjxBHffenz/PHg8Ho+GqXpkMsFvMmIcWh3eXwaPx+MxMDVDJjVjXJ/gHxgx346UV5Y2q0cuK5UrwNnRExOhbeh22uK3NjTW2uDxDINrqVSuAedi7dC3xZd/dA1x9oNYQy3xfwt6vV3VGpKh5aNKrfLX453LnBNs0K5wEc5l3aB9cHb+G/HwS6rrxJNqd1j/fPj4T2feuwyU1gfe21Zum8dXvhAfhmULFemvwZ3Pm+CSlVvXxclhyerYrz+btTpu5daOuM+qWFxVcAUnLfEht8Rvu8D498A6TbE4WzAtTO8bFc/x9mduo4KVL9eB08vK6wi/CXcu1mFarGw/FJ+POkqifBluX9wFF+B3hdBLwniJ953EFbmL50CaAP274XeIDIzYQ2XCncHqyR/v34QMMBmyPqfLf9v7toG/o+dGORk1DhyaJ/fuL0LewAUK5LrdweKDuPOZu9eAZ7Vi+ZH18UwYp/+9+EPkcZ9sPxJGpwrZI4wa3BDPaQsmic37RuC8sy8wsvJFXVgFnfi7Db3O7FQ8VzQuYFIQsMXUJ98L26vic77qbE3hCZGRK/Qvx7vXtVVDChsDjZcSNIKm600wBndVl6PMIjRi8ikwcunIQdFtTNOBx/FaeC1YOI4olKO7IoYhJG8FlDmx3jbFQn8EH4vFPins3rfLMDkqUCyuwzTg9BJkxYXtucDbE5+xyxMjRgsiJKUEv1B6KiVClR4Ghnt//XP3kUjYP3p6buHZwcz8N/tn5+v7Z96toYGDCE7/+GALjVb4N4aTInS8YqsVezYz/zbkDUpjPqdCPOOjA70KEi0oHoH38tmzigsTDRqGe1mztInvQS3yOMzlBsdOBpKhQdGRZA3ZcmH7sjA26OllM/CB0SaN1HARsrR/5v3a8EUY7nFCN8KKo/xfHEeAXCW0sCO8vGdPzy48PDi7sInHPjn138oXgEbrl99KJ0TOa/bn30qzp/bubxx9eLWX0+11T0De4HHPNI68srjeGEJJFXINXxdhbbYjm0rlJWvvoFCuw6TAdeTSW7chyRqyYeWrq+L1bCTIg9kikv+ftoqyCTsiVKOUbz6r1M6faDeDuJ2JLyAxS9B4YH3nRH5rVSwYEF5bmzPYxUICAXbvl+fHmrPi/maD+2zr74dUlc+JFKvyReQKNLpxpXnSK2tCUpKeSQnNn0c7Dr6ulVvfi1ziBmRBkKuxfS7oJU0w5Eu5LuIg15BMuoNTpCfG6tEHcvz+43f5rvCKsBAk8oS91ssqOJkTBQh8jh/K30duCvfwvyLj/CYlpGZ8GIBq73hnXdx9Hf8mRFSdYhJ4bVAj0pWn68Jrg4M3Fppd3l/TVSBN+TdWyszCJ0OGHkme08ArS5pETXom5ZA/j1YJvyre24bzqiYmneN50BWZpL/zeR0mQsp1EQcpfXA8HguNI+d1s3FEA8ZvCKO1EVHcaA7dbwUKxZosFBL4SBg3mU8vYq5q/+z7VYILxgCGjU9OzTdO7z/YLZbLG+z3ziVOSBXSIAxbiRQeCoN1XmXMCgVaQSuqvGnsMC5jSph0hIQkPPsGWq4aJIHAO/BqIBZuGT0ht94QxyKS4gPDKhjKQ5S5Y/qR+KcOE2NCXlkcz9SWQhlzYnrjSKAB3e5a7OpscHxj8HOIbBqXCXYOkTILWgykBSdazTY9Vj7PGF8j6Aqmo6KbCkv6zNC6RPIVGvFiijNawlxZ8U+XEleAuPMBlfekbCD8uXORyJ/wb5QwcLYsHveG+GnFuWMZ1rlMtssTgKbI1QdRgOrrRkXNTTZ35biyrQI9U9fyGgwpjffJrsHti8suJSaHyv6Te/dXRYL+HW6qLAgPan/mvfVTe//YQGMmLtnCn4OZD0R8Hex4BEnQjK8mBar1cjjn+QqNCE3hkeHtC1jib8a5iTAMqynOpBVpHFwtJgKPlOHf6GWYB8Ez6XoQ2vHrluE4ShJwjTTBBbpwHL2xUMe2cqupNnYTzF1N4vFce2MypAR9ThM9sdvuw/ORMT60XFqM8rAIoVefjckrTu5920CBKlYfmfDsiCF5HwduCB9p7jwyVoU0oMJZ1fajw8WZlJbfhGlxWxgMztesj2eOOgvQeMvEtgJOhsIVdld9B8K4TVKKkaVXloU3hlGCDjxRdOkVyIARQ4ZeVoezKGNW6R/vKjU+mOc6LTw7bC+KGXY2VBdiu5T2FiRns/tdhGpBLsgOZjEWPArK7NqUsuLrzxuxw8y0oORC5wX2yI2Xv3e3BtW0o2QlWCW698KR3nAc7RriKRyRvv69wbC98WkLMuDIYEU0Rn0Ky7IEqmd1XFs2fh9YRHhr78EsZ2RRvDEN3bHovWHvpPJKDlqvy2Ys9kShDuQMtrkgV2dSV15OGmwr4KToJgTmWpX+3ZEvGYbcoqKvPpRmo/Rn6AWqjEgGXpl2DfGmeH27kIRPvtCfJIbD9gxQTog9/c8Hu7xPzI2yhFmdlXA09cnHD5YPw85hL41Ds0+4fsIFN+dPcqXu507kIHbtKS68MYTSfHm1Jkg/vSG7sIl5NnUOmJOtI5cR0J2AK/DJrSVwDn4d+Q31dY69Mt0aYkQYb55wXciqrhpZRMkO7ahrNEDYMqS7XlQNY+VXwrATvTQ0aqjox7waGk3tY0RMXBhX92MXAXYTyHYpUZTAdimYGNyRURBne5NXhmc9Z3kNPl1DZqoejtJ2oqdiZc3ECeEtfP3ZUaMlHxOnLCig4L6NiMKbUlOlxKFXpvPGQq8paZpEl3tEWKcBGWKc2Y8tQ8P9kMMwrdsdDRq12bBLwEBU+9RA3S/BkdmDKRmrsl2K0OvYLiUMGz+YWdjZn1m4fjDz3pJNH2gynIVpZq8sqG66YZrqfjRigdYoGr1nFJea5vImaNEk/YPijPu1ZAxpHXllOm8sjdckvV1tVLKb9TSPyMGKqDHbP/s+jAhmRYiIObDwT/R+hOF4B7vQGYW7/T5rpp0X9qxaq/Q7XeMxobp/cGxde+BYR8HT4wuyVYoRfg863d3T+/+fLCcw+iAOF7XMwdSPXGzvwdjhVN1v8frlyBw8+RRECMJWwWaz5aDSlT4sMSv5b2hvh0n/YlndwB6ccOrgivDz6HfXoVj66Oh76kDtr3sfhnNYiTz+8pzhyuhxUSmxmhCLxmzvzLtbJVKaY7TfOv04CAeDWWbdnUPtmSgzUg5LBVpoieNTTXfFCurBuYW2yc2l3SAx2u12qjSGGEbZB8qhkXhg49JXVTzNRSJnJ4HNQqkoF6x1OxKGQ1YGz51Hhh7KyvZLJR0fSuITNta+hYdZfl6MXHFS6dIp+dFbMM0aQ09CpykLplTUwRn8zZeP+YUwrkTxeafQleGJRKcbS5vDkvIjXYCHBYRssd4ODr/gqBcbzmkFs8yOJk+xolimhW8gJbqZZQiOwj755B8y5CiVyq2IKquRwRSPVfGcdxLNVyu9sPPGZEMsv2F17HgYEac5vEfs9FlZSlgwvxn+JPZW+RVl7iouJk+WgcXnoa2qZzelQubKNBXMpPPadJ0gLiqKGJFp4Q4iHjOJ97V8ck6O5lnVXY8GTje+x5Y+79dVWjSUbPTgpbAOvTfO0ldF0ADr2qXMN7RsT0KpgUmfNHqno8ndYskuN0ZgK/BgLB6DZ2jI0tEOppH+fQNcgE3ROhhtQhQ4J173fnK6BFkgc0qakx6F67Hzc9KYayZRuKgocjLVtZTYkBV4KdLjGk7GJwG9QBToyuophyYaNVFkuIGC2+EpsggWJkKJB6RB5NOexS0I2BoEBj8ZF+iR5zI0YI8Tuy8MZzcHx9t4qHk1ZBXx2jedTYrVCz+bVmGrTMBrogOSQfUyROuVJZgia9OWlRWMPoKMSWTIcDps5EBGwMpmrwUpQWOGRgqlGijdOL33YF2XxwolHtKguWlot8N2CghhwaLUL9BRcEMMPPPaC2B3D/NqtqH2x9v5avUKOZwU+1W6Sh1W03TvndRMWUL4luaaCnz8P6uQBcaTnpTpVMEGU1rClb4r1ph398Q2ZDKHREj02YDzhptqYHzGOwvieGmYezthIQ0ZxVaPNfCSTGf4UYIzLyd2Z/2RfA+J+RryigiH0hgznXZMXmcRVobIE4Tm5EOL2Xpl6jauCpSO2Y0D18lcMA0x6c1eMiK2IZOb6gKpmo5BY9DlLJPm0LigsDeOl9bnPP4Zyjq0ZC+/CPoz/Bi4245FBXI8RCCW/XLT7re0Ao1Z4qR6TX2xZVg5chOdvovPZdZIjic9qvGaZKU44n0xefMuZC05IZYhGyjlV03HTGtjXZSCoOA1EL4u7IR7BoT5rmEvTSRol8f7P8PNT4b1cfZYJjqH+wVNqvEkjExuAIzrf7K6net+S/QepAeBlSosuw9+gstSeIkJxKBy70QHYWWIqWWpWFqFrMBJIbq1grlEHaHcQnm7sCjkiARTo10Sa6dxSukmN1yPxqBP+fLMP7M1Ymi0/utPL0Tug8yhEFd4WTVOulU53GdwzOB5zvXfEJe3YXH49ieDQkEDw+QiFKu8wNq//lq26jZQIhXy3OK48X5BLOvTGrhgeHLDdLgLdy5GFyRGRhWTGCFZAjEobm+mk6vFCStD8LFXvmyrT1yyz9BNlVWJZq1ICcitdeW+BsVjl7UdJ5P0xgKvP1NRrLUhwxagqJCyx+na3x5/6zwvhganBFQYK/IOxeGNwmhxXjhcTNy0EQpWIWfm3z6x9+DIGznwGlswLYxfjBgoz67o/ViITl3tpkTgmdVxw6OKL2xvBNuE2Xq0sorbBHtqmsvFGn0Bsea/haDnq0ycD+aUZdWKg2vlwnZDvSO6Yl+DQDunyWWza9C42AKXcPaDdkOiCUxZsTJkhwl+g9OBYdm4JCINGMYSWrgk3pulcNs5fJvkU7BwfkZ4XrYLsxKTpvmaaxTcsTjqjaUQCE8MVNSvfImegV3SOvgS24l9zc31c7F2ZbclCC+z88pwKGGxX1MYfhHaHsMQ82XkoU/wt6Dbc/8ciZz+q/awSWEOMsYqRyYT/IaENjaWq/akTMrBuYVL2PAtfl3l6UWbWyeShoy2WCf7FXoaWymG/sGbxhabKKa9LZwUvVq//oq9XMQwUiYz4oTKCQiEzpoUwpCA2pTgl8MNM/AaTUU0EUlBxkQaMkygg1HBL4zY4+/quuvRs8IEfLgLOUSA3h+R20ilQybvxXP75bdS9tXTNGN1jNMOLNAlrQltwasCiVH0KFg2uptGymRHdtXLEL0cI0j8X9ieMyT4G5nJLahJM8ozf18iDRkhRO/2c7ipM2JokLByiJ6VCA/Xw13IcVaYSTmPjek2YlvDc2pyzq7IncvFc5vN2huLA+uoQ9ykY2pcqLKnLGSUxGlv4Sz6WNOk0qzJagx2CJ74CFOH11xuSbhjkFtkd1K/vbZr8KzDzWMyw2jI0BjpjIrweHZx5yXdbUuUKhvKcVYYe6OrzwnRfrIFyHkDxa/YAYC7PE3MgMnJF5boXPqkUgw+9UqlG5wb02mElSGFDyFrzOtF8/1hmc3LP8QYWWS078AAY7Ifq3qqUTqoFfv5eWlRd7tggoS+N5ALD23/zPt3Uax65Lo+bRFql83H8JEBufHv34obufK8EpFAitEjek8OxbfEIgVq216VFbgHYpzNlm369mRYqaigyc13WfIwfgRpLBVehpxO8bbwlDOVG8gJJ0X20MrzxNedwRZsisfB9ajppMh25/TIqiVOlRCh4WF4GQpeZ9v324Y7rUIEhHDlXCU0bgczC03jHpkifMQJtb++KDembsCKvWqK3vuXxJViRAkaX4WqJS5smQ+1kImERBkIU1jJRaL8zucb4IIL2yj8VYtRKcf9LpwVv5TgZ29b8c14Xv4hcg1vY+FJE0Zmt0dn5DcwnCrBgV+TuafnpfNRqn1eoNFfosFmv6qrury/plLei/+2wvARFfivlBdGbPRq3D5UdCVojOMNuQIT0iu3xBeQ2mvIJDYD+gxhJUkQvuvommbQTyi0lRXfiNc06X5KYprvhl7ZV5mEmFY6soHhqo9fjgr7v7zxew3neAlD0zq5Fww6xOGLkV4VQLjZ7xF5xODxlnHLOQLBxrc/58H7UoFhdwyHwghWpOTcsagvt0WfYK/YEqEHTBCxSG+JRLOpl1W8LibO1jInFlcMCLZtRTXlpTK8SiFTGcc0OTZrcewwMsTk6nDb1ZjwOGA71co2hpcar0wOARBG+FOnzytWi9KIwh740nhbkKhS7tLfSotomNCrKoszLjfnYCoy8d9W79akyqHlDtxSLcF3Ugku/AvbTbV6e4gkfYImXOR0pGfHq+b3gkMqox/VVhToqKqaa5vgHNyYhNSUV2Utjg0JQswrIvF8NDfFIPsEvxIcGEF3DNe7MWZ4ssBqqAhpjYZM6r6wnxHIh4SS2qjC/uiKxCpl73hnXRimOnpVT87NL4vYdcckGDUl/kNkb+Ubv6+K51LpMbY16YZ0IxxV/cTmuBbYwJlwzQ1TRycxCC+XWLTVmHornSX5h+gVGsLr1eSosu69HCKYpDuZx7JB5sq+uBZMbtEhjBkKdzF/F3c9yxNWuIGN/MBPjBiyYDORzmXOSU0UvOaGVfXc1uvgL11KDDGFkVoWVcgd0010iX9EGMO5AnR3OA82k8Uug6dn5+tvPX4wWZdZi6UhsyVYBNqKMHRFyPi6YV91q2kub2dSLZPekC65PRCBTiK8zCN3xOf1yZdV42CAw+GZX14XFXYRibB7cmoKETn2bid430plkY4g4n5YVXYIcD4o5gxtYCMiikND9q+ZD5aKtLvJUZxIYhiuMQghI83D6Gk9OTO/RinRjxsZJP5R/zV+VQHI5nibkvAG6yK3duPEKy+50ODiSxd8yeyOncB0gsQEeZ7FyONMYaW7fTEVYHhJVfmgCtACetZb8Lry9d9XhTGD6CknwuYEBiqQzaDtKZaDq6S9GhgtaZNUTkN/UVYt5Tgb0r+etq8RK4u4pdr45Vhh1G30e3jbIPE/8vi4XyXn6qRh988dcx5pUnBSBU9W7EojZpPnMeUV+3APsqOpvaYwAXFs3kFjJtMlGUIKc9KQFQoigQ+kCmng0OwTrh2oiO1CEcasMq74f/FCv80aYTyV0Z04Ux48Z2QCY1biga0uIid25+J562Q1oXqjwTrZeWSmEdhRRZvXha8/Xxdezpq2RzQtFD6Showk1BINNWafkNquoT0vVci+TMP8/EHivxb+bRTWEpIPQ0bJm5Bb0kzVmAJyoQsD1uvOyhyLLcFcMU25H6UqGeep9PsvVDLb9/JVA2UZfeFdYxuTU4Mm1rgo5AQ5Mi7+IDES1rIxm1w7mUAegf2ZBzMLb+s0ZqbE/8hxQKY7fiZEjpS28LY4ZDwTTcmuleB1eAT3kesy6hDAxYz7ChD5HL8Xxmt0MGAccN9KfU7XZpOXdFCCkhl1HijY97IJnsEYIliVRZBSeUnYnUta+YoRNF7kpgjLGmE+WVovzEX1u91HJplE2NfIu6xxev9BKmEhPh7riEqk5ixa4LyKE10Pzs2L+FpdJOCc3z2198C77pMkGMXyco1gRclmGgUyXIlKarA8f0yk10rmpAKAoIMik//4e1saLUZ+kkJr/LvbaarWz6EbJmUODL45ImBF70tUZv79/JjTliAsMJSJWjBbEKEqViRxhhnRTU8VzwvDWfB4PK89h/ILzG8J47JY4LRGKfmQcf4T4bSRlboeiwL4eOPqf8y5hbIKEe1qVfMkzTBDj8fzh8KhkjMZ6JkVCF2nhLzJGL83vB3bk5n3tmiw4YSK9snH9+2mhXo8nj80sXots2Ag11hXXUfBOE/+1ZJfeDyezHAwSCs7CDUbK9zmDTwez2tPrg1Z0JCtp9vr+tDS4/Hk25BFdRtQUjRe7/F4Xg/y7ZFFwEo5Ufd7PJ6pkm9DFqEqp91XrAXH4/FkQr4NGQNtB4GctEF5qg4Dj8fzxyDXhgzHZRPNZFXG4VquJsV6PJ6pkWtDhoaqw9miMFo3B7soBS1TjCzi7k7g8Xg8gv8AdewHw/bKbkYAAAAASUVORK5CYII=',
          width: 200,
          alignment: 'center',
          margin: [20, 0, 0, 10],
        },
        {
          text: this.translateService.instant(
            'model.qr-manager.qr-create.pdfContent',
            {
              floorName,
              buildingName,
            }
          ),
          style: 'content',
        },
        {
          qr: `${environment.domain}/#/feedback-public/${this.qrTemplateId}`,
          foreground: '#000000',
          background: '#ffffff',
          fit: 500,
          alignment: 'center',
          margin: [0, 0, 0, 0],
          mask: 1,
          ecLevel: 'H',
        },
        // {
        //   text: 'Nếu bạn có thắc mắc về dịch vụ, vui lòng liên hệ với chúng tôi qua số điện thoại: 0987654321',
        //   style: 'content',
        //   margin: [30, 30]
        // }
      ],
      styles: {
        name: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
        },
        content: {
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [30, 0, 30, 20],
        },
      },
    };
  }
}
