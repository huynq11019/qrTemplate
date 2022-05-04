import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mb-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() title = '';
  @Input() content = '';
  @Input() interpolateParams: object = {};
  @Input() okText = 'action.confirm';
  @Input() cancelText = 'action.cancel';
  @Input() width: string | number = '25%';
  @Input() isVisible = false;
  @Input() centered = true;

  @Input() showTitle = true;
  @Input() showClose = true;
  @Input() showBtnCancel = true;
  @Input() btnCentered = false;
  @Input() closable = true;
  // tslint:disable-next-line:ban-types
  @Input() callBack?: Function;
  @Output() emitter: EventEmitter<any> = new EventEmitter();

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {}

  showContent(): string {
    return this.translateService.instant(this.content, this.interpolateParams);
  }

  handle(): void {
    if (this.callBack) {
      this.callBack();
    }
    this.emitter.emit({
      success: true,
    });
  }

  cancel(): void {
    this.emitter.emit({
      success: false,
    });
  }
}
