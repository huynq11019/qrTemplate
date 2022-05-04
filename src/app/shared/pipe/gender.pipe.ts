import { Pipe, PipeTransform } from '@angular/core';
import { GENDER_MAP } from '@shared/constants/common.constant';

/**
 * Fill label gender
 *
 * @author hieu.daominh
 * @date 2021-12-24
 * @export
 * @class GenderPipe
 * @implements {PipeTransform}
 * @howToUse
 * ```
 *     <some-element>{{ user?.gender | gender }}</some-element>
 * ```
 */
@Pipe({ name: 'gender' })
export class GenderPipe implements PipeTransform {
  GENDER_MAP = GENDER_MAP as any;

  transform(input: any): string {
    return input in this.GENDER_MAP ? this.GENDER_MAP[input] : '';
  }
}
