import { Pipe, PipeTransform } from '@angular/core';

/**
 * Display size file
 *
 * @author hieu.daominh
 * @date 2021-12-24
 * @export
 * @class BytesPipe
 * @implements {PipeTransform}
 * @howToUse
 * ```
 *     <some-element>{{ file?.size | bytes }}</some-element>
 * ```
 */
@Pipe({
  name: 'bytes',
})
export class BytesPipe implements PipeTransform {
  transform(bytes: number, decimals = 2): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
