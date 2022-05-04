import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { STATUS } from '@shared/constants/status.constants';
import { TICKET_SERVICE } from '@shared/constants/ticket.constant';
import { Ticket } from '@shared/models/ticket.model';
import { ToastService } from '@shared/services/helpers/toast.service';
import { TicketService } from '@shared/services/ticket.service';
import CommonUtil from '@shared/utils/common-utils';
import { differenceInCalendarDays } from 'date-fns';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-handle-ticket',
  templateUrl: './handle-ticket.component.html',
  styleUrls: ['./handle-ticket.component.scss'],
})
export class HandleTicketComponent implements OnInit {
  @Input() isReceive = false;
  @Input() ticket: Ticket = new Ticket();
  form: FormGroup = new FormGroup({});
  TICKET_SERVICES = TICKET_SERVICE;
  @ViewChild('datePicker') datePicker!: NzDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modalRef: NzModalRef,
    private toast: ToastService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      expectedFinishAt: [
        new Date(),
        !this.isReceive ? [Validators.required] : '',
      ],
      serviceType: [null, this.isReceive ? [Validators.required] : ''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      CommonUtil.markFormGroupTouched(this.form);
      return;
    }

    if (!this.isReceive) {
      const expectedFinishAt = new Date(
        this.form?.get('expectedFinishAt')?.value
      ).getTime();

      const request = {
        expectedFinishAt: CommonUtil.getEndOfDay(expectedFinishAt),
      };
      this.ticketService
        .handleTicket(this.ticket.id, request)
        .subscribe((response) => {
          if (response.status === STATUS.SUCCESS_200) {
            this.toast.success('model.ticket.success.handle');
            this.modalRef.close({
              success: true,
            });
          }
        });
    } else {
      const serviceType = this.form.get('serviceType')?.value;

      const request = {
        serviceType,
      };
      this.ticketService
        .receiveTicket(this.ticket.id, request)
        .subscribe((response) => {
          if (response.status === STATUS.SUCCESS_200) {
            this.toast.success('model.ticket.success.receive');
            this.modalRef.close({
              success: true,
            });
          }
        });
    }
  }

  onCancel(): void {
    this.modalRef.close({
      success: false,
      value: null,
    });
  }

  disabledBeforeToday(current: Date): boolean {
    // Can not select days before today
    // tslint:disable-next-line:new-parens
    return differenceInCalendarDays(current, new Date()) < 0;
  }

  enterDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.controls.expectedFinishAt.setValue(
        this.form.controls.expectedFinishAt.value
      );
      this.datePicker.close();
    } else if (!this.disabledBeforeToday(CommonUtil.newDate(date))) {
      this.form.controls.expectedFinishAt.setValue(CommonUtil.newDate(date));
      this.datePicker.close();
    } else {
      this.form.controls.expectedFinishAt.setValue(
        this.form.controls.expectedFinishAt.value
      );
      this.datePicker.close();
    }
  }
}
