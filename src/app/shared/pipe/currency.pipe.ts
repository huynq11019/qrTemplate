import { Pipe, PipeTransform } from '@angular/core';

/**
 * Display VND
 *
 * @author hieu.daominh
 * @date 2021-12-24
 * @export
 * @class CurrencyVndPipe
 * @implements {PipeTransform}
 * @howToUse
 * ```
 *     <some-element>{{ product?.price | vnd }}</some-element>
 * ```
 */
@Pipe({ name: 'vnd' })
export class CurrencyVndPipe implements PipeTransform {
  symbol = ' đ';

  transform(value: string): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + this.symbol;
  }
}
