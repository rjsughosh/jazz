import { Injectable , ComponentFactoryResolver, ReflectiveInjector} from '@angular/core';
import { Component, OnInit, ElementRef ,EventEmitter, Output, Inject, Input,ViewChild} from '@angular/core';
import {ServiceDetailComponent} from './pages/service-detail/internal/service-detail.component';
import {ServiceDetailComponentOss} from './pages/service-detail/oss/service-detail.component';
import {environment} from './../environments/environment';

@Injectable()
export class ServiceDetailService {

  
  // @ViewChild('adv_filters') adv_filters: AdvancedFiltersComponent;
  factoryResolver:ComponentFactoryResolver ;
  rootViewContainer;
  component : Component
  environ:string = environment.envName;
  constructor(@Inject(ComponentFactoryResolver) factoryResolver) { 
    this.factoryResolver = factoryResolver;
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addDynamicComponent(obj) {
    // alert(this.environ)
    if(this.environ == 'oss'){
      return  {"component" : ServiceDetailComponentOss,obj};
    }
    else{
      return  {"component" : ServiceDetailComponent,obj};
    }
  }
}
