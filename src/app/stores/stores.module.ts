import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment as env } from '@env/environment';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

@NgModule({
  declarations: [],
  providers: [],
  imports: [
    CommonModule,
    // NgxsModule.forRoot([CustomerSate, RoleSate], { developmentMode: !env.production }),
    NgxsModule.forRoot([], { developmentMode: !env.production }),
    NgxsStoragePluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({ logger: console, collapsed: false, disabled: env.production }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: env.production }),
  ]
})
export class StoresModule { }
