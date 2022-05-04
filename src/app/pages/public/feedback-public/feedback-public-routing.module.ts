import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FeedbackPublicComponent} from './feedback-public/feedback-public.component';

const routes: Routes = [

  {
    path: ':id',
    component: FeedbackPublicComponent
  },
  // },
  // {
//   // path: '',
//   path: ':id',
//   pathMatch: 'full',
//   component: FeedbackPublicComponent
// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackPublicRoutingModule {
}
