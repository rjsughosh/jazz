import { Injectable , ComponentFactoryResolver, ReflectiveInjector} from '@angular/core';
import { Component, OnInit, ElementRef ,EventEmitter, Output, Inject, Input,ViewChild} from '@angular/core';
import {AdvancedFiltersComponent} from './secondary-components/advanced-filters/advanced-filters.component';
import {AdvancedFiltersComponentOSS} from './secondary-components/advanced-filters/OSS/advanced-filters.component';

@Injectable()
export class AdvancedFilterService {
  @ViewChild('adv_filters') adv_filters: AdvancedFiltersComponent;
  factoryResolver:ComponentFactoryResolver ;
  rootViewContainer;
  component : Component

  constructor(@Inject(ComponentFactoryResolver) factoryResolver) { 
    this.factoryResolver = factoryResolver;
  }

  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addDynamicComponent(obj) {
    //[service]='service' [advanced_filter_input]='advanced_filter_input'
   return  {"component" : AdvancedFiltersComponentOSS,obj};
    // if(env=="oss"){
     
    // }
    // else
    // {
    
    // }
    
  }
  

  
  
}
