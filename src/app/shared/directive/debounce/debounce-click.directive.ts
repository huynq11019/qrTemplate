import { Directive, HostListener } from '@angular/core';
import { AbstractDebounceDirective } from './abstract-debounce.directive';

@Directive({
  selector: '[appDebounceClick]',
})
export class DebounceClickDirective extends AbstractDebounceDirective {
  constructor() {
    super();
  }

  @HostListener('click', ['$event'])
  public onKeyUp(event: any): void {
    event.preventDefault();
    this.emitEvent$.next(event);
  }
}
