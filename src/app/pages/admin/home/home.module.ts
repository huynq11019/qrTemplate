import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    QRCodeModule,
    NzCarouselModule,
  ],
})
export class HomeModule {}
