import { Component, OnInit, Input } from '@angular/core';
import { RequestService , MessageService , AuthenticationService } from "../../core/services";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpModule } from '@angular/http';
import {DataCacheService } from '../../core/services/index';
import { Filter } from '../../secondary-components/jazz-table/jazz-filter';
import { Sort } from '../../secondary-components/jazz-table/jazz-table-sort';
import { ToasterService } from 'angular2-toaster';
declare var $:any;


@Component({
  selector: 'env-deployments-section',
  providers: [RequestService, MessageService],
  templateUrl: './env-deployments-section.component.html',
  styleUrls: ['./env-deployments-section.component.scss']
})
export class EnvDeploymentsSectionComponent implements OnInit {
  @Input() service: any = {};
  filterloglevel:string = 'INFO';
  loadingState:string='default';
  envObj:any;
  disableRetry:boolean = false;
  paginationSelected: Boolean = true;
	totalPagesTable: number = 1;
	prevActivePage: number = 1;
  limitValue : number = 10;
	offsetValue:number = 0;
  rowclick:boolean = false;
  retryBUTTON:boolean = true;
  rot_icon:boolean = true;
  rot_icon2:boolean = true;
  private toastmessage:any = '';
  envResponseEmpty:boolean = false;
  envResponseTrue:boolean = false;
  envResponseError:boolean = false;
	isLoading: boolean = true;
  private subscription:any;
  private http:any;
  environment_object:any;
  deployedList:any = [];
  deployments:any =[];
  time: any =[];
  errstatus:number;
  commitDetails:any = [];
  id:any=[];
  buildurl:any=[];
  time_date:any=[];
  time_time:any=[];
  deployment_id:any=[];
  length:any;
  status_val:number;
  status: any =[];
  buildNo:any =[];
  backupLogs:any=[];
  env: any;
  sort:any;
  filter:any;
  failed:boolean=false;
  success:boolean=false;
  errorTime:any;
	errorURL:any;
	errorAPI:any;
	errorRequest:any={};
	errorResponse:any={};
	errorUser:any;
	errorChecked:boolean=true;
	errorInclude:any="";
	json:any={};
  constructor(
    private request:RequestService,
    private route: ActivatedRoute,
		private router: Router,
    private cache: DataCacheService,
    private messageservice: MessageService,
    private toasterService: ToasterService,
    private authenticationservice: AuthenticationService ,
  ) {
      this.http = request;
      this.toastmessage = messageservice;
  }

  move_right:boolean=false;
  move_left:boolean = false;
  show_icon:boolean = true;
  hide_both:boolean = false;
  stageObj:any = [
    {
      stageNum: 'STAGE 1:',
      stage:'Pre-Build Validation',
      progress:'100%',
      status:'Complete'
    },
    {
      stageNum: 'STAGE 2:',
      stage:'Deployment to Dev Env',
      progress:'80%',
      status:'1min 33s' 
    },
    {
      stageNum: 'STAGE 3:',
      stage:'Deployment to Dev Env',
      progress:'10%',
      status:'2min 03s'
    },
  //   },
    {
      stageNum: 'STAGE 4:',
      stage:'Deployment to Dev Env',
      progress:'22%',
      status:'5min 41s'
    },  
    {
    stageNum: 'STAGE 5:',
    stage:'Deployment to Dev Env',
    progress:'22%',
    status:'5min 41s'
    }
  ];

  tableHeader2 = [
    {
      label: 'Build ID',
      key: 'buildNo',
      sort: true,
      filter: {
				type: 'dateRange'
			}     
    },
    {
      label: 'Commit Details',
      key: 'commitDetails',
      sort: true ,
      filter: {
				type: 'dateRange'
			}    
    },
    // {
    //   label: 'Id',
    //   key: 'id',
    //   sort: true ,
    //   filter: {
		// 		type: 'dateRange'
		// 	}         
    // },
    {
      label: 'Time',
      key: 'time',
      sort: true  ,
      filter: {
				type: 'dateRange'
			}        
    },
    {
      label: 'Status',
      key: 'status',
      sort: true  ,
      filter: {
				type: 'dateRange'
			}        
    },
    {
      label:"",
      key:"",
      sort: false ,
      filter: {
				type: 'dateRange'
			}    

    }
    
  ];

  move(dir)
  {
    if(dir=='right')
    {
      this.move_right=true;
      this.move_left=false;
      this.show_icon=false;
    }
    else
      {
        
      this.move_right=false;
      this.move_left=true;
      this.show_icon=true;
      }
  }
  getenv(obj){
    this.environment_object=obj;
  }

  idClicked(id){
    window.open(this.service.repository+'/commits/'+id)
  }

  widgetExpand()
  {
    if(this.rot_icon == true) 
    {
      this.rot_icon = false;
      this.hide_both = true;
      $("#slide-cover").slideUp();

    }
    else{
      this.rot_icon = true;
      $("#slide-cover").slideDown();
      setTimeout(() => {
        this.hide_both = false;
      }, 400);
      
    } 
   
  }

  // tableExpand()
  // {
  //   if(this.rot_icon2 == true) this.rot_icon2 = false;
  //   else this.rot_icon2 = true;
  //   $("#slid-table").slideToggle();
  // }



  onRowClicked()
  {
    // this.rowclick=true;
  }

