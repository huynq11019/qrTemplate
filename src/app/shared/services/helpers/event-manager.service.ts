import { Injectable } from '@angular/core';
import { EventWithContent } from '@shared/models/event-with-content.model';
import { Observable, Observer, Subscription } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';

/**
 * @howToUse
 *
 this.eventManagerService.broadcast({
    name: 'parentValue',
    content: value
 });

 this.eventManagerService.subscribe('parentValue', (res: any) => {
    const data = res.content;
 });
 *
 */
@Injectable({
  providedIn: 'root',
})
export class EventManagerService {
  observable: Observable<EventWithContent<any> | string>;
  observer: Observer<EventWithContent<any> | string> | undefined;

  constructor() {
    this.observable = Observable.create(
      (observer: Observer<EventWithContent<any> | string>) => {
        this.observer = observer;
      }
    ).pipe(share());
  }

  /**
   * Method to broadcast the event to observer
   */
  broadcast(event: EventWithContent<any> | string): void {
    if (this.observer) {
      this.observer.next(event);
    }
  }

  /**
   * Method to subscribe to an event with callback
   */
  subscribe(eventName: string, callback: any): Subscription {
    return this.observable
      .pipe(
        filter((event: EventWithContent<any> | string) => {
          if (typeof event === 'string') {
            return event === eventName;
          }
          return event.name === eventName;
        }),
        map((event: EventWithContent<any> | any) => {
          if (typeof event !== 'string') {
            // when releasing generator-jhipster v7 then current return will be changed to
            // (to avoid redundant code response.content in JhiEventManager.subscribe callbacks):
            // return event.content;
            return event;
          }
        })
      )
      .subscribe(callback);
  }

  /**
   * Method to unsubscribe the subscription
   */
  destroy(subscriber: Subscription): void {
    subscriber.unsubscribe();
  }
}
