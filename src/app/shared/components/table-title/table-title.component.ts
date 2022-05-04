import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SURVEY_RESULT_URL } from '@shared/constants/component-url.constant';

@Component({
  selector: 'mb-table-title',
  templateUrl: './table-title.component.html',
  styleUrls: ['./table-title.component.scss'],
})
export class TableTitleComponent implements OnInit {
  @Input() title = '';
  @Input() showBack = false;
  @Input() url = '';
  @Input() navigationExtras = {};
  // TH riêng của survey result
  @Input() beginStage = false;
  @Input() tabIndexSurvey = 0;
  SURVEY_RESULT_URL = SURVEY_RESULT_URL;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onBack(): void {
    if (this.url !== '' && this.navigationExtras) {
      // TH riêng của survey result
      // Back lại trang cũ khi đang ở trang CompanyDetail (mở từ trang StageDetail)
      if (
        this.url === this.SURVEY_RESULT_URL &&
        this.beginStage &&
        this.tabIndexSurvey !== 0
      ) {
        window.history.back();
      } else {
        this.router.navigate([`${this.url}`], this.navigationExtras);
      }
    } else {
      window.history.back();
    }
  }
}
