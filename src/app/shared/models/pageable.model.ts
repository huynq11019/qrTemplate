import {IPageable} from '../interface/pageable.interface';

export class Pageable implements IPageable {
  constructor(
    public pageIndex?: number,
    public pageSize?: number,
    public total?: number,
    public hasPageable?: boolean,
  ) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = total;
    this.hasPageable = hasPageable;
  }
}
