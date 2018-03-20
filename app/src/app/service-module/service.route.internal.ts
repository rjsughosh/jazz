import {Routes} from '@angular/router';
import {ServicesListComponent} from '../pages/services-list/services-list.component';
// import * as ServiceDetailComponentOSS from '../pages/service-detail/oss/service-detail.component';
// import * as ServiceDetailComponentInternal from '../pages/service-detail/internal/service-detail.component'
// import {ServiceDetailContainerComponent} from '../pages/service-detail-container/service-detail-container.component';
import {ServiceDetailComponent} from '../pages/service-detail/internal/service-detail.component'


import {ServicesComponent} from '../pages/services/services.component';
import {EnvironmentModule} from '../environment-module/environment.module'
import {RouteGuard} from '../core/services';
import {environment} from '../../environments/environment';
// let ServiceDetailComponent;
// if(environment.envName == 'oss'){
//   ServiceDetailComponent =  ServiceDetailComponentOSS.ServiceDetailComponent;
// }else{
//   ServiceDetailComponent =  ServiceDetailComponentInternal.ServiceDetailComponent;
// }

export const routes: Routes = [
  {
    path: '',
    component: ServicesComponent,
    children: [
      {
        path: '',
        component: ServicesListComponent,
        canActivate: [RouteGuard]
      },
      {
        path: ':id',
        component: ServiceDetailComponent,
        canActivate: [RouteGuard]
      },
      {
        path: ':id/:env',
        loadChildren: '../environment-module/environment.module#EnvironmentModule',
        canActivate: [RouteGuard]
      }
    ]
  }
];
