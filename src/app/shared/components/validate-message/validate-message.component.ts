import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { VALIDATOR_MESSAGE } from '@shared/constants/validators.constant';
import {
  IErrorMessageType,
  IValidateMessage,
} from '@shared/interface/validate-message';
/**
 * @howToUse
 *
 * <mb-validate-message
 *    [errorMessages]="<valids : IValidateMessage[] >" : Khi truyển list Validate message form Control
 *    [errorMessage]= "<valid: IValidateMessage>" : khi truyền validate message cụ thể
 *    [fieldName]="<field Name of form >" [form]="<form>"
 *    >
 *    </mb-validate-message>
 *
 */
@Component({
  selector: 'mb-validate-message',
  templateUrl: './validate-message.component.html',
  styleUrls: ['./validate-message.component.scss'],
})
export class ValidateMessageComponent implements OnInit {
  @Input() fieldName = '';
  @Input() form?: FormGroup;
  @Input() errorMessage?: IValidateMessage;
  @Input() errorMessages?: IValidateMessage[];
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    if (!this.errorMessage) {
      this.errorMessage = this.errorMessages?.find(
        (item) => item.field === this.fieldName
      );
    }
  }

  getMessageError(errType: string, validParam?: string | number): string {
    return this.translate.instant(
      VALIDATOR_MESSAGE.find((err) => err.key === errType)?.label || '-',
      { param: validParam }
    );
  }

  getMessageErrorByField(errType: IErrorMessageType): string {
    if (errType.message) {
      return this.translate.instant(errType.message, { param: errType.param });
    }
    return this.translate.instant(
      VALIDATOR_MESSAGE.find((err) => err.key === errType.type)?.label || '-',
      { param: errType?.param }
    );
  }
}
