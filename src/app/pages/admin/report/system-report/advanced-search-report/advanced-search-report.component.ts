import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TICKET_TYPE_LIST } from '@shared/constants/system-report.constant';
import { IBuilding } from '@shared/models/building.model';
import { BuildingService } from '@shared/services/building.service';
import CommonUtil from '@shared/utils/common-utils';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-advanced-search-report',
  templateUrl: './advanced-search-report.component.html',
  styleUrls: ['./advanced-search-report.component.scss'],
})
export class AdvancedSearchReportComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  createdAt = new Date();

  @ViewChild('startPicker') startPicker!: NzDatePickerComponent;

  @ViewChild('endPicker') endPicker!: NzDatePickerComponent;

  @Input() reportFilerRequest = {
    ticketType: '',
    buildingIds: [''],
  };
  TICKET_TYPES = TICKET_TYPE_LIST;
  buildings: Array<IBuilding> = new Array<IBuilding>();

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private buildingService: BuildingService
  ) {
    this.reportFilerRequest =
      this.modalRef?.getConfig()?.nzComponentParams?.reportFilerRequest || {};
    this.initForm();
  }

  ngOnInit(): void {
    this.loadDataBuilding();
  }

  initForm(): void {
    this.form = this.fb.group({
      ticketType: [this.reportFilerRequest?.ticketType || null],
      buildingIds: [this.reportFilerRequest.buildingIds || null],
    });
  }

  onSubmit(): void {
    const data = this.form.value;
    this.modalRef.close({
      data,
      success: !this.form.invalid,
    });
  }

  onCancel(): void {
    this.form.reset();
  }

  public limitText(text: string, limit = 10): string {
    return CommonUtil.getLimitLength(text, limit);
  }

  public loadDataBuilding(keyword?: string): void {
    this.buildingService
      .searchBuildingAutoComplete({ keyword, sortBy: 'code.asc' })
      .subscribe((res) => {
        this.buildings = res.body?.data as Array<IBuilding>;
      });
  }
}
