import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FeedbackPublicComponent} from './feedback-public/feedback-public.component';
import {FeedbackPublicRoutingModule} from './feedback-public-routing.module';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [
    FeedbackPublicComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FeedbackPublicRoutingModule,
  ]
})
export class FeedbackPublicModule { }
