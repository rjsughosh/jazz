import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {APP_INITIALIZER} from '@angular/core';

import {MomentModule} from 'angular2-moment';
import {DatePickerModule} from './primary-components/daterange-picker/ng2-datepicker';
import {ChartsModule} from 'ng2-charts';

import {ToasterModule} from 'angular2-toaster';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';

import {RouterModule, Routes} from '@angular/router';
import {AuthenticationService, RouteGuard, DataCacheService, RequestService, MessageService} from './core/services';
import {SharedService} from './SharedService.service';
import {CronParserService} from './core/helpers';
import {DropdownModule} from 'ng2-dropdown';
import {PopoverModule} from 'ng2-popover';
import {AppComponent} from './app.component';
import {ConfigService, ConfigLoader} from './app.config';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {LandingComponent} from './pages/landing/landing.component';
import {TestApiComponent} from './pages/testapi/test-api.component';
// import {FooterComponent} from './secondary-components/footer/footer.component';
import {Error404Component} from './pages/error404/error404.component';
import {SharedModule} from './shared-module/shared.module';
import {routes} from './app.route';
import {EnvironmentModule} from './environment-module/environment.module';
import {ServiceModule} from './service-module/service.module';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    Error404Component,
    // FooterComponent,
    TestApiComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    DropdownModule,
    HttpModule,
    ToasterModule,
    NgIdleKeepaliveModule.forRoot(),
    SharedModule,
  ],
  providers: [
    AuthenticationService,
    CronParserService,
    SharedService,
    RouteGuard,
    DataCacheService,
    RequestService,
    MessageService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}

// platformBrowserDynamic().bootstrapModule(AppModule);
//redirectTo: is redirecting to landing page
