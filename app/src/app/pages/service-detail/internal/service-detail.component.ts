/**
  * @type Component
  * @desc Service detail page
  * @author
*/
import { Http, Headers, Response } from '@angular/http';
import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from "../../../SharedService.service";
import { AfterViewInit, ViewChild } from '@angular/core';

// import { RequestService, DataCacheService } from "../../core/services";
import { ToasterService} from 'angular2-toaster';
import { BarGraphComponent} from '../../../secondary-components/bar-graph/bar-graph.component';
import { RequestService, DataCacheService, MessageService, AuthenticationService } from '../../../core/services/index';
import { ServiceMetricsComponent } from '../../service-metrics/service-metrics.component';
import {environment} from './../../../../environments/environment';

@Component({
    selector: 'service-detail',
    templateUrl: './service-detail.component.html',
    styleUrls: ['./service-detail.component.scss'],
    providers: [RequestService, MessageService]
})

export class ServiceDetailComponent implements OnInit {
    constructor(

        private toasterService: ToasterService,
        private route: ActivatedRoute,
        private router: Router,
        private sharedService: SharedService,
        private http: RequestService,
        private messageservice:MessageService,
        private cache: DataCacheService,
        private authenticationservice:AuthenticationService
    ) {
        this.message = this.sharedService.sharedMessage;
        this.toastmessage = messageservice;
    }
    message;

    @Output() deleteServiceStatus:EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('selectedTabComponent') selectedTabComponent;

    isENVavailable:boolean = true;
    disblebtn:boolean = true;
    ServiceName:string;
    deleteServiceVal:boolean;
    id: string;
    errMessage:string='';
    isLoadingService: boolean = false;
    isLoading: boolean = false;
    selectedTab = 0;
    selected:string = 'All';
    service: any = {};
    isGraphLoading:boolean=false;
    stageOverview: any = {};
    showPopUp:boolean = false;
    success:boolean = false;
    thisIndex : number = 0;
    err_flag:boolean = false;
    serviceDeleted:boolean = false;
    serviceDeleteFailed:boolean = false;
    serviceRequestFailure:boolean = false;
    serviceRequestSuccess:boolean = false;
    canDelete:boolean =true;
    refreshTabClicked:boolean=false;
    successMessage: string = "";
    errorMessage: string = "";
    test:any="delete testing";
    disabled_tab:boolean=false;
    start_at:number=0;
    applications:any;
    application_arr=[];


    private sub: any;
    private subscription:any;
    private toastmessage:any;

    statusData = ['All','Active','Pending','Stopped'];
    tabData = ['OVERVIEW', 'ACCESS CONTROL', 'METRICS', 'LOGS' , 'COST'];

    breadcrumbs = []

    serviceData = {
        service :{
                id: '1',
                name : 'Service One',
                serviceType : 'API',
                runtime : 'Python',
                status : 'Active',
                description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                approvers : 'Jane Smith',
                domain : 'tmo.com',
                email : 'api@tmo.com',
                slackChannel : 'Cloud Notifications',
                repository : 'View on BitBucket',
                tags : 'Pacman, MyService'
        }
    };

    opnSidebar(event){
        this.closeSidebar(true);
    }

    public closeSidebar (eve){
        this.closed = true;
        this.close = eve;
    }
    close:boolean=false;
    closed:boolean = false;
    processService(service){
        if (service === undefined) {
            return {};
        } else{
            return {
                id: service.id,
                name: service.service,
                serviceType: service.type,
                runtime: service.runtime,
                status: service.status.replace('_',' '),
                description: service.description,
                approvers: service.approvers,
                domain: service.domain,
                email: service.email,
                slackChannel: service.slack_channel,
                repository: service.repository,
                tags: service.tags,
                endpoints:service.endpoints,
                is_public_endpoint:service.is_public_endpoint,
                create_cloudfront_url:service.metadata.create_cloudfront_url,
                eventScheduleRate:service.metadata.eventScheduleRate,
                event_source:service.metadata.event_source_dynamodb,
                app_name:service.metadata.application,
                created_by:service.created_by,
                require_internal_access:service.metadata.require_internal_access,
                enable_api_security:service.metadata.enable_api_security
            };
        }
    };

