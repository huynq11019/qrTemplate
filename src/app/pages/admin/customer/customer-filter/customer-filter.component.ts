import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {COMMON_STATUS} from '@shared/constants/status.constants';
import CommonUtil from '@shared/utils/common-utils';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.scss']
})
export class CustomerFilterComponent implements OnInit {

  form: FormGroup = new FormGroup({
    incorporationDate: new FormControl(null),
    status: new FormControl(null),
  });

  @Input() incorporationDate = null;
  @Input() status = null;

  statusList = COMMON_STATUS;
  @ViewChild('datePicker') datePicker!: NzDatePickerComponent;

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      date: [this.incorporationDate || null],
      status: [this.status || null],
    });
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

  enterDatePicker(event: any): void {
    const date = event?.target?.value;
    if (CommonUtil.newDate(date).toString() === 'Invalid Date') {
      this.form.get('incorporationDate')?.setValue(this.form.get('incorporationDate')?.value);
      this.datePicker.close();
    } else {
      this.form.get('incorporationDate')?.setValue(CommonUtil.newDate(date));
      this.datePicker.close();
    }
  }

}
