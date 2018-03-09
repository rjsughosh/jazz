import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServiceAccessControlComponent} from '../pages/service-access-control/service-access-control.component';
import {ServiceCostComponent} from '../pages/service-cost/service-cost.component';
import {ServiceMetricsComponent} from '../pages/service-metrics/service-metrics.component';
import {ServiceLogsComponent} from '../pages/service-logs/service-logs.component';
import {ServiceOverviewComponent} from '../pages/service-overview/service-overview.component';//*
import {PopoverModule} from 'ng2-popover';
import {ChartsModule} from 'ng2-charts';
import {DropdownModule} from 'ng2-dropdown';
import {DatePickerModule} from '../primary-components/daterange-picker/ng2-datepicker';
import {MomentModule} from 'angular2-moment';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {SharedModule} from '../shared-module/shared.module';
import {routes} from './service.route';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ServicesListComponent} from '../pages/services-list/services-list.component';
import {AmountComponent} from '../primary-components/amount/amount.component';
import {BarGraphComponent} from '../secondary-components/bar-graph/bar-graph.component';
import { EnvironmentModule } from '../environment-module/environment.module';
import {environment} from '../../environments/environment';
import * as CommonServiceModules from './service.module.declarations.common';
import * as OssComponents from './service.module.declarations.oss';
import * as InternalComponents from './service.module.declarations.internal';
import { Symbol } from 'rxjs';

let specificComponents:any
alert(environment.envName);
if(environment.envName == 'oss'){
  specificComponents = OssComponents;
}else if(environment.envName == "jazz")  {
  specificComponents = InternalComponents;
}
let declarationsArray = [];
for(let i in CommonServiceModules){
  declarationsArray.push(CommonServiceModules[i]);
}
for(let i in specificComponents){
 declarationsArray.push(specificComponents[i]);
}


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    DropdownModule,
    DatePickerModule,
    MomentModule,
    // ToasterModule,
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
    ServicesListComponent,
    //ServicesComponent,
    //AmountComponent,
    //BarGraphComponent
    ...declarationsArray
  ]
})
export class ServiceModule {
}