    onDataFetched(service) {

      if (service !== undefined && service !== "") {
        if (!service.id && service.data){
            service = service.data;
        }

        this.service = this.processService(service);

        // Update breadcrumbs
        this.breadcrumbs = [
        {
            'name' : this.service['name'],
            'link' : ''
        }]
        this.isLoadingService = false;

        if(service.status == 'deletion_completed' || service.status == 'deletion_started' || service.status == 'creation_started' || service.status == 'creation_failed')
        this.canDelete = false;
      } else{
        this.isLoadingService = false;
        let errorMessage = this.toastmessage.successMessage(service,"serviceDetail");
        this.toast_pop('error', 'Oops!', errorMessage)
      }
    }

    getapplications(){
      this.http.get('https://cloud-api.corporate.t-mobile.com/api/cloud/workloads?startAt='+this.start_at)
      .subscribe((res: Response) => {
        this.applications=res;

        this.application_arr.push.apply(this.application_arr,this.applications.data.summary);
        this.start_at = this.start_at+100;
        if(this.applications.data.total > this.start_at ){

          this.getapplications();
        }
        else{

          for(var i=0;i<this.application_arr.length;i++){
            if(!this.application_arr[i].appID || !this.application_arr[i].appName){
              this.application_arr.splice(i,1);
            }
            else{
              this.application_arr[i].appName=this.application_arr[i].appName.trim();
            }
          }

          this.application_arr.sort((a: any, b: any) => {
            if (a.appName < b.appName) {
              return -1;
            } else if (a.appName > b.appName) {
              return 1;
            } else {
              return 0;
            }
          });

          return;
        }

      }, error => {
        console.log('workloads error',error)
      });
    }

    fetchService(id: string){

        this.isLoadingService = true;

        let cachedData = this.cache.get(id);
        if (cachedData && !this.refreshTabClicked) {
            this.isGraphLoading=false;
            this.onDataFetched(cachedData)
             if(this.service.serviceType == "website")
            {
                this.tabData = ['OVERVIEW', 'ACCESS CONTROL', 'METRICS' , 'COST'];
            }
        } else{
            this.http.get('/jazz/services/'+id).subscribe(
              response => {

                    let service = response.data;
                     if(response.data.type === "website")
                    {
                        this.tabData = ['OVERVIEW', 'ACCESS CONTROL', 'METRICS' , 'COST'];
                    }
                    this.cache.set(id, service);
                    this.onDataFetched(service);
                    this.isGraphLoading=false;
                    this.selectedTabComponent.refresh_env();
                },
                err => {
                    if( err.status == "404"){
                        this.router.navigateByUrl('404');
                    }
                    this.isLoadingService = false;
                    let errorMessage = 'OOPS! something went wrong while fetching data';
                    this.isGraphLoading=false;
                    errorMessage = this.toastmessage.errorMessage(err,"serviceDetail");
                    this.errMessage = errorMessage;
                    this.err_flag=true;

                }
            )
        }

    };



    onSelectedDr(selected){
        this.selectedTab = selected;
    }

    tabChanged (i) {
        this.selectedTab = i;
        if( i == 4){
            this.disabled_tab = true;
        }
    };

    statusFilter(item){
        this.selected = item;
        // this.filterByStatus();
    };

    env(event){
        if( (event != 'creation failed') && (event != 'creation started') && (event != 'deletion started') && (event != 'deletion completed') ){
            this.canDelete = true;
        }else{
            this.canDelete = false;
        }
    }

    public goToAbout(hash){
        this.router.navigateByUrl('landing');
        this.cache.set('scroll_flag',true);
        this.cache.set('scroll_id',hash);
     }

    deleteService(x){
        if (!this.service.status || this.service.status == 'deletion_completed' || this.service.status == 'deletion_started') {
            return;
        }
        this.showPopUp = true;
        this.success = false;
    };
    refreshServ()
    {
    this.isGraphLoading=true;
    this.fetchService(this.id);
    }

