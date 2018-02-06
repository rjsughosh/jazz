import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServiceAccessControlComponent} from '../pages/service-access-control/service-access-control.component';
import {ServiceCostComponent} from '../pages/service-cost/service-cost.component';
import {ServiceMetricsComponent} from '../pages/service-metrics/service-metrics.component';
import {ServiceLogsComponent} from '../pages/service-logs/service-logs.component';
import {ServiceOverviewComponent} from '../pages/service-overview/service-overview.component';
import {CreateServiceComponent} from '../secondary-components/create-service/create-service.component';
import {ServicesComponent} from '../pages/services/services.component';
import {PopoverModule} from 'ng2-popover';
import {ChartsModule} from 'ng2-charts';
import {DropdownModule} from 'ng2-dropdown';
import {ToasterModule} from 'angular2-toaster';
import {DatePickerModule} from '../primary-components/daterange-picker/ng2-datepicker';
import {MomentModule} from 'angular2-moment';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {SharedModule} from '../shared-module/shared.module';
import {routes} from './service.route';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ServicesListComponent} from '../pages/services-list/services-list.component';
import {ServiceDetailComponent} from '../pages/service-detail/service-detail.component';
import {AmountComponent} from '../primary-components/amount/amount.component';
import {BarGraphComponent} from '../secondary-components/bar-graph/bar-graph.component';
import { EnvironmentModule } from 'app/environment-module/environment.module';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    DropdownModule,
    DatePickerModule,
    MomentModule,
    ToasterModule,
    PopoverModule,
    ChartsModule,
    IonRangeSliderModule,
    SharedModule,
    EnvironmentModule
  ],
  declarations: [
    ServiceAccessControlComponent,
    ServiceCostComponent,
    ServiceMetricsComponent,
    ServiceLogsComponent,
    ServiceOverviewComponent,
    CreateServiceComponent,
    ServiceDetailComponent,
    ServicesListComponent,
    ServicesComponent,
    AmountComponent,
    BarGraphComponent,
  ]
})
export class ServiceModule {
}
