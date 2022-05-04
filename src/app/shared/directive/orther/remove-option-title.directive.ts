import { AfterViewChecked, Directive, ElementRef } from '@angular/core';
import { AbstractDebounceDirective } from '@shared/directive/debounce/abstract-debounce.directive';

@Directive({
  selector: '[appRemoveOptionTitle]',
})
export class RemoveOptionTitleDirective
  extends AbstractDebounceDirective
  implements AfterViewChecked
{
  private el: any;

  constructor(private elementRef: ElementRef) {
    super();
    this.el = this.elementRef.nativeElement;
  }

  ngAfterViewChecked(): void {
    const options = document.getElementsByTagName('nz-option-item');
    for (let idx = 0; idx < options.length; idx++) {
      options?.item(idx)?.removeAttribute('title');
    }
  }
}
