import {  ComponentFixture,  inject } from '@angular/core/testing';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
 import {NO_ERRORS_SCHEMA, Component, Input, OnInit, Output, EventEmitter, NgModule } from '@angular/core';


 import { ServiceFormData, RateExpression, CronObject, EventExpression } from './service-form-data';
 import { FocusDirective} from './focus.directive';

 import { ToasterService} from 'angular2-toaster';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { ServicesListComponent } from '../../pages/services-list/services-list.component';
import { CreateServiceComponent } from './create-service.component';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from '../../app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MomentModule } from 'angular2-moment';
import { DatePickerModule } from '../../primary-components/daterange-picker/ng2-datepicker';
import { ChartsModule } from 'ng2-charts';
import { APP_BASE_HREF } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { DropdownModule } from "ng2-dropdown";
import { BtnTmobilePrimaryComponent } from '../../primary-components/btn-tmobile-primary/btn-tmobile-primary.component';
import { BtnTmobileSecondaryComponent } from '../../primary-components/btn-tmobile-secondary/btn-tmobile-secondary.component';
import { LandingComponent } from '../../pages/landing/landing.component';
import { CronParserService } from '../../core/helpers';
import { SharedService } from "../../SharedService.service";
import { ConfigService, ConfigLoader } from '../../app.config';
import { ServicesComponent } from '../../pages/services/services.component';
import { TmobileTableComponent } from '../../secondary-components/tmobile-table/tmobile-table.component';
import { SideTileFixedComponent } from '../../secondary-components/side-tile-fixed/side-tile-fixed.component';
import { DropdownComponent } from '../../primary-components/dropdown/dropdown.component';
import { MyFilterPipe } from '../../primary-components/custom-filter';
import { TabsComponent } from '../../primary-components/tabs/tabs.component';
import { OnlyNumber } from '../../secondary-components/create-service/onlyNumbers';
import { SidebarComponent } from '../../secondary-components/sidebar/sidebar.component';
import { TmobileHeaderComponent } from '../../secondary-components/tmobile-header/tmobile-header.component';
import { ClickOutsideDirective } from '../../secondary-components/tmobile-header/outside-click';
import { LoginComponent } from '../../pages/login/login.component';
import { ServiceOverviewComponent } from '../../pages/service-overview/service-overview.component';
import { InputComponent } from '../../primary-components/input/input.component';
import { BtnPrimaryWithIconComponent } from '../../primary-components/btn-primary-with-icon/btn-primary-with-icon.component';
import { NavigationBarComponent } from '../../secondary-components/navigation-bar/navigation-bar.component';
import { ServiceLogsComponent } from '../../pages/service-logs/service-logs.component';
import { ServiceDetailComponent } from '../../pages/service-detail/service-detail.component';
import { ServiceAccessControlComponent } from '../../pages/service-access-control/service-access-control.component';
import { EnvironmentDetailComponent } from '../../pages/environment-detail/environment-detail.component';
import { EnvAssetsSectionComponent } from '../../pages/environment-assets/env-assets-section.component';
import { EnvDeploymentsSectionComponent } from '../../pages/environment-deployment/env-deployments-section.component';
import { EnvCodequalitySectionComponent } from '../../pages/environment-codequality/env-codequality-section.component';
import { EnvLogsSectionComponent } from '../../pages/environment-logs/env-logs-section.component';
import { EnvOverviewSectionComponent } from '../../pages/environment-overview/env-overview-section.component';
import { ServiceCostComponent } from '../../pages/service-cost/service-cost.component';
import { BarGraphComponent } from '../../secondary-components/bar-graph/bar-graph.component';
import { AmountComponent } from '../../primary-components/amount/amount.component';
import { FiltersComponent } from '../../secondary-components/filters/filters.component';
import { FilterTagsComponent } from '../../secondary-components/filter-tags/filter-tags.component';
import { FilterTagsServicesComponent } from '../../secondary-components/filter-tags-services/filter-tags-services.component';
import { TableTemplateComponent } from '../../secondary-components/table-template/table-template.component';
import { SearchBoxComponent } from '../../primary-components/search-box/search-box.component';
import { DaterangePickerComponent } from '../../primary-components/daterange-picker/daterange-picker.component';
import { MobileSecondaryTabComponent } from '../../secondary-components/mobile-secondary-tab/mobile-secondary-tab.component';
import { TmobileMobHeaderComponent } from '../../secondary-components/tmobile-mob-header/tmobile-mob-header.component';
import { ToasterModule } from 'angular2-toaster';
import { LineGraphComponent } from '../../secondary-components/line-graph/line-graph.component';
import { ServiceMetricsComponent } from '../../pages/service-metrics/service-metrics.component';
import { TmobileToasterComponent } from '../../secondary-components/tmobile-toaster/tmobile-toaster.component';
import { JenkinsStatusComponent } from '../../pages/jenkins-status/jenkins-status.component';
import { TestApiComponent } from '../../pages/testapi/test-api.component';
import { FooterComponent } from '../../secondary-components/footer/footer.component';
import { Error404Component } from '../../pages/error404/error404.component';
import { PopoverModule } from 'ng2-popover';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthenticationService, RouteGuard, DataCacheService, RequestService, MessageService } from '../../core/services';
import { RouterModule, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { environment } from '../../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { ServiceList } from 'app/pages/services-list/service-list';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
class MockAuthService  {
  // constructor(private http: Http, private configService: MockConfigService,  private router:Router){
  //   super(http, configService, router);
  // }
  
  isAuthenticated() {
    return 'Mocked';
  }
  getToken(){

  }
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}
class MockConfigService extends ConfigService {
  getConfiguration(){
    return {"baseurl" : "https://cloud-api.corporate.t-mobile.com/api"}
  }

}

class RequestServiceMock {

}

describe('CreateServiceComponent', () => {
  let component: CreateServiceComponent;
  let describeScope = this;
  let fixture: ComponentFixture<CreateServiceComponent>;
  let element: HTMLElement;
  let testBedService: AuthenticationService;
  let componentService: AuthenticationService;
  let testBedRequestService: RequestService;
  let router: MockRouter;
  let testBedConfigService:ConfigService;
  let componentConfigService : ConfigService;
  let de:      DebugElement;
  beforeEach(async(() => {
    TestBed.overrideComponent(
      LoginComponent,
      {set: {providers: [{provide: AuthenticationService, useClass: MockAuthService}]}}
  );
    TestBed.configureTestingModule({
      declarations: [CreateServiceComponent, MyFilterPipe, ServicesListComponent],
      imports:[FormsModule, ReactiveFormsModule, BrowserModule,DropdownModule,PopoverModule,HttpModule,DatePickerModule ],
      providers: [
        ToasterService,CronParserService , DataCacheService, 
        {provide:Router, useClass : MockRouter},
        {provide:ConfigService, useClass : MockConfigService},
        {provide:RequestService, useClass : RequestServiceMock},
        {provide:AuthenticationService, useClass : MockAuthService},SharedService
        ,MessageService,  ServicesListComponent],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = new MockRouter();
    // authenticationservice = new AuthService();
    
    fixture = TestBed.createComponent(CreateServiceComponent);
    component = fixture.componentInstance;
    element=fixture.nativeElement;
    fixture.detectChanges();
    testBedConfigService = TestBed.get(ConfigService);
    testBedService = TestBed.get(AuthenticationService);
    // AuthService provided by Component, (should return MockAuthService)
    componentService = fixture.debugElement.injector.get(AuthenticationService);
    componentConfigService = fixture.debugElement.injector.get(ConfigService);
    testBedRequestService = TestBed.get(RequestService);
    let spy = spyOn(component, "validateServiceName").and.callFake(()=>{
      if(component.model.domainName==="true-domain"&& component.model.serviceName === "true-service"){
        component.serviceAvailable = true;
        component.serviceNotAvailable = false;
        component.isDomainDefined =false; 
      }
      }
    );
    let spy2 = spyOn(component, "toast_pop").and.callFake(()=>{});

  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // expect("true").toBe("true");
  });
  it('Should be same service with injector',() =>{
    inject([AuthenticationService],(injectService: AuthenticationService) => {
      expect(injectService).toBe(testBedService);
    })
  });
  it('TestServiceNameValidity',() =>{
    de = fixture.debugElement.query(By.css('h1'));
  });


// TEST CASE UT001
  it('API should show Specific Field Runtime',()=>{
    component.changeServiceType('api');
    fixture.detectChanges();
    let contextElement:DebugElement;
    let elementText :String;
    let passed = false;
    let elementList = fixture.debugElement.queryAll(By.css('.each-step-wrap.run-time'));
    for (let i=0;i<elementList.length;i++) {
      if(elementList[i].nativeElement.textContent.toLowerCase().search('Choose your runtime'.toLowerCase())!=-1){
        contextElement = elementList[i];
        passed=true;
      }
    }
    elementText=  contextElement.nativeElement.textContent.toLowerCase()
    expect(passed).toBe(true) ;
    expect(elementText).toContain("NodeJs".toLowerCase()) ;
    expect(elementText).toContain("Java".toLocaleLowerCase());
    expect(elementText).toContain("Python".toLocaleLowerCase());
  });
  it('API should show Specific Field Accessiblity ',()=>{
    component.changeServiceType('api');
    fixture.detectChanges();
    let contextElement:DebugElement;
    let elementText :String;
    let passed = false;
    let elementList = fixture.debugElement.queryAll(By.css('.each-step-wrap.Internal-access'));
    for (let i=0;i<elementList.length;i++) {
      if(elementList[i].nativeElement.textContent.toLowerCase().search('Accessibility'.toLowerCase())!=-1){
        contextElement = elementList[i];
        passed=true;
      }
    }
    elementText=  contextElement.nativeElement.textContent.toLowerCase()
    expect(passed).toBe(true) ;
    expect(elementText).toContain("The API should be publicly accessible".toLowerCase()) ;
  });
  it('API should show Specific Field Access Restriction ',()=>{
    component.changeServiceType('api');
    fixture.detectChanges();
    let contextElement:DebugElement;
    let elementText :String;
    let passed = false;
    let elementList = fixture.debugElement.queryAll(By.css('.each-step-wrap.Internal-access'));
    for (let i=0;i<elementList.length;i++) {
      if(elementList[i].nativeElement.textContent.toLowerCase().search('Access Restriction'.toLowerCase())!=-1){
        contextElement = elementList[i];
        passed=true;
      }
    }
    elementText=  contextElement.nativeElement.textContent.toLowerCase()
    expect(passed).toBe(true) ;
    expect(elementText).toContain('Does your service require access to internal T-Mobile network and resources?'.toLowerCase()) ;
  });
  it('API should show Specific Field Cache Time To Live',()=>{
    component.changeServiceType('api');
    fixture.detectChanges();
    let contextElement:DebugElement;
    let elementText :String;
    let passed = false;
    let elementList = fixture.debugElement.queryAll(By.css('.each-step-wrap.cache-ttl-integration'));
    for (let i=0;i<elementList.length;i++) {
      if(elementList[i].nativeElement.textContent.toLowerCase().search('Cache Time-to-Live'.toLowerCase())!=-1){
        contextElement = elementList[i];
        passed=true;
      }
    }
  
    elementText=  contextElement.nativeElement.textContent.toLowerCase()
    expect(passed).toBe(true) ;
    expect(elementText).toContain("Yes, enable caching for my API".toLowerCase()) ;
  });
// TEST CASE UT001 - COMPLETED 



  it('API Specific Field runtime should not be present in website',()=>{
    component.changeServiceType('website');
    fixture.detectChanges();
    let runtime = fixture.debugElement.query(By.css('.each-step-wrap.run-time'));
    expect(runtime).toBeNull ;
  });
  it('API Specific Field accesiblity should not be present in website',()=>{
    component.changeServiceType('website');
    fixture.detectChanges();
    let accessiblity = fixture.debugElement.query(By.css('.each-step-wrap.Internal-access'));
    expect(accessiblity).toBeNull ;
  });
  

  // TEST CASE UT003 - START
 it('ValidateNameService should be called for valid (Servicename - Namespace) pair when the user navigates out of Namespace input ',async(()=>{
  let serviceInput;
  let namespaceInput;
  component.changeServiceType('api');
    fixture.autoDetectChanges();
    component.model.serviceName = "true-service";
    component.invalidServiceName =false;
    component.model.domainName="true-domain"
    component.invalidDomainName=false;
    //fixture.detectChanges();
    serviceInput   =  fixture.debugElement.query(By.css('.each-step-wrap.service-name')).nativeElement;
    namespaceInput =  fixture.debugElement.query(By.css('.each-step-wrap.domain-name input')).nativeElement;
    namespaceInput.focus();
    namespaceInput.blur();
    fixture.whenStable().then(()=>{
      fixture.detectChanges()
      expect(component.validateServiceName).toHaveBeenCalled();
      expect(serviceInput.querySelector('.termsConditions').textContent).toContain('Service name is available');
        
    })
    
  }));
  it('ValidateNameService should be called for valid (Servicename - Namespace) pair when the user navigates out of Service name input ',async(()=>{
    let serviceInput;
    let namespaceInput;
    component.changeServiceType('api');
      fixture.autoDetectChanges();
      component.model.serviceName = "true-service";
      component.invalidServiceName =false;
      component.model.domainName="true-domain"
      component.invalidDomainName=false;
      fixture.detectChanges();
      serviceInput   =  fixture.debugElement.query(By.css('.each-step-wrap.service-name')).nativeElement;
      namespaceInput =  fixture.debugElement.query(By.css('.each-step-wrap.domain-name input')).nativeElement;
      serviceInput.querySelector('input').focus();
      serviceInput.querySelector('input').blur();
      fixture.detectChanges();
      fixture.whenStable().then(()=>{
        fixture.detectChanges()
        expect(component.validateServiceName).toHaveBeenCalled();
        expect(serviceInput.querySelector('.termsConditions').textContent).toContain('Service name is available');
          
      })
    }));
    it('Submit button should get enabled for right Service,Namespace,Autoriser set ',async(()=>{
      let serviceInput;
      let namespaceInput;
      let approverInput;
      let submitButton;
      component.changeServiceType('api');
        fixture.autoDetectChanges();
        component.model.serviceName = "true-service";
        component.invalidServiceName =false;
        component.model.domainName="true-domain"
        component.invalidDomainName=false;
        fixture.detectChanges();
        serviceInput   =  fixture.debugElement.query(By.css('.each-step-wrap.service-name')).nativeElement;
        namespaceInput =  fixture.debugElement.query(By.css('.each-step-wrap.domain-name input')).nativeElement;
        submitButton =  fixture.debugElement.query(By.css('.submit-form button')).nativeElement;

        serviceInput.querySelector('input').focus();
        serviceInput.querySelector('input').blur();
        fixture.detectChanges()
        component.approversList = [
          {
            displayName:"Approver1",
            givenName:"Approver1",
            userId:"AP1",
            userEmail:"ap1@moonraft.com"
          },
          {
            givenName:"Approver1",
            userId:"AP1",
            userEmail:"ap1@moonraft.com"
          },
          {
            displayName:"Approver3",
            givenName:"Approver1",
            userId:"AP1",
            userEmail:"ap1@moonraft.com"
          }
        ];
        //expect(component.validateServiceName).toHaveBeenCalled();
        //expect(serviceInput.querySelector('.termsConditions').textContent).toContain('Service name is available');
        approverInput   =  fixture.debugElement.query(By.css('.each-step-wrap.approvers')).nativeElement;
        component.approverName = "App";
        let temp : HTMLElement ; 
        temp  = approverInput.querySelector('input');  
        temp.click();
        var event = document.createEvent('Event');
    
        event.initEvent('keydown',true,true);
        temp.dispatchEvent(event);
        component.onApproverChange(true);
        fixture.whenStable().then(()=>{
          approverInput.querySelector('.approvers-list-wrap .approvers-dets div').click();
          fixture.detectChanges();
          expect(submitButton.disabled).toBe(false);      
        });
      }));
    it('Submit button should  not get enabled for invalid Service name even with valid (Namespace,Autoriser) set ',async(()=>{
          let serviceInput;
          let namespaceInput;
          let approverInput;
          let submitButton;
          component.changeServiceType('api');
          fixture.autoDetectChanges();
          component.model.serviceName = "not-true-service";
          component.invalidServiceName =false;
          component.model.domainName="true-domain"
          component.invalidDomainName=false;
          fixture.detectChanges();
          serviceInput   =  fixture.debugElement.query(By.css('.each-step-wrap.service-name')).nativeElement;
          namespaceInput =  fixture.debugElement.query(By.css('.each-step-wrap.domain-name input')).nativeElement;
          submitButton =  fixture.debugElement.query(By.css('.submit-form button')).nativeElement;
  
          serviceInput.querySelector('input').focus();
          serviceInput.querySelector('input').blur();
          fixture.detectChanges()
          component.approversList = [
            {
              displayName:"Approver1",
              givenName:"Approver1",
              userId:"AP1",
              userEmail:"ap1@moonraft.com"
            },
            {
              givenName:"Approver1",
              userId:"AP1",
              userEmail:"ap1@moonraft.com"
            },
            {
              displayName:"Approver3",
              givenName:"Approver1",
              userId:"AP1",
              userEmail:"ap1@moonraft.com"
            }
          ];
          //expect(component.validateServiceName).toHaveBeenCalled();
          //expect(serviceInput.querySelector('.termsConditions').textContent).toContain('Service name is available');
          approverInput   =  fixture.debugElement.query(By.css('.each-step-wrap.approvers')).nativeElement;
          component.approverName = "App";
          let temp : HTMLElement ; 
          temp  = approverInput.querySelector('input');  
          temp.click();
          var event = document.createEvent('Event');
      
          event.initEvent('keydown',true,true);
          temp.dispatchEvent(event);
          component.onApproverChange(true);
          fixture.whenStable().then(()=>{
            approverInput.querySelector('.approvers-list-wrap .approvers-dets div').click();
            fixture.detectChanges();
            expect(submitButton.disabled).toBe(true);      
          });
        }));  
    it('Submit button should  not get enabled for invalid NameSpace even with valid (Service name,Autoriser) set ',async(()=>{
          let serviceInput;
          let namespaceInput;
          let approverInput;
          let submitButton;
          component.changeServiceType('api');
            fixture.autoDetectChanges();
            component.model.serviceName = "true-service";
            component.invalidServiceName =false;
            component.model.domainName="not-true-domain"
            component.invalidDomainName=false;
            fixture.detectChanges();
            serviceInput   =  fixture.debugElement.query(By.css('.each-step-wrap.service-name')).nativeElement;
            namespaceInput =  fixture.debugElement.query(By.css('.each-step-wrap.domain-name input')).nativeElement;
            submitButton =  fixture.debugElement.query(By.css('.submit-form button')).nativeElement;
    
            serviceInput.querySelector('input').focus();
            serviceInput.querySelector('input').blur();
            fixture.detectChanges()
            component.approversList = [
              {
                displayName:"Approver1",
                givenName:"Approver1",
                userId:"AP1",
                userEmail:"ap1@moonraft.com"
              },
              {
                givenName:"Approver1",
                userId:"AP1",
                userEmail:"ap1@moonraft.com"
              },
              {
                displayName:"Approver3",
                givenName:"Approver1",
                userId:"AP1",
                userEmail:"ap1@moonraft.com"
              }
            ];
            //expect(component.validateServiceName).toHaveBeenCalled();
            //expect(serviceInput.querySelector('.termsConditions').textContent).toContain('Service name is available');
            approverInput   =  fixture.debugElement.query(By.css('.each-step-wrap.approvers')).nativeElement;
            component.approverName = "App";
            let temp : HTMLElement ; 
            temp  = approverInput.querySelector('input');  
            temp.click();
            var event = document.createEvent('Event');
        
            event.initEvent('keydown',true,true);
            temp.dispatchEvent(event);
            component.onApproverChange(true);
            fixture.whenStable().then(()=>{
              approverInput.querySelector('.approvers-list-wrap .approvers-dets div').click();
              fixture.detectChanges();
              expect(submitButton.disabled).toBe(true);      
            });
          }));  

});




