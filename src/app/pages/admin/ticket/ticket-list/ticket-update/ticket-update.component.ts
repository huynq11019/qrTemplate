import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  FALLBACK,
  NO_IMAGE,
  OWNER_TYPE,
} from '@shared/constants/file.constant';
import { TICKET_SERVICE } from '@shared/constants/ticket.constant';
import { LENGTH_VALIDATOR } from '@shared/constants/validators.constant';
import { IBuilding } from '@shared/models/building.model';
import { IComplaint } from '@shared/models/complaint.model';
import { ICustomer } from '@shared/models/customer.model';
import { Floor } from '@shared/models/floor.model';
import { ITicketComplaintRequest } from '@shared/models/request/ticlet-complaint-request.model';
import { ITicket, Ticket } from '@shared/models/ticket.model';
import { User } from '@shared/models/user.model';
import { AccountService } from '@shared/services/account.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { BuildingService } from '@shared/services/building.service';
import { ComplaintService } from '@shared/services/complaint.service';
import { CustomerService } from '@shared/services/customer.service';
import { FileService } from '@shared/services/file.service';
import { ToastService } from '@shared/services/helpers/toast.service';
import { TicketService } from '@shared/services/ticket.service';
import CommonUtil from '@shared/utils/common-utils';

@Component({
  selector: 'app-ticket-update',
  templateUrl: './ticket-update.component.html',
  styleUrls: ['./ticket-update.component.scss'],
})
export class TicketUpdateComponent implements OnInit {
  isUpdate = false as boolean;
  ticket: Ticket = new Ticket();
  form: FormGroup = new FormGroup({});
  buildingTicketServices = TICKET_SERVICE;
  files: [] | any;
  filesUpload: any[] = [];
  complaintFiles: any[] = [];
  buildings: IBuilding[] = [];
  building: IBuilding = {};
  customers: ICustomer[] = [];
  user: User | null = {};
  listUser: User[] = [];
  customerUsers: User[] = [];
  isInput = true;
  complaintId = '';
  maxFileUpload = 5;
  imageUrls?: any[] = [];
  oversized = false;
  floors: Floor[] = [];
  LENGTH_VALIDATOR = LENGTH_VALIDATOR;
  complaint: IComplaint = {};
  isComplaint = false;
  ticketComplaintRequest: ITicketComplaintRequest = {};
  fallback = FALLBACK;
  noImage = NO_IMAGE;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private ticketService: TicketService,
    private toast: ToastService,
    private accountService: AccountService,
    private buildingService: BuildingService,
    private authService: AuthService,
    private customerService: CustomerService,
    private complaintService: ComplaintService,
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileService
  ) {
    this.getCurrentUser();
    this.initForm();
    this.complaintId = this.route.snapshot.params.id;
    // if (this.complaintId) {
    //   this.isComplaint = true;
    //   this.getComplaint(this.complaintId);
    // }
  }

  ngOnInit(): void {
    // this.form.get('issuedUserId')?.setValue(this.listUser[0].id);
    this.getBuildings();
    if (this.complaintId) {
      this.isComplaint = true;
      this.getComplaint(this.complaintId);
    } else {
      this.form.get('issuedUserId')?.setValue(this.listUser[0].id);
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      buildingId: [
        this.isComplaint
          ? this.complaint.buildingId
          : this.buildings?.length === 1
          ? this.buildings[0]?.id
          : null,
        [Validators.required],
      ],
      floorId: [
        this.isComplaint ? this.complaint.floorId : null,
        [Validators.required],
      ],
      organizationId: [null],
      complaintId: [this.isComplaint ? this.complaint.id : null],
      serviceType: [null, [Validators.required]],
      content: [
        this.isComplaint ? this.complaint.content : null,
        [
          Validators.required,
          Validators.maxLength(LENGTH_VALIDATOR.CONTENT_MAX_LENGTH.MAX),
        ],
      ],
      issuedUserId: [null, this.isComplaint ? '' : [Validators.required]],
      note: [
        null,
        [Validators.maxLength(LENGTH_VALIDATOR.NOTE_MAX_LENGTH.MAX)],
      ],
    });
  }

  getCurrentUser(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      const users: User[] = [];
      users.push(this.user);
      this.listUser = [...users];
      this.form.get('issuedUserId')?.setValue(this.listUser[0].id);
    }
  }

  getComplaint(complaintId: string): void {
    this.complaintService.findById(complaintId).subscribe((res: any) => {
      this.complaint = res.body?.data;
      this.complaintFiles = this.complaint.complaintFiles || [];
      if (this.complaint) {
        this.getFloorFromBuilding(res?.body?.data?.buildingId);
      }
      this.initForm();
    });
  }

  addTokenToFile(filePath?: string, fileId?: string): string {
    if (!!filePath) {
      return filePath + '?token=' + this.authService.getToken();
    } else if (!!fileId) {
      return this.fileService.viewFileResource(fileId);
    }
    return '-';
  }

  getBuildings(): void {
    this.accountService.getBuildings().subscribe((res: any) => {
      this.buildings = res.body?.data;
      if (this.buildings.length === 1 && !this.isComplaint) {
        this.form.get('buildingId')?.setValue(this.buildings[0].id);
        // tslint:disable-next-line:no-non-null-assertion
        this.getInitData(this.buildings[0].id!);
      }
    });
  }

  // Get floor and organization after choose building
  getInitData(id: string): void {
    this.form.get('floorId')?.setValue(null);
    this.getFloorFromBuilding(id);
  }

  getFloorFromBuilding(id: string): void {
    this.buildingService
      .simpleSearchFloor(id, { sortBy: 'floorNumber' })
      .subscribe((res: any) => {
        this.floors = res.body?.data;
      });
  }

  getOrganizationFromFloors(id: string): void {
    if (this.form.get('organizationId')?.value) {
      this.form.get('organizationId')?.setValue(null);
    }
    const ids: string[] = [];
    ids.push(id);
    const request = {
      ids,
    };
    this.customerService.findFloors(request).subscribe((res: any) => {
      this.customers = res.body?.data;
    });
  }

  getCustomersFromOrganiation(id: string): void {
    // if choose Organization, id is valuable else id is unvaluable
    if (id) {
      this.isInput = false;
      this.form.get('issuedUserId')?.setValue(null);
      this.customerService
        .autoCompleteUserFromOrganization(id)
        .subscribe((res: any) => {
          this.customerUsers = res.body?.data;
          this.listUser = [...this.customerUsers];
        });
    } else {
      this.isInput = true;
      if (this.user) {
        const users: User[] = [];
        users.push(this.user);
        this.listUser = [...users];
        this.form.get('issuedUserId')?.setValue(this.listUser[0].id);
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    const ticket: Ticket = {
      ...this.form.value,
    };
    const body = CommonUtil.trim(ticket);
    const originFiles: any[] = [];
    const request = {
      ...body,
      illustrationsFiles: [],
    };

    if (this.filesUpload?.length > 0) {
      this.filesUpload.forEach((file: any) => {
        originFiles.push(file?.originFileObj);
      });

      this.fileService
        .uploadListFile(originFiles, '', OWNER_TYPE.TICKET)
        .subscribe((res) => {
          const ids = res.body?.data as any;
          request.illustrationsFiles = ids.map(
            (item: { id: string }) => item.id
          );
          this.save(CommonUtil.trim(request));
        });
    } else {
      this.save(CommonUtil.trim(body));
    }
  }

  save(body: ITicket): void {
    this.ticketService.create(body, true).subscribe((res) => {
      if (res.status) {
        this.toast.success('model.ticket.success.create');
        this.router.navigate([`/ticket`]);
      }
    });
  }

  onSubmitFromComplaint(): void {
    this.setTicketComplaintRequest();
    this.ticketService
      .createByComplaint(this.ticketComplaintRequest, true)
      .subscribe((res) => {
        if (res.status) {
          this.toast.success('model.ticket.success.create');
          this.router.navigate([`/ticket`]);
        }
      });
  }

  setTicketComplaintRequest(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }
    if (this.form.get('floorId')?.value) {
      this.ticketComplaintRequest.floorId = this.form.get('floorId')?.value;
    }
    if (this.form.get('serviceType')?.value) {
      this.ticketComplaintRequest.serviceType =
        this.form.get('serviceType')?.value;
    }
    if (this.form.get('content')?.value) {
      this.ticketComplaintRequest.content = this.form.get('content')?.value;
    }
    if (this.form.get('note')?.value) {
      this.ticketComplaintRequest.note = this.form.get('note')?.value;
    }
    if (this.form.get('complaintId')?.value) {
      this.ticketComplaintRequest.complaintId =
        this.form.get('complaintId')?.value;
    }
  }

  onCancel(): void {
    if (this.isComplaint) {
      this.router.navigate([`/complaint/list`]);
    } else {
      this.router.navigate([`/ticket`]);
    }
  }

  getFiles(filesUpload: any): void {
    this.filesUpload = filesUpload;
    // Kiểm tra số lượng ảnh upload
    this.oversized = this.filesUpload.length > 5;
    const imgs: any[] = [];

    this.filesUpload.forEach((item) => {
      this.getBase64(item.originFileObj).then((data: any) => {
        imgs.push(data);
      });
    });
    this.imageUrls = imgs;
  }

  getFilesOrigin(files: any): void {
    this.files = files;
  }

  getReceivedStatus(): void {
    const receivedStatus = 'model.ticket.receivedStatus';
    return this.translate.instant(receivedStatus);
  }

  getBase64(image: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
