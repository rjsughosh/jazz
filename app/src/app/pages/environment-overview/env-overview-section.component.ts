import { Component, OnInit, Input , OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { RequestService ,MessageService} from "../../core/services";
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService} from 'angular2-toaster';

import {DataCacheService , AuthenticationService } from '../../core/services/index';

@Component({
  selector: 'env-overview-section',
  templateUrl: './env-overview-section.component.html',
  providers: [RequestService,MessageService],
  styleUrls: ['./env-overview-section.component.scss']
})
export class EnvOverviewSectionComponent implements OnInit {
  
  @Output() onload:EventEmitter<any> = new EventEmitter<any>();
  @Output() envLoad:EventEmitter<any> = new EventEmitter<any>();
  @Output() open_sidebar:EventEmitter<any> = new EventEmitter<any>();

  
  private http:any;
  private sub:any;
  private env:any;
  branchname: any;
  friendlyChanged:boolean = false;
  tempFriendlyName:string;
  friendlyName : string;
  lastCommitted: any;
  editBtn:boolean = true;
  saveBtn:boolean = false;
  showCancel:boolean = false;
  environmnt:any;
  envResponseEmpty:boolean = false;
  envResponseTrue:boolean = false;
  envResponseError:boolean = false;
  isLoading: boolean = true;
  dayscommit: boolean = false;
  hourscommit: boolean = false;
  seccommit: boolean = false;
  mincommit: boolean = false;
  commitDiff: any;
  copylinkmsg = "COPY LINK TO CLIPBOARD";
  envstatus:any;
  status_val:number;
  errorTime:any;
	errorURL:any;
	errorAPI:any;
	errorRequest:any={};
	errorResponse:any={};
	errorUser:any;
	errorChecked:boolean=true;
	errorInclude:any="";
  json:any={};
  desc_temp:any;
  toastmessage:any;
  
  
  private subscription:any;

  @Input() service: any = {};
  
  temp_description:string;
put_payload:any = {};
  services = {
    description:'NA', 
    lastcommit:'NA',
    branchname:'NA',
    endpoint:'NA',
    repository:'NA',
    runtime:'NA',
    tags: 'NA'
  };
  endpList = [{
    name:'tmo-dev-ops',
    arn:'arn:test1',
    type:'Account',
  },
  {
    name:'tmo-dev-ops1',
    arn:'arn:test2',
    type:'region',
  },{
    name:'tmo-dev-ops2',
    arn:'arn:test3',
    type:'Account',
  },{
    name:'tmo-dev-ops3',
    arn:'arn:test4',
    type:'region',
  }
];
  constructor(
    private request:RequestService,
    private route: ActivatedRoute,
    private router: Router,
    private cache: DataCacheService,
    private toasterService: ToasterService,
    private messageservice:MessageService,


    private authenticationservice: AuthenticationService ,
  ) {
    this.http = request;
    this.toastmessage = messageservice;

   }
  //  prd?domain=jazz-testing&service=test-create

  disableEditBtn(){

  }

