/**
  * @type Component
  * @desc Service overview page
  * @author
*/

import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService, DataCacheService, MessageService , AuthenticationService } from '../../core/services/index';
import { ToasterService} from 'angular2-toaster';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { ServiceDetailComponent } from '../service-detail/service-detail.component'
// import  $  from 'jquery';
declare var $:any;

@Component({
    selector: 'service-overview',
    templateUrl: './service-overview.component.html',
    providers: [RequestService, MessageService],
    styleUrls: ['../service-detail/service-detail.component.scss','./service-overview.component.scss']
})

export class ServiceOverviewComponent implements OnInit {
    
    @Output() onload:EventEmitter<any> = new EventEmitter<any>();
    @Output() onEnvGet:EventEmitter<any> = new EventEmitter<any>();

    flag:boolean=false;
    @Input() service: any = {};
    @Input() isLoadingService: boolean = false;
    private subscription:any;

    list_env = []
    list_inactive_env = [];

    disp_edit:boolean= true;
    hide_email_error:boolean = true;
    hide_slack_error:boolean = true;
    service_error:boolean = true;
    disp_show:boolean = false;
    err404:boolean = false;
    disable_button:boolean = false;
    email_valid:boolean;
    slack_valid:boolean;
    response_json:any;
    show_loader:boolean = false;
    plc_hldr:boolean = true;
    status_empty:boolean;
    description_empty:boolean;
    approvers_empty:boolean;
    domain_empty:boolean;
    serviceType_empty:boolean;
    email_empty:boolean;
    slackChannel_empty:boolean;
    repository_empty:boolean;
    runtime_empty:boolean = false;
    tags_empty:boolean;
    ErrEnv:boolean=false;
    errMessage=''
    tags_temp:string='';
    desc_temp:string='';
    bitbucketRepo:string = "";
    repositorylink:string = "";
    islink:boolean = false;
    showCancel:boolean=false;
    private toastmessage:any = '';
    // mod_status:string;
    private http:any;
    statusCompleted:boolean = false;
    serviceStatusCompleted:boolean = false;
    serviceStatusPermission:boolean = false;
    serviceStatusRepo:boolean = false;
    serviceStatusValidate:boolean = false;
    serviceStatusCompletedD:boolean = false;
    serviceStatusPermissionD:boolean = false;
    serviceStatusRepoD:boolean = false;
    serviceStatusValidateD:boolean = false;
    serviceStatusStarted:boolean = true;
    serviceStatusStartedD:boolean = false;
    statusFailed:boolean = false;
    statusInfo:string='Service Creation started';
    private intervalSubscription: Subscription;
    swaggerUrl:string='';
    baseUrl:string='';
    update_payload:any={};
    payloag_tags=[];
    service_request_id:any;
    creation_status:string;
    statusprogress:number=20;
    animatingDots:any;
    noStg:boolean=false;
    noProd:boolean=false;
    DelstatusInfo:string='Deletion Started';
    creating:boolean = false;
    deleting:boolean = false;
    showcanvas:boolean=false;
    errBody: any;
	parsedErrBody: any;
	errorTime:any;
	errorURL:any;
	errorAPI:any;
	errorRequest:any={};
	errorResponse:any={};
    errorUser:any;
    envList=['prod','stg'];
	errorChecked:boolean=true;
	errorInclude:any="";
    json:any={};
    errorcase:boolean=false;
    Nerrorcase:boolean=true;
    reqJson:any={};
    createloader:boolean=true;
    showbar:boolean=false;


    constructor(
        
        private router: Router,
        private request: RequestService,
        private messageservice:MessageService,
        private cache: DataCacheService,
        private toasterService: ToasterService,
        private serviceDetail:ServiceDetailComponent,
        private authenticationservice: AuthenticationService
    ) {
        this.http = request;
        this.toastmessage = messageservice;
    }

