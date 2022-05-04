import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PAGINATION } from '../../constants/pagination.constants';

@Component({
  selector: 'mb-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, AfterViewChecked {

  index = 1;
  firstIndex = 0;
  lastIndex = 0;
  pageSizeOptions = PAGINATION.OPTIONS;

  @Input() total = 0;
  @Input() pageIndex = PAGINATION.PAGE_DEFAULT;
  @Input() pageSize = PAGINATION.SIZE_DEFAULT;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {

  }

  getIndex(): void {
    const lastIndex = (this.pageIndex * this.pageSize);
    this.firstIndex = (this.pageIndex - 1) * this.pageSize + 1;
    this.lastIndex = lastIndex >= this.total ? this.total : lastIndex;
  }

  onChangePageSize(pageSize: number): void {
    if (this.pageSize !== pageSize) {
      this.pageIndex = PAGINATION.PAGE_DEFAULT;
      this.pageSize = pageSize;
      this.pushEvent();
    }
  }

  next(): void {
    if (this.lastIndex === this.total) {
      return;
    }
    this.pageIndex = ++this.pageIndex;
    this.pushEvent();
  }

  previous(): void {
    if (this.firstIndex === this.index) {
      return;
    }
    this.pageIndex = --this.pageIndex;
    this.pushEvent();
  }

  private pushEvent(): void {
    this.onChange.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }

  ngAfterViewChecked(): void {
    this.getIndex();
  }

}
