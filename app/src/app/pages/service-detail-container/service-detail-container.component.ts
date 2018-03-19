import { Component, OnInit, ComponentFactoryResolver, ReflectiveInjector, ElementRef ,EventEmitter, Output, Inject, Input,ViewChild} from '@angular/core';
import { ServiceDetailService } from './../../service-detail.service';
import { ServDetail} from './../../serv-detail.directive';
// import { ServiceDetailComponent} from './../service-detail/internal/service-detail.component';

@Component({
  selector: 'service-detail-container',
  templateUrl: './service-detail-container.component.html',
  styleUrls: ['./service-detail-container.component.css']
})
export class ServiceDetailContainerComponent implements OnInit {
  componentFactoryResolver:ComponentFactoryResolver;
  @ViewChild(ServDetail) serv_detail: ServDetail;


  constructor( @Inject(ComponentFactoryResolver) componentFactoryResolver,private service_det_service: ServiceDetailService ,)
  {
    this.componentFactoryResolver = componentFactoryResolver;
		var comp = this;
		setTimeout(function(){
			comp.getComp(service_det_service);
		},3000);
		
  }

  getComp(detServ){
		// let viewContainerRef = this.advanced_filters.viewContainerRef;
		// viewContainerRef.clear();
		// detServ.setRootViewContainerRef(viewContainerRef);
		let filtertypeObj = detServ.addDynamicComponent({"service" : "this.service", "advanced_filter_input" : "this.advanced_filter_input"});
		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(filtertypeObj.component);
		console.log(this.serv_detail);
		var comp = this;
		// this.advfilters.clearView();
		let viewContainerRef = this.serv_detail.viewContainerRef;
		console.log(viewContainerRef);
		viewContainerRef.clear();
		let componentRef = viewContainerRef.createComponent(componentFactory);
		

	}
  ngOnInit() {
  }

}