    email_temp:string;
    isenvLoading:boolean=false;
    token:string;
    noSubEnv:boolean=false;
    noEnv:boolean=false;
    slackChannel_temp:string;
    slackChannel_link:string = '';
    edit_save:string = 'EDIT';
    activeEnv:string = 'dev';
    Environments=[];
    environ_arr=[];
    prodEnv:any;
    stgEnv:any;
    status :string= this.service.status;
    environments = [
        {   stageDisp:'PROD',
            stage : 'prd',
            serviceHealth : 'NA',
            lastSuccess : {},
            lastError : {
                value:'NA',
                // unit: 'Days'
            },
            deploymentsCount : {
                'value':'NA',
                'duration':'Last 24 hours'
            },
            cost : {
                'value': 'NA',
                'duration': 'Per Day',
                // 'status': 'good'
            },
            codeQuality : {
                'value': 'NA',
                // 'status': 'bad'
            }
        },
        {   stageDisp:'STAGE',
            stage : 'stg',
            serviceHealth : 'NA',
            lastSuccess : {
                value:'NA',
                // unit: 'Days'
            },
            lastError : {},
            deploymentsCount : {
                'value':'NA',
                'duration':'Last 24 hours'
            },
            cost : {
                'value': 'NA',
                'duration': 'Per Day',
                // 'status': 'good'
            },
            codeQuality : {
                'value': 'NA',
                // 'status': 'good'
            }
        }
        
    ];

    branches = [
        {
            title:'DEV',
            stage:'dev'
        },
        {
            title:'BRANCH1',
            stage:'dev'
        },
        {
            title:'BRANCH2',
            stage:'dev'
        },
        {
            title:'BRANCH3',
            stage:'dev'
        },
        {
            title:'BRANCH4',
            stage:'dev'
        },

        // {
        //     title:'BRANCH4',
        //     stage:'dev'
        // },
        // {
        //     title:'BRANCH4',
        //     stage:'dev'
        // },
        // {
        //     title:'BRANCH4',
        //     stage:'dev'
        // }
    ]

    openLink(link){
        if (link) {
            window.open(link, "_blank");
            
        }
    }

    stageClicked(stg){
        
            let url = '/services/' + this.service['id'] + '/' + stg
            this.router.navigateByUrl(url);
        
    }
    ValidURL(str) {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if(!regex .test(str)) {
          return false;
        } else {
          return true;
        }
      }

   
      loadPlaceholders()
      {
          
        if(this.service.tags != undefined) this.tags_temp=this.service.tags.join();
        this.desc_temp=this.service.description;
        this.email_temp=this.service.email;
        this.slackChannel_temp=this.service.slackChannel;
      }
      updateTags(){
          var payloag_tags;
        payloag_tags =this.tags_temp.split(',');
        payloag_tags.forEach(function(item,index){                
            payloag_tags[index]=item.trim(); 
        });
        this.update_payload.tags=payloag_tags;

      }

      onEditClick(){
          

       var email_temporary = this.email_temp;
        var slack_temporary = this.slackChannel_temp;
        this.check_empty_fields();
        if(this.service.status && this.service.status != 'deletion_completed' && this.service.status != 'deletion_started'){
        };
        if(!this.disp_show)
        {//set edit view to true ---> switch to edit mode
            this.disp_edit=false;
            this.disp_show=true;
            this.edit_save='SAVE';
            this.showCancel=true;
            this.loadPlaceholders();
             
        }
        else{//set display view to true ---> save and switch to view mode
            this.isLoadingService=true;            
            this.check_email_valid()
            this.validateChannelName();
             // var payload = {               
            //     "email": email_temporary || "",
            //     "slack_channel": slack_temporary || "",
            //     "tags": payloag_tags || "",
            //     "description": this.desc_temp  || ""
            // };

            this.http.put('/jazz/services/'+this.service.id, this.update_payload)
            .subscribe(
                (Response)=>{

                    this.service.description = this.desc_temp;
                    this.service.tags = this.tags_temp.split(',');
                    var this2=this;
                    this.service.tags.forEach(function(item,index){
                        this2.service.tags[index]=item.trim();
                    });
                    this.service.email = email_temporary;
                    this.service.slackChannel = slack_temporary;

                    this.isLoadingService=false;
                    this.disp_edit=true;
                    this.showCancel=false;
                    this.disp_show=false;
                    this.edit_save='EDIT';
                    let successMessage = this.toastmessage.successMessage(Response,"updateService");
                    this.toast_pop('success',"", "Data for service: "+this.service.name +" "+successMessage);
                    this.check_empty_fields();
                },
                (Error)=>{
                    this.isLoadingService=false; 
                    this.disp_edit=false;
                    this.disp_show=true;
                    this.edit_save='SAVE';
                    let errorMessage = this.toastmessage.errorMessage(Error,"updateService");
                    this.toast_pop('error', 'Oops!', errorMessage)
                    // this.toast_pop('error','Oops!', "Data cannot be updated. Service Error.");
                });
        }
    }

