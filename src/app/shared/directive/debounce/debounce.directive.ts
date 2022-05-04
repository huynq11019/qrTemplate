import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { fromEvent, Subject, timer } from 'rxjs';
import { debounce, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appDebounce]',
})
export class DebounceDirective implements OnInit, OnDestroy {
  private destroy = new Subject<void>();

  @Input() delayTime = 350;
  @Output() keyupDelay = new EventEmitter<Event>();

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  ngOnInit(): void {
    fromEvent(this.elementRef.nativeElement, 'keyup')
      .pipe(
        debounce(() => timer(this.delayTime)),
        distinctUntilChanged(
          (previous: any, current: any) => true,
          (event: Event) => (event.target as HTMLInputElement).value
        ),
        takeUntil(this.destroy)
      )
      .subscribe((e) => this.keyupDelay.emit(e));
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
