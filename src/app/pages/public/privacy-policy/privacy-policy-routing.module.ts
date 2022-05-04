import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PrivacyPolicyComponent} from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PrivacyPolicyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule {
}
