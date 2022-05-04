import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  public isLoading = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  /**
   * function show spinner
   *
   * @author hieu.daominh
   * @date 2021-07-27
   */
  show(): void {
    this.isLoading.next(true);
  }

  /**
   * function hide spinner
   *
   * @author hieu.daominh
   * @date 2021-07-27
   */
  hide(): void {
    this.isLoading.next(false);
  }
}
