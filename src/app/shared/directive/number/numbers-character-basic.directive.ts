import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appNumbersCharacterOnly]',
})
export class NumbersCharacterBasicDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(
      /[^A-Za-z0-9-\/\\\_]*/g,
      ''
    );
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