  onFilter(column){
		// this.logs = this.logsData

		for (var i = 0; i < this.tableHeader2.length; i++) {
			var col = this.tableHeader2[i]
			if (col.filter != undefined && col.filter['_value'] != undefined) {
				if (col.filter['type'] == 'dateRange') {
					// code...
				} else{
					this.deployments  = this.filter.filterFunction(col.key , col.filter['_value'], this.deployments);
				}
			}
		}
	};

  onSort(sortData){
        var col = sortData.key;
        var reverse = false;
        if (sortData.reverse == true) {
          reverse = true;
        }
    
        this.deployments = this.sort.sortByColumn(col , reverse , function(x:any){return x;}, this.deployments);
      };

        onFilterSelected(filters){
          
              var filter ;
              if (filters[0]) {
                filter = filters[0];
              }
              this.filterloglevel=filter;
              this.offsetValue = 0;
              this.callServiceEnvdeployment();
              
            }
          

  callServiceEnvdeployment() {
    this.loadingState = 'loading';
    if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.http.get('/jazz/deployments?domain=' + this.service.domain + '&service=' + this.service.name + '&environment=' + this.env ).subscribe(
      (response) => {

        if((response.data == undefined) || (response.data.length == 0) || (response.data.deployments.length == 0 ) ){
          this.envResponseEmpty = true;
          this.isLoading = false;
					}else{
          this.envResponseEmpty = false;
          this.isLoading = false;
          this.envResponseTrue = true;
          this.deployments =  response.data.deployments;
          this.deployedList =  this.deployments;
          this.length =  this.deployments.length;
          for(var i=0 ; i<this.length ; i++){
            this.time[i] = this.deployments[i].created_time.slice(0,-4).replace("T"," ");
            this.status[i] = this.deployments[i].status;
            this.commitDetails[i] = this.deployments[i].scm_commit_hash;
            this.id[i] = this.deployments[i].deployment_id;
            this.buildNo[i] = this.deployments[i].provider_build_id;
            this.buildurl[i] = this.deployments[i].provider_build_url;
            this.deployment_id[i] = this.deployments[i].deployment_id;
            this.backupLogs = this.deployments
            this.sort = new Sort(this.deployments);
           }
           if(this.deployments.length !=0){
            var pageCount = response.data.count;
            // console.log("total count:"+pageCount);
            if(pageCount){
              this.totalPagesTable = Math.ceil(pageCount/this.limitValue);
            }
            else{
              this.totalPagesTable = 0;
            }
            this.backupLogs = this.deployments;
          }
          }
         },
        (error) => {
          
          this.errstatus=error.status;
    
          this.envResponseTrue = false;
          this.envResponseEmpty = false;
					this.isLoading = false;
          this.envResponseError = true;
          var payload ={
            "service" : this.service.name,
            "domain" : this.service.domain,
            "environment" : this.env
          }
          this.getTime();
          this.errorURL = window.location.href;
          this.errorAPI = "https://cloud-api.corporate.t-mobile.com/api/jazz/deployments";
          this.errorRequest = payload;
          this.errorUser = this.authenticationservice.getUserId();
          this.errorResponse = JSON.parse(error._body);
  
        
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
    

      openBuildUrl(url){
          window.open(url, '_blank');
      }

  ngOnInit() {

  }

  paginatePage(currentlyActivePage){
		if(this.prevActivePage != currentlyActivePage){
        this.prevActivePage = currentlyActivePage;
        this.deployments=[];
        this.offsetValue = (this.limitValue * (currentlyActivePage-1));
        this.callServiceEnvdeployment();
      }
	  }

  ngOnChanges(x:any) {
    this.envObj = this.cache.get('currentEnv');
    this.status_val = parseInt(status[this.envObj.status]); 

    if(this.envObj != undefined && this.status_val > 2){
      this.disableRetry=true;
    }

    this.route.params.subscribe(
      params => {
			this.env = params.env;
			if(this.env == "prd"){
				this.env = "prod";
      }
    });
    this.callServiceEnvdeployment();
    this.sort = new Sort(this.deployments);
    // console.log("sort : " ,  this.sort )
    this.loadingState = 'default';
    // console.log('service recieved in deployments',this.service);
}

refreshCostData(event){ 
  this.envResponseError = false;
  this.isLoading = true;

  this.callServiceEnvdeployment();
}
public goToAbout(hash){
	this.router.navigateByUrl('landing');
	this.cache.set('scroll_flag',true);
	this.cache.set('scroll_id',hash);
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

rebuild(event, id){
  
  this.rowclick = false;
  this.http.post('/jazz/deployments/'+id+'/re-build').subscribe(
    (response) => {

      let successMessage = this.toastmessage.successMessage(response, "retryDeploy");

      this.toast_pop('success',"",successMessage+this.service.name);
      // let successMessage = this.toastmessage.successMessage(response, "retryDeploy");
      // this.toast_pop('Deployment for service: ',this.service.name+' ',successMessage);
    },
    (error) => {
      let errorMessage = this.toastmessage.errorMessage(error, "updateObj");
      this.toast_pop('error', 'Oops!', errorMessage)
    })
    this.isLoading = true;
    this.callServiceEnvdeployment();
}


}
export enum status {
  "deployment_completed"=0,
  "active",
  "deployment_started" ,
  "deployment_failed",
  "pending_approval",
  "inactive",
  "deletion_started",
  "deletion_failed",
  "archived"
}
