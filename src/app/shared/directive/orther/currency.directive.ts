import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[appCurrencyFormatter]' })
export class CurrencyFormatterDirective {
  private el: any;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('keyup', ['$event.target.value'])
  onKeyUp(value: any): void {
    if (value?.toString().length === 0) {
      this.el.value = null;
    } else {
      this.el.value = this.transform(value);
    }
  }

  @HostListener('keypress', ['$event'])
  validateNumericKeyPress(event: any): void {
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
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  parse(value: string): string {
    return value.toString().replace(/\D/g, '');
  }
}
