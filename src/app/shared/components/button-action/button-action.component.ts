import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mb-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.scss'],
})
export class ButtonActionComponent implements OnInit {
  @Input() action = '';
  @Input() className = '';
  @Input() disable = false;
  @Input() isShow = true;
  @Input() isRoot = false;
  @Input() opacity = 1;
  @Input() cursor = '';

  constructor() {}

  ngOnInit(): void {}

  getSource(): string {
    return `assets/images/button/${this.action}.png`;
  }
}
