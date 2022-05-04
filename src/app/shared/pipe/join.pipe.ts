/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Append character
 *
 * @author hieu.daominh
 * @date 2021-12-24
 * @export
 * @class JoinPipe
 * @implements {PipeTransform}
 * @howToUse
 * ```
 *     <some-element>{{ user?.positionNames | join: ', ' }}</some-element>
 * ```
 */
@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(input: any, character = ''): string {
    if (!Array.isArray(input)) {
      return input;
    }

    return input.join(character);
  }
}