  onEditClick(){
    
    this.tempFriendlyName=this.friendlyName;
    this.showCancel=true;
    this.saveBtn=true;
    this.editBtn=false;

  }
  onSaveClick(){
    this.showCancel=false;
    this.saveBtn=false;
    this.editBtn=true;
    var errMsgBody;

    if(this.friendlyChanged){
      this.put_payload.friendly_name= this.tempFriendlyName;
      this.http.put('/jazz/environments/'+ this.env +'?domain=' + this.service.domain + '&service=' + this.service.name,this.put_payload)
            .subscribe(
                (Response)=>{
                  let successMessage = this.toastmessage.successMessage(Response,"updateEnv");
                  this.toast_pop('success',"",successMessage);

                  this.callServiceEnv();
                  this.tempFriendlyName='';
                },
                (error)=>{
                  try{
                    errMsgBody=JSON.parse(error._body);
                  }
                  catch(e){
                    // console.log('Error in parsing Json')
                  }
                  let errorMessage='';
                  if(errMsgBody!=undefined)
                    errorMessage = errMsgBody.message;
                  // let errorMessage = this.toastmessage.errorMessage(Error,"updateEnv");
                  this.toast_pop('error', 'Oops!', errorMessage)
                  this.callServiceEnv();

                }
              );
              this.isLoading=true;
              this.envResponseTrue=false;
              this.friendlyChanged=false;
              
    }
    
  }
  onCancelClick(){
    this.showCancel=false;
    this.saveBtn=false;
    this.editBtn=true;
    this.tempFriendlyName='';
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

  formatLastCommit(){
    
    var commit = this.lastCommitted.substring(0,19);
    var lastCommit = new Date(commit);
    var now = new Date(); 
    var todays = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            // var todays = new Date().UTC();
            // console.log('last commit from serv---',this.lastCommitted)
            // console.log('today-->',todays);
            // console.log('lastcommit in date',lastCommit);
            this.dayscommit = true;
            this.commitDiff = Math.floor(Math.abs((todays.getTime() - lastCommit.getTime())/(1000*60*60*24)));
            if( this.commitDiff == 0 ){
              this.dayscommit = false;
              this.hourscommit = true;
              this.commitDiff = Math.floor(Math.abs((todays.getHours() - lastCommit.getHours())));
              if( this.commitDiff == 0 ){
                this.dayscommit = false;
                this.hourscommit = false;
                this.mincommit = true;
                this.commitDiff = Math.floor(Math.abs((todays.getMinutes() - lastCommit.getMinutes())));
                if( this.commitDiff == 0 ){
                  this.dayscommit = false;
                  this.hourscommit = false;
                  this.mincommit = false;
                  this.seccommit = true;
                  this.commitDiff = "just now";
                }
              }
            }

  }
  openSidebar(){
    this.open_sidebar.emit(true);

}
   callServiceEnv() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
  this.onload.emit(this.environmnt.endpoint);
    this.subscription = this.http.get('/jazz/environments/'+ this.env +'?domain=' + this.service.domain + '&service=' + this.service.name).subscribe(
      // this.http.get('/jazz/environments/prd?domain=jazz-testing&service=test-create').subscribe(
        (response) => {
          // console.log('response :', response);

          if(response.data == (undefined || '')){
           
            this.envResponseEmpty = true; 
            this.isLoading = false;
          }else{
            // response.data.environment[0].status='deletion_started'
            this.onload.emit(response.data.environment[0].endpoint);
            this.envLoad.emit(response.data);
            this.environmnt=response.data.environment[0];
            this.cache.set('currentEnv',this.environmnt);
            this.status_val = parseInt(status[this.environmnt.status]);

            if(this.status_val <= 1) this.envstatus='Active';
            else if(this.status_val == 2 )this.envstatus='In Progress';
            else if(this.status_val > 2 )this.envstatus='Inactive';

           
            
            var envResponse = response.data.environment[0];
            this.friendlyName = envResponse.friendly_name
            this.branchname = envResponse.physical_id;
            this.lastCommitted = envResponse.last_updated;

            this.formatLastCommit();               
            
            this.envResponseTrue = true;
            this.envResponseEmpty = false;
            this.isLoading = false;
          }
        },
        (error) => {
          if( error.status == "404"){
            this.router.navigateByUrl('404');
          }
          this.envResponseTrue = false;
          this.envResponseError = true;
          this.envResponseEmpty = false;
          this.isLoading = false;
          var payload ={
            "service" : this.service.name,
            "domain" : this.service.domain,         }
          this.getTime();
          this.errorURL = window.location.href;
          this.errorAPI = "https://cloud-api.corporate.t-mobile.com/api/jazz/environment/"+this.env;
          this.errorRequest = payload;
          this.errorUser = this.authenticationservice.getUserId();
          this.errorResponse = JSON.parse(error._body);
  
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
    // isLoading:boolean=false;
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


   myFunction() {
    setTimeout( this.resetCopyValue(), 3000);
 }
 
 resetCopyValue(){
    this.copylinkmsg = "COPY LINK TO CLIPBOARD";
 }
 
 copyClipboard(copyapilinkid){
  var element = null; // Should be <textarea> or <input>
  element = document.getElementById(copyapilinkid);
  element.select();
  try {
      document.execCommand("copy");
      this.copylinkmsg = "LINK COPIED";
  }
  finally {
     document.getSelection().removeAllRanges;
  }
}
  ngOnInit() {  
    if(this.service.domain != undefined)  
      this.callServiceEnv();
   
  }

  ngOnChanges(x:any) {
    this.route.params.subscribe(
      params => {
      this.env = params.env;
    });
    this.environmnt={};
    if(this.service.domain != undefined)
      this.callServiceEnv();
}
notify(services){
  this.service=services;
 
  if(this.service.domain != undefined)
      {
        
        this.callServiceEnv();
      }
}
refreshCostData(event){ 
  this.callServiceEnv();
}

public goToAbout(hash){
	this.router.navigateByUrl('landing');
	this.cache.set('scroll_flag',true);
	this.cache.set('scroll_id',hash);
}
}

export enum status {
  "deployment_completed"=0,
  "active",
  "deployment_started" ,
  "pending_approval",
  "deployment_failed",
  "inactive",
  "deletion_started",
  "deletion_failed",
  "archived"
}
