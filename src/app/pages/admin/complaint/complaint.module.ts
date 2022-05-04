import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {QRCodeModule} from 'angularx-qrcode';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {NgxEchartsModule} from 'ngx-echarts';
import {ComplaintDetailComponent} from './complaint-list/complaint-detail/complaint-detail.component';
import {ComplaintFilterComponent} from './complaint-list/complaint-filter/complaint-filter.component';
import {ComplaintListComponent} from './complaint-list/complaint-list.component';
import {HandleComplaintComponent} from './complaint-list/handle-complaint/handle-complaint.component';
import {MarkSpamsComponent} from './complaint-list/mark-spams/mark-spams.component';
import {ServiceFeedbackComponent} from './complaint-list/service-feedback/service-feedback.component';
import {ComplaintReportFilterComponent} from './complaint-report/complaint-report-filter/complaint-report-filter.component';
import {ComplaintReportComponent} from './complaint-report/complaint-report.component';
import {ComplaintRoutingModule} from './complaint-routing.module';
import {ComplaintTemplateFilterComponent} from './qr-manager/complaint-template-filter/complaint-template-filter.component';
import {QrManagerComponent} from './qr-manager/qr-manager.component';
import {QrUpdateComponent} from './qr-manager/qr-update/qr-update.component';
import {HandleConfirmComponent} from './qr-manager/handle-confirm/handle-confirm.component';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import { ComplaintCloseComponent } from './complaint-list/complaint-close/complaint-close.component';


@NgModule({
  declarations: [
    QrManagerComponent,
    QrUpdateComponent,
    ComplaintListComponent,
    ComplaintReportComponent,
    ComplaintDetailComponent,
    ComplaintTemplateFilterComponent,
    HandleComplaintComponent,
    ServiceFeedbackComponent,
    ComplaintReportFilterComponent,
    MarkSpamsComponent,
    ComplaintFilterComponent,
    HandleConfirmComponent,
    ComplaintCloseComponent,
  ],
    imports: [
        CommonModule,
        ComplaintRoutingModule,
        SharedModule,
        QRCodeModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
        }),
        NzSkeletonModule,
        NzTypographyModule,
    ]
})
export class ComplaintModule { }
