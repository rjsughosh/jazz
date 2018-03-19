// NgMoudle,Enviornment and Router Module Import 
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {environment} from '../../environments/environment';
import {routes} from './service.route.oss';
//End
// Importing The Required Modules via Barrel 
import * as CommonServiceModules from './service.module.imports.common'
import * as OssModules from './service.module.imports.oss'
import * as InternalModules from './service.module.imports.internal'
// End
// Importing The Required Components via Barrel
import * as CommonServiceComponents from './service.module.declarations.common';
import * as OssComponents from './service.module.declarations.oss';
import * as InternalComponents from './service.module.declarations.internal';
import {AdvancedFiltersComponentOSS} from '../secondary-components/advanced-filters/OSS/advanced-filters.component';
import {AdvancedFiltersComponent} from '../secondary-components/advanced-filters/advanced-filters.component';

import { AdvFilters }            from '../adv-filter.directive';
import {AdvancedFilterService} from '../advanced-filter.service';
// End 
import { Symbol } from 'rxjs';

let specificComponents:any
let specificModules: any;
//alert(environment.envName);
if(environment.envName == 'oss'){
  specificComponents = OssComponents;
  specificModules =  OssModules
}else if(environment.envName == "jazz")  {
  specificComponents = InternalComponents;
  specificModules =  InternalModules;
}
let importsArray = [];
let declarationsArray=[];
for(let i in CommonServiceModules){
  importsArray.push(CommonServiceModules[i]);
}
for(let i in specificModules){
 importsArray.push(specificModules[i]);
}
for(let i in CommonServiceComponents){
  declarationsArray.push(CommonServiceComponents[i]);
}
for(let i in specificComponents){
 declarationsArray.push(specificComponents[i]);
}
console.log('imports  ',importsArray)
console.log('dec  ',declarationsArray)

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ...importsArray
    //EnvironmentModule,
    //FormsModule,
    //CommonModule,
    //DropdownModule,
    //DatePickerModule,
    //MomentModule,
    // ToasterModule,
    //PopoverModule,
    //ChartsModule,
    //IonRangeSliderModule,
    //SharedModule,
    
  ],
  providers:[AdvancedFilterService],
  declarations: [
    //ServiceAccessControlComponent,
    //ServiceCostComponent,
    //ServiceMetricsComponent,
    //ServiceLogsComponent,
    //ServiceOverviewComponent,
    //ServicesListComponent,
    //ServicesComponent,
    //AmountComponent,
    //BarGraphComponent
    ...declarationsArray,
    AdvFilters,
    AdvancedFiltersComponentOSS,
    AdvancedFiltersComponent
  ],
  entryComponents : [AdvancedFiltersComponentOSS, AdvancedFiltersComponent],
})
export class ServiceModule {
  constructor(){
    console.log('imports  ',importsArray)
  }
}
