import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

/**
 * @howToUse
 *
 *     <some-element type="text" numberFormatter [maxValue]="100">...</some-element>
 *
 */
@Directive({
  selector: '[appNumberFormatter]',
})
export class NumberFormatterDirective implements OnInit {
  private el: any;
  @Input() maxValue = 999999999999999;
  @Output() onMaxValue: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit(): void {}

  @HostListener('keyup', ['$event.target.value'])
  onKeyUp(value: any) {
    if (value.toString().length === 0) {
      this.el.value = null;
    } else if (+this.parse(value) > this.maxValue) {
      this.el.value = this.transform(this.maxValue.toString());
      this.pushEvent();
    } else {
      this.el.value = this.transform(value);
    }
  }

  @HostListener('keypress', ['$event'])
  validateNumericKeyPress(event: any) {
    const pattern = /[0-9]/;
    const inputChar = event.key;

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  transform(value: string): string {
    return Number(value.replace(/\D/g, ''))
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  parse(value: string): string {
    return value.toString().replace(/\D/g, '');
  }

  private pushEvent(): void {
    this.onMaxValue.emit({
      value: this.maxValue,
    });
  }
}
