import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IActionLog } from '@shared/models/action-log.model';
import { ActionLogService } from '@shared/services/action-log.service';

@Component({
  selector: 'app-action-log-detail',
  templateUrl: './action-log-detail.component.html',
  styleUrls: ['./action-log-detail.component.scss'],
})
export class ActionLogDetailComponent implements OnInit {
  actionLogId = '';
  navigationExtras: NavigationExtras = {};
  actionLog: IActionLog = {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private actionLogService: ActionLogService
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      const actionLogId = params.get('id');
      this.actionLogId = actionLogId ? actionLogId : '';
    });
  }

  ngOnInit(): void {
    this.getDetailActionLog(this.actionLogId);
  }

  onCancel(): void {
    this.router.navigate([`/setting/action-log`], this.navigationExtras);
  }

  getDetailActionLog(id: string): void {
    this.actionLogService.findById(id).subscribe((response) => {
      this.actionLog = response?.body?.data as IActionLog;
    });
  }
}
