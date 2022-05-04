import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mb-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent implements OnInit {
  @Input() text = '';
  @Input() hover = false;
  @Input() color = 'badge-info';

  constructor() {}

  ngOnInit(): void {}
}