    onCancelClick()
    {
        this.update_payload={};
        this.disp_edit=true;
        this.disp_show=false;
        this.edit_save='EDIT';
        this.showCancel=false;
        this.hide_email_error= true;
        this.hide_slack_error = true;
        if(this.subscription!=undefined)
        this.subscription.unsubscribe();
        this.show_loader=false;
        this.disableSaveBtn();
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
    // testApi(type,stg){
    //     switch(type){
    //         case 'api':
    //         this.baseUrl="http://jazz-training-api-doc.s3-website-us-east-1.amazonaws.com"
    //         this.swaggerUrl = "http://editor.swagger.io/?url="+this.baseUrl+"/"+this.service.domain +"/"+ this.service.name +"/"+stg+"/swagger.json"
    //         window.open(this.swaggerUrl);
    //         // window.open('/test-api?service=' + this.service.name + '&domain='+ this.service.domain + '&env=' +stg);
    //                     break;

    //         case 'website' : window.open(this.service.endpoints[stg]);
    //                         break;
    //     }
    // }

    checkSlackNameAvailability()
    {

        this.validateChannelName();
        return;
    }

    check_email_valid()
    {
        var regex=/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        if(this.email_temp == '' || this.email_temp == null || this.email_temp == undefined)
        {
            this.hide_email_error = true;
            this.service.email=this.email_temp;
        }
        else
        {
            if(!regex.test(this.email_temp))//if it doesnt match with email pattern
            {
                this.hide_email_error=false;
               this.email_valid=false;
            }
            else//email matches
                {
                    this.hide_email_error=true;

                    // this.service.email=this.email_temp;
                    this.email_valid=true;

                }
        }
        
    }


    public validateChannelName() {

        
        this.show_loader=true;
        if(this.slackChannel_temp == '' || this.slackChannel_temp == null){
            
            this.hide_slack_error=true;
            this.show_loader=false;
        }

        else{
            if ( this.subscription ) {
                this.subscription.unsubscribe();
              }
              this.subscription = this.http.get('/platform/is-slack-channel-available?slack_channel='+this.slackChannel_temp)
            .subscribe(
                (Response) => {
                    let isAvailable = Response.data.is_available;
                    // this.response_json = Response;
                    // var output_body = JSON.parse(this.response_json._body);
                    // console.log(output_body);
                    // var is_slack_valid = output_body.data.is_available;
                    if(isAvailable)//if valid
                    {
                        this.hide_slack_error=true;
                        
                        // this.service.slackChannel=this.slackChannel_temp;

                    }
                    else
                    {
                        this.hide_slack_error=false;
                        
                    }
                    this.show_loader=false;
                },
                (error) => {
                    var err = error;
                    // console.log(err);
                    this.show_loader=false;

                }

            );
        }
        
     }

     disableSaveBtn(){

        if(!this.hide_slack_error){
            return true;
        }
        if(!this.hide_email_error){
            return true;
        }
        if(this.show_loader){
            return true;
        }
         return false;
     }

    slack_link(){

        if(this.service.slackChannel == '' || this.service.slackChannel == undefined)
        {
            //do nothing
        }
        else{
            this.slackChannel_link='https://t-mo.slack.com/messages/' + this.service.slackChannel;
            this.openLink(this.slackChannel_link);
        }
    }

    check_empty_fields()
    {
        if(this.service.description == undefined || this.service.description == null || this.service.description == '')
        {
            this.description_empty=true;
        }
        else{
            this.description_empty=false;
        }
        if(this.service.approvers == undefined || this.service.approvers == null || this.service.approvers == '')
        {
            this.approvers_empty=false;
        }
        if(this.service.domain == undefined || this.service.domain == null || this.service.domain == '')
        {
            this.domain_empty=true;
        }
        if(this.service.serviceType == undefined || this.service.serviceType == null || this.service.serviceType == '')
        {
            this.serviceType_empty=true;
        }
        if(this.service.email == undefined || this.service.email == null || this.service.email == '')
        {
            this.email_empty=true;
        }
        else{this.email_empty=false;this.email_temp=this.service.email}
        if(this.service.slackChannel == undefined || this.service.slackChannel == null || this.service.slackChannel == '')
        {
            this.slackChannel_empty=true;
        }
        else{ this.slackChannel_empty=false;this.slackChannel_temp=this.service.slackChannel }
        if(this.service.repository == undefined || this.service.repository == null || this.service.repository == '')
        {
            this.repository_empty=true;
        }
        if(this.service.runtime == undefined || this.service.runtime == null || this.service.runtime == '')
        {
            this.runtime_empty=true;
        }else{this.runtime_empty=false;}
        if(this.service.tags == undefined || this.service.tags == null || this.service.tags == '')
        {
            this.tags_empty=true;
        }
        else {
            this.tags_empty = false;
        }
    }

    serviceCreationStatus(){
        this.statusprogress = 20;
        this.creating = true;
        this.deleting = false;
        this.intervalSubscription = Observable.interval(5000)
        .switchMap((response) => this.http.get('/jazz/request-status?id='+this.service_request_id))
        .subscribe(
            response => {
                
                let dataResponse = <any>{};
                dataResponse.list = response;
                var respStatus = dataResponse.list.data;
                if(respStatus.status.toLowerCase() === 'completed'){
                    this.statusCompleted = true;
                    this.serviceStatusCompleted = true;
                    this.serviceStatusPermission = true;
                    this.serviceStatusRepo = true;
                    this.serviceStatusValidate = true;
                    this.statusInfo = 'Wrapping things up';
                    this.statusprogress = 100;
                    localStorage.removeItem('request_id'+"_"+this.service.name+"_"+this.service.domain);
                    // alert('last stage');
                    this.http.get('/jazz/services/'+this.service.id).subscribe(
                        (response) => {
                            this.serviceDetail.onDataFetched(response.data);
                        }
                    )
                    this.intervalSubscription.unsubscribe();
                    setTimeout(() => {
                        this.service_error = false;
                    }, 5000);
                }else if(respStatus.status.toLowerCase() === 'failed'){
                    this.statusCompleted = false;
                    this.statusFailed = true;
                    this.serviceStatusStarted = false;
                    this.serviceStatusStartedD = true;
                    this.serviceStatusCompletedD = true;
                    this.serviceStatusPermissionD = true;
                    this.serviceStatusRepoD = true;
                    this.serviceStatusValidateD = true;
                    this.statusInfo = 'Creation failed';
                    setTimeout(() => {
                        this.service_error = false;
                    }, 5000);

                } else {
                    this.statusCompleted = false;
                    respStatus.events.forEach(element => {
                        if( element.name === 'TRIGGER_FOLDERINDEX' && element.status === 'COMPLETED'){
                            this.serviceStatusCompleted = true;
                            this.statusInfo = 'Wrapping things up';
                            this.statusprogress = 100;
                            localStorage.removeItem('request_id'+this.service.name+this.service.domain);
                        } else if(element.name === 'ADD_WRITE_PERMISSIONS_TO_SERVICE_REPO' && element.status === 'COMPLETED'){
                            this.serviceStatusPermission = true;
                            this.statusInfo = 'Adding required permissions';
                            this.statusprogress = 85;
                        } else if(element.name === 'PUSH_TEMPLATE_TO_SERVICE_REPO' && element.status === 'COMPLETED'){
                            this.serviceStatusRepo = true;
                            this.statusInfo = 'Getting your code ready';
                            this.statusprogress = 60;
                        } else if(element.name === 'VALIDATE_INPUT' && element.status === 'COMPLETED'){
                            this.serviceStatusValidate = true;
                            this.statusInfo = 'Validating your request';
                            this.statusprogress = 35;
                        } else if(element.name === 'CALL_ONBOARDING_WORKFLOW' && element.status === 'COMPLETED'){
                            this.serviceStatusStarted = true;
                            this.statusInfo = 'Service Creation started';
                            this.statusprogress = 20;
                        }
                    });
                }
                document.getElementById('current-status-val').setAttribute("style","width:"+this.statusprogress+'%');
               
            },
            error => {
                
                this.service_error = false;
                this.serviceCreationStatus();
              }
        )
    }
    modifyEnvArr(){
        var j=0;
        var k=2;
        this.sortEnvArr();

        if(this.environ_arr!=undefined)
            for(var i=0;i<this.environ_arr.length;i++){
                this.environ_arr[i].status=this.environ_arr[i].status.replace("_"," ");
                // this.environ_arr[i].status=this.environ_arr[i].status.split(" ").join("\ n")
                if(this.environ_arr[i].logical_id == 'prd' || this.environ_arr[i].logical_id == 'prod'){
                    this.prodEnv=this.environ_arr[i];
                    continue;
                }
                if(this.environ_arr[i].logical_id == 'stg'){
                    this.stgEnv=this.environ_arr[i];
                    continue;
                }
                else
                {    this.Environments[j]=this.environ_arr[i];   
                    // console.log('--->><<---',this.environ_arr[i]);
                    this.envList[k++]=this.environ_arr[i].logical_id;             
                    j++;
                    
                }
            }

        if(this.Environments.length==0){
            this.noSubEnv=true;
        }
        if(this.prodEnv.logical_id==undefined){
            this.noProd=true;
        }
        if(this.stgEnv.logical_id==undefined){
            this.noStg=true;
        }

        this.cache.set('envList',this.envList);
       

    }
    
    sortEnvArr(){
        var j=0;
        var k=0;
        
        for(var i=0;i<this.environ_arr.length;i++){
            if(this.environ_arr[i].status != 'inactive'){
                this.list_env[j] = this.environ_arr[i];
                
                // this.list_env[i]
                j++;

            }
            if(this.environ_arr[i].status == 'inactive'){

                this.list_inactive_env[k] = this.environ_arr[i];
                k++;

            }
                
        }
        this.environ_arr = this.list_env.slice(0,this.list_env.length);

        this.environ_arr.push.apply(this.environ_arr,this.list_inactive_env);

      

        
    }
    getenvData(){
        this.isenvLoading=true;
        this.ErrEnv=false;
        if(this.service==undefined){return}
        // this.http.get('https://cloud-api.corporate.t-mobile.com/api/jazz/environments?domain=jazztesting&service=test-multienv').subscribe(            
        this.http.get('/jazz/environments?domain='+this.service.domain+'&service='+this.service.name).subscribe(
            response => {
                this.isenvLoading=false;
                  this.environ_arr=response.data.environment;
                  if(this.environ_arr!=undefined)    
                    if(this.environ_arr.length==0 || response.data==''){
                            this.noEnv=true;   
                    }             
                  this.ErrEnv=false;
                  
                //   var obj1={"service":"test-create","domain":"jazz-testing","last_updated":"2017-10-16T08:02:13:210","status":"active","created_by":"aanand12","physical_id":"master","created":"2017-10-16T08:02:13:210","id":"f7635ea9-26ad-0661-4e52-14fd48421e22","logical_id":"dev"}
                //   var obj2={"service":"test-create","domain":"jazz-testing","last_updated":"2017-10-16T08:02:13:210","status":"active","created_by":"aanand12","physical_id":"master","created":"2017-10-16T08:02:13:210","id":"f7635ea9-26ad-0661-4e52-14fd48421e22","logical_id":"feature"}
                //   var obj3={"service":"test-create","domain":"jazz-testing","last_updated":"2017-10-16T08:02:13:210","status":"active","created_by":"aanand12","physical_id":"master","created":"2017-10-16T08:02:13:210","id":"f7635ea9-26ad-0661-4e52-14fd48421e22","logical_id":"stg"}
                //   this.environ_arr[1]=obj1;
                //   this.environ_arr[2]=obj2;
                //   this.environ_arr[3]=obj3;
                  this.modifyEnvArr();
                  
              },
              err => {
                this.isenvLoading=false;
                
                  console.log('error',err);
                  this.ErrEnv=true;
                  if(err.status == 404) this.err404=true;
                  this.errMessage="Something went wrong while fetching your data";
                  this.errMessage=this.toastmessage.errorMessage(err,"environment");
                  var payload = {
                      "domain" : +this.service.domain,
                      "service" : this.service.name
                  }
                  this.getTime();
                  this.errorURL = window.location.href;
                  this.errorAPI = "https://cloud-api.corporate.t-mobile.com/api/jazz/environments";
                  this.errorRequest = payload;
                  this.errorUser = this.authenticationservice.getUserId();
                  this.errorResponse = JSON.parse(err._body);
    
                // let errorMessage=this.toastmessage.errorMessage(err,"serviceCost");
                // this.popToast('error', 'Oops!', errorMessage);
            })
        };
        getTime() {
            var now = new Date();
            this.errorTime = ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':'
            + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
            // console.log(this.errorTime);
          }
    
        feedbackRes:boolean=false;
        openModal:boolean=false;
        feedbackMsg:string='';
        feedbackResSuccess:boolean=false;
        feedbackResErr:boolean=false;
        isFeedback:boolean=false;
        toast:any;
        model:any={
            userFeedback : ''
        };
        buttonText:string='SUBMIT';
        isLoading:boolean=false;
        sjson:any={};
		djson:any={};
		// isLoading:boolean=false;
		reportIssue(){
			
					this.json = {
						"user_reported_issue" : this.model.userFeedback,
						"API": this.errorAPI,
						"REQUEST":this.errorRequest,
						"RESPONSE":this.errorResponse,
						"URL": this.errorURL,
						"TIME OF ERROR":this.errorTime,
						"LOGGED IN USER":this.errorUser
				}
				
					this.openModal=true;
					this.errorChecked=true;
					this.isLoading=false;
					this.errorInclude = JSON.stringify(this.djson);
					this.sjson = JSON.stringify(this.json);
				}
			
				openFeedbackForm(){
					this.isFeedback=true;
					this.model.userFeedback='';
					this.feedbackRes=false;
					this.feedbackResSuccess=false;
					this.feedbackResErr=false;
					this.isLoading = false;
					this.buttonText='SUBMIT';
				}
				mailTo(){
					location.href='mailto:serverless@t-mobile.com?subject=Jazz : Issue reported by'+" "+ this.authenticationservice.getUserId() +'&body='+this.sjson;
				}
				errorIncluded(){
				}
			 
				submitFeedback(action){
			
					this.errorChecked = (<HTMLInputElement>document.getElementById("checkbox-slack")).checked;
					if( this.errorChecked == true ){
						this.json = {
								"user_reported_issue" : this.model.userFeedback,
								"API": this.errorAPI,
								"REQUEST":this.errorRequest,
								"RESPONSE":this.errorResponse,
								"URL": this.errorURL,
								"TIME OF ERROR":this.errorTime,
								"LOGGED IN USER":this.errorUser
						}
					}else{
						this.json = this.model.userFeedback ;
					}
					this.sjson = JSON.stringify(this.json);
			
					this.isLoading = true;
			
					if(action == 'DONE'){
						this.openModal=false;
						return;
					}
			
					var payload={
						"title" : "Jazz: Issue reported by "+ this.authenticationservice.getUserId(),
						"project_id": "CAPI",
						"priority": "P4",
						"description": this.json,
						"created_by": this.authenticationservice.getUserId(),
						"issue_type" :"bug"
					}
					this.http.post('/platform/jira-issues', payload).subscribe(
						response => {
							this.buttonText='DONE';
							// console.log(response);
							this.isLoading = false;
							this.model.userFeedback='';
							var respData = response.data;
							this.feedbackRes = true;
							this.feedbackResSuccess= true;
							if(respData != undefined && respData != null && respData != ""){
								this.feedbackMsg = "Thanks for reporting the issue. We’ll use your input to improve Jazz experience for everyone!";
							} 
						},
						error => {
							this.buttonText='DONE';
							this.isLoading = false;
							this.feedbackResErr = true;
							this.feedbackRes = true;
							this.feedbackMsg = this.toastmessage.errorMessage(error, 'jiraTicket');
						  }
					);
				}
                ngOnInit() {
                    this.createloader = true;
                    if(this.service.status == "deletion completed" || this.service.status == "deletion started"){
                        this.showcanvas = true;
                    }else{
                        this.showcanvas = false;
                    }
                    this.showCancel=false;
            
                    if(this.service.status == 'creation started' || this.service.status == 'deletion started'){
                        try{
                            this.reqJson = JSON.parse(localStorage.getItem('request_id'+"_"+this.service.name+"_"+this.service.domain));
                            
                            this.service_request_id = this.reqJson.request_id;
                        }catch(e){console.log(e)}
                       
                    }else{
                        localStorage.removeItem('request_id'+"_"+this.service.name+"_"+this.service.domain);
                    }
                    this.creation_status = this.service.status;
                    this.animatingDots = "...";
                    this.testingStatus();
                }

    testingStatus(){
        setInterval(() => {
        this.onload.emit(this.service.status);
        },500);
        
    }

    ngOnChanges(x:any){
        this.prodEnv={};
        this.stgEnv={};
        if(this.service.domain!=undefined){
            this.getenvData();
            
        }
        
        
     
    this.check_empty_fields();

       setTimeout(() =>  {
           this.islink = this.ValidURL(this.service.repository);
           if(this.islink){
            this.bitbucketRepo = "View on Bitbucket";
            this.repositorylink = this.service.repository;
        } else if(this.service.repository === "[Archived]"){
            this.bitbucketRepo = "Archived";
            this.repositorylink = "";
        }
        }, 100);


        if(this.service.status == 'creation started' || this.service.status == 'deletion started'){
            try{
                this.reqJson = JSON.parse(localStorage.getItem('request_id'+"_"+this.service.name+"_"+this.service.domain));
                
                this.service_request_id = this.reqJson.request_id;
            }catch(e){console.log(e)}
           
        }else{
            localStorage.removeItem('request_id'+"_"+this.service.name+"_"+this.service.domain);
        }
        this.creation_status = this.service.status;
        this.animatingDots = "...";
        this.testingStatus();
        
        // request status api call
        if(this.service.status === 'creation started' && !this.serviceStatusCompleted && this.service_request_id != undefined){
            this.serviceCreationStatus();

        }else if(this.service.status === 'deletion started' && !this.serviceStatusCompleted){
            this.serviceDeletionStatus();
        }
    }
    ngOnDestroy() {
        //unsubscribe  request status api call
        if((this.service.status === 'creation started' || this.service.status === 'deletion started') && this.intervalSubscription){
          this.intervalSubscription.unsubscribe();
        }
    }


serviceDeletionStatus(){
    
    this.creating = false;
    this.deleting = true;
    
    this.intervalSubscription = Observable.interval(5000)
    .switchMap((response) => this.http.get('/jazz/request-status?id='+this.service_request_id))
    .subscribe(
        response => {
            this.createloader = false;
            // console.log("status = ", response);
            let dataResponse = <any>{};
            dataResponse.list = response;
            var respStatus = dataResponse.list.data;
            if(respStatus.status.toLowerCase() === 'completed'){
                this.statusCompleted = true;
                this.serviceStatusCompleted = true;
                this.serviceStatusPermission = true;
                this.serviceStatusRepo = true;
                this.serviceStatusValidate = true;  
                this.DelstatusInfo = 'Wrapping things up';
                this.statusprogress = 100;
                this.service.status ="deletion completed";
                localStorage.removeItem('request_id'+"_"+this.service.name+"_"+this.service.domain);
                setTimeout(() => {
                    this.service_error = false;
                    this.router.navigateByUrl('services');
                }, 5000);
                this.intervalSubscription.unsubscribe();
            }else if(respStatus.status.toLowerCase() === 'failed'){
                this.statusCompleted = false;
                this.statusFailed = true;
                this.serviceStatusStarted = false;
                this.serviceStatusStartedD = true;
                this.serviceStatusCompletedD = true;
                this.serviceStatusPermissionD = true;
                this.serviceStatusRepoD = true;
                this.serviceStatusValidateD = true;
                this.DelstatusInfo = 'Deletion failed';
                this.service.status ="deletion failed";
                setTimeout(() => {
                    this.service_error = false;
                }, 5000);
                // this.intervalSubscription.unsubscribe();
            } else {
                this.statusCompleted = false;
                respStatus.events.forEach(element => {
                    if(element.name === 'DELETE_PROJECT' && element.status === 'COMPLETED'){
                        this.serviceStatusPermission = true;
                        this.DelstatusInfo = 'Wrapping things up';
                        this.statusprogress = 100;
                        localStorage.removeItem('request_id'+this.service.name+this.service.domain);
                    } else if(element.name === 'BACKUP_PROJECT' && element.status === 'COMPLETED'){
                        this.serviceStatusRepo = true;
                        this.DelstatusInfo = 'Finishing up';8
                        this.statusprogress = 81;
                    } else if((element.name === 'UNDEPLOY_WEBSITE' && element.status === 'COMPLETED') && (this.service.serviceType == "website")){
                        this.serviceStatusValidate = true;
                        this.DelstatusInfo = 'Backing up code';
                        this.statusprogress = 48;
                    } else if((element.name === 'DELETE_API_DOC' && element.status === 'COMPLETED') && (this.service.serviceType == "api")){
                        this.serviceStatusValidate = true;
                        this.DelstatusInfo = 'Backing up code';
                        this.statusprogress = 48;
                    } else if((element.name === 'UNDEPLOY_LAMBDA' && element.status === 'COMPLETED') && (this.service.serviceType == "function")){
                        this.serviceStatusValidate = true;
                        this.DelstatusInfo = 'Backing up code';
                        this.statusprogress = 48;
                    } else if(element.name === 'CALL_DELETE_WORKFLOW' && element.status === 'COMPLETED'){
                        this.serviceStatusStarted = true;
                        this.DelstatusInfo = 'Deleting assets';
                        this.statusprogress = 20;
                    }
                });
            }
            document.getElementById('current-status-val').setAttribute("style","width:"+this.statusprogress+'%');
        },
        error => {
            if( error.status == "404"){
                this.statusCompleted = false;
                this.statusFailed = true;
                this.serviceStatusStarted = false;
                this.serviceStatusStartedD = true;
                this.serviceStatusCompletedD = true;
                this.serviceStatusPermissionD = true;
                this.serviceStatusRepoD = true;
                this.serviceStatusValidateD = true;
                setTimeout(() => {
                    this.service_error = false;
                }, 5000);
            }
            this.service_error = false;
            this.intervalSubscription.unsubscribe();
            // this.serviceDeletionStatus();
          }
    )
}

    public goToAbout(hash){
        this.router.navigateByUrl('landing');
        this.cache.set('scroll_flag',true);
        this.cache.set('scroll_id',hash);
    }
}
