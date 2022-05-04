import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QR_STATUS } from '@shared/constants/complaint.constant';
import { OWNER_TYPE } from '@shared/constants/file.constant';
import { STATUS } from '@shared/constants/status.constants';
import { SATISFIED } from '@shared/constants/ticket.constant';
import {
  LENGTH_VALIDATOR,
  VALIDATORS,
} from '@shared/constants/validators.constant';
import {
  ComplaintTemplate,
  IComplaintTemplate,
} from '@shared/models/complaint-template.model';
import { Complaint, IComplaint } from '@shared/models/complaint.model';
import { ComplaintService } from '@shared/services/complaint.service';
import { FileService } from '@shared/services/file.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { QrTemplateService } from '@shared/services/qr-template.service';
import CommonUtil from '@shared/utils/common-utils';

@Component({
  selector: 'app-feedback-public',
  templateUrl: './feedback-public.component.html',
  styleUrls: ['./feedback-public.component.scss'],
})
export class FeedbackPublicComponent implements OnInit {
  files: [] | any;
  filesUpload: any[] = [];
  imageUrls?: any[] = [];
  overSized = false;
  maxFileUpload = 5;
  form: FormGroup = new FormGroup({});
  isUpdate = false;
  complaint: Complaint = new Complaint();
  page = -1;
  complaintId = '';
  complaintTemplate: ComplaintTemplate = new ComplaintTemplate();
  complaintLocal = '';
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  SATISFIED = SATISFIED;
  opacity = 0;
  display = false;
  turnSaOn = false;
  turnUnsaOn = false;
  firstTime = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private translate: TranslateService,
    private fileService: FileService,
    private complaintService: ComplaintService,
    private toast: ToastService,
    private qrTemplateService: QrTemplateService
  ) {
    this.route.paramMap.subscribe((response) => {
      this.complaintId = response.get('id') || '';
    });
    this.complaintLocal = localStorage.getItem('feedback') || '';
    if (!!this.complaintLocal) {
      this.complaint = JSON.parse(this.complaintLocal);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.findId();
  }

  initForm(): void {
    this.form = this.fb.group({
      fullName: [
        this.complaint?.fullName,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.NAME_MAX_LENGTH.MAX),
          Validators.pattern(VALIDATORS.SPACE),
        ],
      ],
      phoneNumber: [
        this.complaint?.phoneNumber,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.PHONE_MAX_LENGTH.MAX),
          Validators.pattern(VALIDATORS.PHONE),
        ],
      ],
      content: [
        null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CONTENT_MAX_LENGTH.MAX),
          Validators.pattern(VALIDATORS.SPACE),
        ],
      ],
      complaintFileIds: [],
      // buildingId: '1322b84e-0394-4d0b-a232-36ba59413a64',
      // floorId: '59ac7f45-f367-48ad-8d84-f6d5aadf389a',
      complaintTemplateId: this.complaintId,
      satisfied: false,
      email: [null, [Validators.pattern(VALIDATORS.EMAIL)]],
    });
  }

  findId(): void {
    if (!!this.complaintId) {
      this.qrTemplateService
        .getComplaintTemplateIdPublic(this.complaintId, true)
        .subscribe((res: any) => {
          if (res.body?.code === STATUS.SUCCESS_200) {
            this.complaintTemplate = res.body?.data as IComplaintTemplate;
            if (QR_STATUS.INACTIVE.value === this.complaintTemplate?.status) {
              this.page = 3;
            }
          }
        });
    }
  }

  displayContent(content: string, buildingName?: string): string {
    return this.translate.instant(content, { buildingName });
  }

  onSubmit(): void {
    this.page = 2;
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const complaint: Complaint = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(complaint);
    const originFiles: any[] = [];
    const request: IComplaint = {
      ...body,
      complaintFileIds: [],
    };
    if (this.filesUpload?.length > 0) {
      this.filesUpload.forEach((file: any) => {
        originFiles.push(file?.originFileObj);
      });
      this.fileService
        .uploadListFilePublic(
          originFiles,
          complaint?.fullName,
          OWNER_TYPE.COMPLAINT
        )
        .subscribe((res) => {
          const ids = res.body?.data as any;
          request.complaintFileIds = ids.map((item: { id: string }) => item.id);
          this.save(CommonUtil.trim(request));
        });
    } else {
      this.save(CommonUtil.trim(body));
    }
  }

  save(body: IComplaint): void {
    // debugger;
    localStorage.setItem('feedback', JSON.stringify(body));
    this.complaintService.createComplaint(body, true).subscribe((res: any) => {
      if (res.status === 200) {
        this.toast.success('model.complaint.success.create');
        // this.router.navigate([`/home`]);
        this.page = 2;
      }
    });
  }

  getFiles(filesUpload: any): void {
    this.filesUpload = filesUpload;
    this.overSized = this.filesUpload.length > 5;
    const imgs: any[] = [];

    this.filesUpload.forEach((item) => {
      this.getBase64(item.originFileObj).then((data) => {
        imgs.push(data);
      });
    });
    this.imageUrls = imgs;
  }

  getFilesOrigin(files: any): void {
    this.files = files;
  }

  getBase64(image: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  changeSatisfied(satisfied?: string): void {
    // Sẽ không click được khi là lần đầu click và fullname, phone là null
    if (!this.isNullFullnameAndPhone() || !this.firstTime) {
      this.firstTime = false;
      this.display = true;
      if (satisfied === SATISFIED) {
        this.turnSaOn = true;
        this.turnUnsaOn = false;
        this.form.get('satisfied')?.setValue(true);
        this.opacity = 2;
      } else {
        this.turnUnsaOn = true;
        this.turnSaOn = false;
        this.form.get('satisfied')?.setValue(false);
        this.opacity = 1;
      }
    }
  }

  isNullFullnameAndPhone(): boolean {
    return (
      !!this.form.get('phoneNumber')?.hasError('required') ||
      !!this.form.get('fullName')?.hasError('required')
    );
  }

  toHome(): void {
    this.router.navigate(['/home']).then();
  }

  getTitleUpload(): string {
    return this.translate.instant('complaint-public.titleUpload');
  }
}