    hideDeletePopup(x){
        if(this.success){
            this.router.navigateByUrl('services');
        }
        this.showPopUp = false;
        this.success = false;
        if(this.subscription){
            this.subscription.unsubscribe();

        }
    };

    deleteServiceConfirm(){
        this.success = true;
    };

    setMessage(body, type) {
        this.message.body = body;
        this.message.type = type;
        this.sharedService.sharedMessage = this.message;
    };

    refreshCostData(event){
        this.isLoading=true;
        this.deleteServiceInit()
    }

    deleteServiceInit(){

        this.isLoading=true;
        this.disblebtn =true;
        var payload = {
                "service_name": this.service.name,
                "domain": this.service.domain,
                "id" : this.service.id
            };
       this.deleteServiceStatus.emit(this.deleteServiceVal);
       this.subscription = this.http.post('/jazz/delete-serverless-service' , payload)
       .subscribe(
        (Response) => {
            var update = {
                "status":"Deleting"
            }
            var service = payload.service_name;
            var domain = payload.domain;
            var reqId = Response.data.request_id;
            localStorage.setItem('request_id'+"_"+payload.service_name+"_"+payload.domain, JSON.stringify({ service: service, domain: domain, request_id: reqId }));
            this.serviceRequestSuccess = true;
            this.serviceRequestFailure = false;
            let successMessage = this.toastmessage.successMessage(Response,"serviceDelete")
            this.successMessage = successMessage;
            this.success = true;
            this.serviceDeleted = true;
            // this.toast_pop('success',"", "Service: "+this.service.name +" "+successMessage);
            this.isLoading = false;
            // this.cache.set('request_id',this.test);
            this.cache.set('deletedServiceId',this.service.id)
            this.cache.set("updateServiceList", true);
            this.serviceDeleteFailed = false;
            // setTimeout(() => {
            //     this.router.navigateByUrl('services');
            // }, 3000);
        },
        (error) => {
            this.serviceRequestSuccess = false;
            this.serviceRequestFailure = true;
            let errorMessage = this.toastmessage.errorMessage(error,"serviceDelete");
            this.errorMessage = errorMessage;
            this.success = true;
            this.serviceDeleteFailed = true;
            // this.toast_pop('error','Oops!', errorMessage);
            this.isLoading = false;
            this.serviceDeleted = false;
        }
        );


    //    var msg = this.serviceData.service.name +" has been successfully created"
    //    this.setMessage("success",msg);

    };

    backtoservice(){
        this.router.navigateByUrl('services');
    }

    backtoserviceid(){
        this.showPopUp = false;
        if(this.serviceDeleted == true){
        this.serviceDeleted = false;
        }else if(this.serviceDeleteFailed == true){
            this.serviceDeleteFailed = false;
        }
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }


    onServiceNameChange(){
        if(this.ServiceName == this.service['name']){
            this.disblebtn = false;
        }
        else{
            this.disblebtn = true;
        }
    }


    changeTabIndex(index){
        this.thisIndex = index;
    }

    handleTabs(index){
        this.selectedTab = index;

    }

    toast_pop(error,oops,errorMessage)
    {
      var tst = document.getElementById('toast-container');
         tst.classList.add('toaster-anim');
        this.toasterService.pop(error,oops,errorMessage);
        setTimeout(() => {
            tst.classList.remove('toaster-anim');
          }, 3000);
    }

    refreshTab(){
        this.refreshTabClicked=true;
        if(this.selectedTab == 0){
            this.refreshServ();

        }
        else{
            this.selectedTabComponent.refresh();
        }

    }
    ngOnInit() {
      this.getapplications();
        this.breadcrumbs = [
        {
            'name' : this.service['name'],
            'link' : ''
        }]
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.fetchService(this.id);
        });
        // this.MetricsInstance.notifyByEnv("sist");

        //erase action
        // $( document ).ready(function() {
        //     $('#redux').eraser();
        // });

    }
    ngOnChanges(x:any){

    }
}
