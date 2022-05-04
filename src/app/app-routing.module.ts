import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from '@core/layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from '@core/layout/app-layout/main-layout/main-layout.component';
import { Page403Component } from '@pages/auth/page403/page403.component';
import { Page404Component } from '@pages/auth/page404/page404.component';
import { ROUTER_UTILS } from '@shared/utils/router.utils';

const routes: Routes = [
  {
    path: ROUTER_UTILS.base.home,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/' + ROUTER_UTILS.base.dashboard,
        pathMatch: 'full',
        data: { pageTitle: 'common.title' },
      },
      {
        path: ROUTER_UTILS.base.dashboard,
        loadChildren: () =>
          import('@pages/admin/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: ROUTER_UTILS.ticket.root,
        loadChildren: () =>
          import('@pages/admin/ticket/ticket.module').then(
            (m) => m.TicketModule
          ),
      },
      {
        path: ROUTER_UTILS.complaint.root,
        loadChildren: () =>
          import('@pages/admin/complaint/complaint.module').then(
            (m) => m.ComplaintModule
          ),
      },
      {
        path: ROUTER_UTILS.survey.root,
        loadChildren: () =>
          import('@pages/admin/survey/survey.module').then(
            (m) => m.SurveyModule
          ),
      },
      {
        path: ROUTER_UTILS.building.root,
        loadChildren: () =>
          import('@pages/admin/building/building.module').then(
            (m) => m.BuildingModule
          ),
      },
      {
        path: ROUTER_UTILS.partnerContract.root,
        loadChildren: () =>
          import('@pages/admin/partner-contract/partner-contract.module').then(
            (m) => m.PartnerContractModule
          ),
      },
      {
        path: ROUTER_UTILS.customer.root,
        loadChildren: () =>
          import('@pages/admin/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
      },
      {
        path: ROUTER_UTILS.notification.root,
        loadChildren: () =>
          import('@pages/admin/notification/notification.module').then(
            (m) => m.NotificationModule
          ),
      },
      {
        path: ROUTER_UTILS.setting.root,
        loadChildren: () =>
          import('@pages/admin/setting/setting.module').then(
            (m) => m.SettingModule
          ),
      },
      // {
      //   path: 'survey',
      //   loadChildren: () =>
      //     import('@pages/admin/survey/survey.module').then((m) => m.SurveyModule),
      // },
      {
        path: ROUTER_UTILS.report.root,
        loadChildren: () =>
          import('@pages/admin/report/report.module').then(
            (m) => m.ReportModule
          ),
      },
      {
        path: ROUTER_UTILS.error.permissionDenied,
        component: Page403Component,
      },
    ],
  },
  {
    path: ROUTER_UTILS.home.root,
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@pages/admin/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: ROUTER_UTILS.authentication.root,
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: ROUTER_UTILS.privacyPolicy.root,
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@pages/public/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyModule
      ),
  },
  {
    path: ROUTER_UTILS.feedback.public,
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('@pages/public/feedback-public/feedback-public.module').then(
        (m) => m.FeedbackPublicModule
      ),
  },
  { path: ROUTER_UTILS.error.permissionDenied, component: Page403Component },
  { path: ROUTER_UTILS.error.notFound, component: Page404Component },
  { path: ROUTER_UTILS.base.freeRoute, component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
