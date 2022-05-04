import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: 'input[appNumbersOnly]',
})
export class NumbersOnlyDirective {
  @Input() maxValue = 99999999999;
  @Input() minValue = 0;
  @Input() isNegative = false;
  @Output() onMaxValue: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any): void {
    const initialValue = this.el.nativeElement.value;
    if (this.isNegative) {
      this.el.nativeElement.value = initialValue.replace(/(?!^-)[^0-9]/g, '');
    } else {
      this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    }
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
