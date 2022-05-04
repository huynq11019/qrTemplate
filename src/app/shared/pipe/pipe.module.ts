import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BytesPipe } from './bytes.pipe';
import { CurrencyVndPipe } from './currency.pipe';
import { GenderPipe } from './gender.pipe';
import { JoinPipe } from './join.pipe';


@NgModule({
  imports: [CommonModule],
  declarations: [CurrencyVndPipe, JoinPipe, BytesPipe, GenderPipe],
  exports: [CommonModule, CurrencyVndPipe, JoinPipe, BytesPipe, GenderPipe],
})
export class PipeModule {}
