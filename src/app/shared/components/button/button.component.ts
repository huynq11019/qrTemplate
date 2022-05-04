import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mb-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() text = '';
  @Input() icon = '';
  @Input() iconResource = '';
  @Input() iconImageSuffix = 'png';
  @Input() disabled = false;
  @Input() tooltip = '';
  @Input() iconColor = 'text-black';
  @Input() type: 'primary' | 'default' | 'dashed' = 'primary';
  @Input() themeType: 'fill' | 'outline' | 'twotone' = 'outline';

  constructor() {}

  ngOnInit(): void {}

  getSource(): string {
    return `assets/images/button/${this.iconResource}.${this.iconImageSuffix}`;
  }
}
