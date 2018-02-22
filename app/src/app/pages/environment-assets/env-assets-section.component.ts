import { Component, OnInit, Input , ViewChild } from '@angular/core';
import { RequestService } from "../../core/services";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpModule } from '@angular/http';
import {DataCacheService , AuthenticationService } from '../../core/services/index';
import {FilterTagsComponent} from '../../secondary-components/filter-tags/filter-tags.component';


@Component({
  selector: 'env-assets-section',
	templateUrl: './env-assets-section.component.html',
	providers: [RequestService],
  styleUrls: ['./env-assets-section.component.scss']
})
export class EnvAssetsSectionComponent implements OnInit {
	private env:any;
	private http:any;
	private subscription:any;
	@ViewChild('filtertags') FilterTags: FilterTagsComponent;

	assetsList: any = [];
	
	accList=['tmodevops','tmonpe'];
  regList=['us-west-2', 'us-east-1'];
	accSelected:string = 'tmodevops';
  regSelected:string = 'us-west-2';
	type: any = [];
	
	length: any;
	// image: any = [];
	slNumber: any = [];
	serviceName: any = [];
	domain: any = [];
	arn: any = [];
	Provider: any = [];
	status: any = [];
	time: any = [];
	url : any = [];
	endpoint : any = [];
	envResponseEmpty:boolean = false;
  envResponseTrue:boolean = false;
  envResponseError:boolean = false;
	isLoading: boolean = true;
	errorTime:any;
	errorURL:any;
	errorAPI:any;
	errorRequest:any={};
	errorResponse:any={};
	errorUser:any;
	errorChecked:boolean=true;
	errorInclude:any="";
	json:any={};
	toastmessage:any;
	dayscommit: boolean = false;
	hourscommit: boolean = false;
	seccommit: boolean = false;
	mincommit: boolean = false;
	commitDiff: any=[];
	lastCommitted: any;
	islink:boolean = false;
	count: any = [];


  @Input() service: any = {};

  constructor(
		private request:RequestService,
		private route: ActivatedRoute,
		private router: Router,
		private cache: DataCacheService,
		private authenticationservice: AuthenticationService ,
		
  ) {
    this.http = request;
   }

 
  
   onaccSelected(event){
    this.FilterTags.notify('filter-Account',event);
    this.accSelected=event;

   }
	onregSelected(event){
    this.FilterTags.notify('filter-Region',event);
    this.regSelected=event;
   }

   cancelFilter(event){
	console.log('event',event);
	switch(event){
		
		case 'account':{this.onaccSelected('Acc 1');
	
		break;
		}
		case 'region':{this.onregSelected('reg 1');
	
		break;
		}
		
			
		case 'all':{ 
		this.onaccSelected('Acc 1');   
		this.onregSelected('reg 1');
		  break;
		}
	  }
}
	callServiceEnvAssets() {
    if ( this.subscription ) {
      this.subscription.unsubscribe();
		}
				var payload = {
				service: this.service.name,
				domain: this.service.domain,
				environment: this.env
				};
				this.subscription = this.http.post('https://cloud-api.corporate.t-mobile.com/api/jazz/assets/search', payload).subscribe(
					// this.subscription = this.http.get('https://api.myjson.com/bins/16ydw5').subscribe(

      // this.subscription = this.http.get('/jazz/assets/environments/'+ this.env +'?domain=' + this.service.domain + '&service=' + this.service.name).subscribe(
        (response) => {
					// console.log("response  = ",response);
					// console.log("response data  = ",response.data);
					if((response.data == undefined) || (response.data.length == 0)){
            this.envResponseEmpty = true;
						this.isLoading = false;
					}
					else
					{
					this.envResponseEmpty = false;
					this.isLoading = false;
					this.envResponseTrue = true;
					this.length = response.data.length;
					this.assetsList = response.data;
					for(var i=0; i < this.length ; i++){
						this.type[i] = response.data[i].type;
						
						this.slNumber[i] = (i+1);
						if( response.data[i].provider == undefined ){
							this.Provider[i] = "-"
						}else{
						this.Provider[i] = response.data[i].provider;
						}
						if( response.data[i].status == undefined ){
							this.status[i] = "-"
						}else{
						this.status[i] = response.data[i].status;
						}
						if( response.data[i].endpoint_url == undefined ){
							this.endpoint[i] = "-"
						}else{
						this.endpoint[i] = response.data[i].endpoint_url;;
						}
						if( response.data[i].swagger_url == undefined ){
							this.url[i] = "-"
						}else{
						this.url[i] = response.data[i].swagger_url;
						}
						if( response.data[i].provider_id == undefined ){
							this.arn[i] = "-"
						}else{
						this.arn[i] = response.data[i].provider_id;
						}
	 
	
						this.lastCommitted = response.data[i].timestamp;
						var commit = this.lastCommitted.substring(0,19);
						var lastCommit = new Date(commit);						
						var now = new Date();
						var todays = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

						this.count[i] = 3;
						this.commitDiff[i] = Math.floor(Math.abs((todays.getTime() - lastCommit.getTime())/(1000*60*60*24)));
						if( this.commitDiff[i] > 30){
							this.count[i] = 4;
							this.commitDiff[i] = Math.floor(this.commitDiff[i]/30)
						}else
						if( this.commitDiff[i] == 0 ){
							this.count[i] = 2;
							this.commitDiff[i] = Math.floor(Math.abs((todays.getHours() - lastCommit.getHours())));
						  if( this.commitDiff[i] == 0 ){
							this.count[i] = 1;
							this.commitDiff[i] = Math.floor(Math.abs((todays.getMinutes() - lastCommit.getMinutes())));
							if( this.commitDiff[i] == 0 ){
								this.count[i] = 0;
							  this.commitDiff[i] = "Just now";
							}
						  }
						}
						
						}
						

					}
        },
        (error) => {
					this.envResponseTrue = false;
          this.envResponseEmpty = false;
					this.isLoading = false;
					this.envResponseError = true;
          this.getTime();
					this.errorURL = window.location.href;
					this.errorAPI = "https://cloud-api.corporate.t-mobile.com/api/jazz/assets/search";
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

     redirect(url){
		//  console.log("url = ",url)
		 window.open(url , '_blank');
	 }
	 
	 ngOnInit() {
		// this.callServiceEnvAssets() 
		// let cachedData = this.cache.get(this.model.username);
	}
	
	ngOnChanges(x:any) {
    this.route.params.subscribe(
      params => {
			this.env = params.env;
			if(this.env == "prd"){
				this.env = "prod";
			}
    });
    this.callServiceEnvAssets();
}

refreshCostData(event){ 
  this.callServiceEnvAssets();
}
public goToAbout(hash){
	this.router.navigateByUrl('landing');
	this.cache.set('scroll_flag',true);
	this.cache.set('scroll_id',hash);
}

}
