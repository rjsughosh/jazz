import { Component, OnInit, ElementRef ,EventEmitter, Output, Inject, Input,ViewChild} from '@angular/core';
import { ToasterService} from 'angular2-toaster';
import { Filter } from '../../secondary-components/tmobile-table/tmobile-filter';
import { Sort } from '../../secondary-components/tmobile-table/tmobile-table-sort';
import { RequestService, MessageService , AuthenticationService } from '../../core/services/index';
import { Router } from '@angular/router';
import {DataCacheService } from '../../core/services/index';
import {FilterTagsComponent} from '../../secondary-components/filter-tags/filter-tags.component';
import {IonRangeSliderModule} from "ng2-ion-range-slider"



@Component({
  selector: 'service-cost',
  templateUrl: './service-cost.component.html',
  providers: [RequestService, MessageService],
  styleUrls: ['./service-cost.component.scss']
})
export class ServiceCostComponent implements OnInit {

	@Input() service: any = {};
	@ViewChild('sliderElement') sliderElement: IonRangeSliderModule;

	@ViewChild('filtertags') FilterTags: FilterTagsComponent;
	 private subscription:any;

	cost = {
		perYear: {
			value: '0.00',
			currency: '$',
			date:''
		},
		perDay: {
			value: '0.00',
			currency: '$',
			date:''
		},
		efficiency: '83',
		perWeek: {
			value: '0.00',
			currency: '$',
			date:''
		},
		perMonth: {
			value: '0.00',
			currency: '$',
			date:''
		}
	}

	methodList:Array<string>  = ['POST','GET','DELETE','PUT'];
	methodSelected:string = this.methodList[0];
	timerangeSelected:any;
	selectedTimeRange:any = 'Day';
	statisticSelected:any = 'Average';
	rangeList: Array<string> = ['Day', 'Week', 'Month', 'Year'];
	periodList: Array<string> = ['15 Minutes','1 Hour','6 Hours','1 Day','7 Days','30 Days'];
  
	statisticList: Array<string> = ['Average', 'Sum', 'Maximum','Minimum'];

	slider:any;
	sliderFrom = 1;
	sliderPercentFrom;
	sliderMax:number = 7;
	today = new Date();
	yesterday = this.today.setDate(this.today.getDate()-1);

	filtersList = ['Day', 'Week', 'Month', 'Year']
	selected=['Day']
	filter: any;
	sort: any;
	errBody: any;
	parsedErrBody: any;
	errMessage: any;
	errorTime:any;
	errorURL:any;
	errorAPI:any;
	errorRequest:any={};
	errorResponse:any={};
	errorUser:any;
	errorChecked:boolean=true;
	errorInclude:any="";
	json:any={};
	sjson:any={};
	djson:any={};
	environment = 'dev';
	environmentList = ['prod', 'stg'];
	filterSelected: boolean = false;
	private http:any;
	serviceCostList=[];

	env =this.environmentList[0];
	interval:any;
	start_date:any;
	isGraphLoading:boolean=true;
	isDataNotAvailable:boolean=false;
	noTotalCost:boolean=true;
	loadingState:string='default';
	

	private toastmessage:any;
	noYearlyCost:boolean=true;
	noDailyCost:boolean=true;

	costGraphData = {
		'filter': 'filter1',
		'environment': this.env
	}

	costTableData = {
		'filter': 'filter1',
		'environment': 'dev',
		'body': [
			{ column1: 'Data 1 row1', column2: 'Data 2 row1', column3: 'Data 3 row1', column4: 'Data 4 row1', column5: 'Data 5 row1'},
			{ column1: 'Data 1', column2: 'Data 2', column3: 'Data 3', column4: 'Data 4', column5: 'Data 5'},
			{ column1: 'Data 1', column2: 'Data 2', column3: 'Data 3', column4: 'Data 4', column5: 'Data 5'},
			{ column1: 'Data 1 row4', column2: 'Data 2 row4', column3: 'Data 3 row4', column4: 'Data 4 row4', column5: 'Data 5 row4'},
			{ column1: 'Data 1', column2: 'Data 2', column3: 'Data 3', column4: 'Data 4', column5: 'Data5'}
		],
		'header': [
			{"label" : "Column 1","key" : "column1"},
			{"label" : "Column 2","key" : "column2"},
			{"label" : "Column 3","key" : "column3"},
			{"label" : "Column 4","key" : "column4"},
			{"label" : "Column 5","key" : "column5"}
		]
	}



	constructor( @Inject(ElementRef) elementRef: ElementRef, private cache: DataCacheService , private authenticationservice: AuthenticationService , private request: RequestService, private messageservice: MessageService, private toasterService: ToasterService,private router: Router) {

		var el:HTMLElement = elementRef.nativeElement;
    	this.root = el;
		this.toasterService = toasterService;
		this.http = request;
		this.toastmessage=messageservice;
	}

	accList=['tmodevops','tmonpe'];
  regList=['us-west-2', 'us-east-1'];
	accSelected:string = 'tmodevops';
  regSelected:string = 'us-west-2';
  
   onaccSelected(event){
    this.FilterTags.notify('filter-Account',event);
    this.accSelected=event;

   }
	onregSelected(event){
    this.FilterTags.notify('filter-Region',event);
    this.regSelected=event;
   }
	ngOnChanges(x:any){
		this.fetchEnvlist();

	}
	getStartDate(filter, sliderFrom){
		var todayDate = new Date();
		switch(filter){
		  case "Day":
			this.sliderMax = 7;
			var resetdate = new Date(todayDate.setDate(todayDate.getDate()-sliderFrom)).toISOString();
			break;
		  case "Week":
			this.sliderMax = 5;
			var  resetdate = new Date(todayDate.setDate(todayDate.getDate()-(sliderFrom*7))).toISOString();
			break;
		  case "Month":
			this.sliderMax = 12;
			var currentMonth = new Date ((todayDate).toISOString()).getMonth();
			var currentDay = new Date((todayDate).toISOString()).getDate();
			currentMonth++;
			var currentYear = new Date ((todayDate).toISOString()).getFullYear();
			var diffMonth = currentMonth - sliderFrom;
			// console.log(todayDate,todayDate.getMonth());
			if(diffMonth>0){
			  var resetYear = currentYear;
			  var resetMonth = diffMonth;
			} else if(diffMonth===0){
			  var resetYear = currentYear-1;
			  var resetMonth = 12;
			} else if(diffMonth<0){
			  var resetYear = currentYear - 1;
			  // var resetMonth = sliderFrom - currentMonth;
			  var resetMonth = 12 + diffMonth;
			}
			if(currentDay==31)currentDay=30;
			var newStartDateString = resetYear + "-" + resetMonth + "-" + currentDay + " 00:00:00"
			var newStartDate = new Date(newStartDateString);
			var resetdate = newStartDate.toISOString();
			break;
		  case "Year":
			this.sliderMax = 6;
			var currentYear = new Date((todayDate).toISOString()).getFullYear();
			var newStartDateString = (currentYear - sliderFrom).toString() + "/" + "1" + "/" + "1";
			var newStartDate = new Date(newStartDateString);
			var resetdate = newStartDate.toISOString();
			break;
		}
		// console.log(newStartDateString);
		return resetdate;
	  }
	// onEnvSelected(env){
		// console.log('onEnvSelected',env);
		// this.isDataNotAvailable=false;
		// this.isGraphLoading=true;
		
	onEnvSelected(envt){
		this.FilterTags.notify('filter-Env',envt);
		this.costGraphData.environment=envt;
		var env_list=this.cache.get('envList');
		var fName = env_list.friendly_name;
		var index = fName.indexOf(envt);
		var env = env_list.env[index];
		this.env = env;
		this.collectInputData(env);
	}

	onRowClicked(row){
		// console.log('onRowClicked',row);
	}
	cancelFilter(event){
		switch(event){
		  case 'time-range':{this.onRangeListSelected('Day'); 
			break;
		  }
		  case 'time-range-slider':{this.getRangefunc(1);
		  
			break;
		  }
		  case 'period':{ this.onPeriodSelected('15 Minutes');
			break;
		  }
		  case 'statistic':{      this.onStatisticSelected('Average');
		  
			break;
		  }
		  case 'account':{      this.onaccSelected('Acc 1');
		  
			break;
		  }
		  case 'region':{      this.onregSelected('reg 1');
		  
			break;
		  }
		  case 'env':{      this.onEnvSelected('prod');
		  
			break;
		  }
		  case 'method':{      this.onMethodListSelected('POST');
		  
			break;
		  }
		  case 'all':{ this.onRangeListSelected('Day');    
		  this.onPeriodSelected('15 Minutes');
		  this.onStatisticSelected('Average');
		  this.onaccSelected('Acc 1');
		  this.onregSelected('reg 1');
		  this.onEnvSelected('prod');
		  this.onMethodListSelected('POST');
			break;
		  }
		}
	   
		// this.getRange(1);
	
	  }
	  onMethodListSelected(method){

		this.FilterTags.notify('filter-Method',method);
	
		this.methodSelected=method;
	  }
	
	  onPeriodSelected(period){
		// console.log('#$@#$$@#@#$#$',this.FilterTags);;
		this.FilterTags.notify('filter-Period',period);
		// this.cache.set('filter-Period',period);
	  }
	
	  sendDefaults(range){
		switch(range){
			case 'Day':{     this.FilterTags.notify('filter-Period','15 Minutes')
				break;
			}
			case 'Week':{   this.FilterTags.notify('filter-Period','1 Hour')
				break;
			}
			case 'Month':{ 
			   this.FilterTags.notify('filter-Period','6 Hours')
				break;
			}
			case 'Year':{   this.FilterTags.notify('filter-Period','7 Days')
				break;
			}
		}
	} 
	  onRangeListSelected(range){
		this.FilterTags.notify('filter-TimeRange',range);
		this.sendDefaults(range);
		
		// this.cache.set('filter-TimeRange',range);
		this.timerangeSelected=range;
		this.sliderFrom =1;
		this.FilterTags.notify('filter-TimeRangeSlider',this.sliderFrom);
		
		var resetdate = this.getStartDate(range, this.sliderFrom);
		this.selectedTimeRange = range;
	  }
	
	  
	
	  onStatisticSelected(statistics){
		// this.payload.statistics = statistics;
		this.FilterTags.notify('filter-Statistic',statistics);
		
		// this.cache.set('filter-Statistic',statistics);
		this.statisticSelected = statistics;
	  }
	
	 
	
  onServiceSearch(searchString){
  	// console.log("onServiceSearch", searchString)
    this.costTableData.body  = this.filter.searchFunction("any" , searchString);
  };
	root:any;


	popToast(type, title, message) {
		var tst = document.getElementById('toast-container');
        tst.classList.add('toaster-anim'); 
		
	  this.toasterService.pop(type, title, message);
	  setTimeout(() => {
		tst.classList.remove('toaster-anim');
	  }, 7000);
  }
  getRangefunc(e){
    
    this.FilterTags.notify('filter-TimeRangeSlider',e);
    
    this.sliderFrom=1;
    this.sliderPercentFrom=1;
    var resetdate = this.getStartDate(this.selectedTimeRange, this.sliderFrom);
    
    
  }
  getRange(e){
    this.FilterTags.notify('filter-TimeRangeSlider',e.from);
    
    this.sliderFrom =e.from;
    this.sliderPercentFrom=e.from_percent;
    var resetdate = this.getStartDate(this.selectedTimeRange, this.sliderFrom);
	
}
  onClickFilter(){
    
    //ng2-ion-range-slider
      
    var slider = document.getElementById('sliderElement');
    
    slider.getElementsByClassName('irs-line-mid')[0].setAttribute('style','border-radius:10px;')
    slider.getElementsByClassName('irs-bar-edge')[0].setAttribute('style',' background: none;background-color: #ed008c;border-bottom-left-radius:10px;border-top-left-radius:10px;width: 10px;');
    slider.getElementsByClassName('irs-single')[0].setAttribute('style',' background: none;background-color: #ed008c;left:'+this.sliderPercentFrom+'%');
    slider.getElementsByClassName('irs-bar')[0].setAttribute('style',' background: none;left:10px;background-color: #ed008c;width:'+this.sliderPercentFrom+'%');
    slider.getElementsByClassName('irs-slider single')[0].setAttribute('style','width: 20px;top: 20px;height: 20px;border-radius: 50%;cursor:pointer;background: none; background-color: #fff;left:'+this.sliderPercentFrom+'%');
    slider.getElementsByClassName('irs-max')[0].setAttribute('style','background: none');
    slider.getElementsByClassName('irs-min')[0].setAttribute('style','background: none');
    
  }
  processServiceList(serviceCost,serviceInput){
	if (serviceCost === undefined || serviceCost.cost.length === undefined) {
		return [];
	}
	let _serviceCostList = [];

	serviceCost.cost.forEach(function _processassets(eachCostObj){
		var monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug", "Sep", "Oct","Nov","Dec"];
		var modifiedkey = eachCostObj.key;
		modifiedkey = modifiedkey.replace(/[-]/g, '/');
		var eachDate=new Date(modifiedkey);
		var monthIndex=eachDate.getMonth();
		let graphDataDate="";
		switch(serviceInput.interval){
		case "Daily":
		 graphDataDate=monthName[monthIndex]+" "+eachDate.getDate();
		  break;
		case "Weekly":
		 graphDataDate=monthName[monthIndex]+" "+eachDate.getDate();
		  break;
		case "Monthly":
		 graphDataDate=monthName[monthIndex];
		  break;
		case "Yearly":
		 graphDataDate=eachDate.getFullYear().toString();
		  break;
		}

		let serviceRow = {
			date: graphDataDate,
			cost: eachCostObj.cost.toFixed(5)
		};
		_serviceCostList.push(serviceRow);

	});

    return _serviceCostList;
  	}

  	fetchServices(inputParams){
		var payload = {
			"start_date": inputParams[0].startDate,
			"end_date": new Date().toISOString().substring(0,10),
			"service": this.service.name || "events",
			"environments":[inputParams[0].env],
			"domain":this.service.domain || "platform",
			"interval": inputParams[0].setInterval,
			"group_by":["environments"]
		};
  		//TODO: Remove call to dev after TECH training
		  	 if ( this.subscription ) {
      this.subscription.unsubscribe();
    }
		this.subscription = this.http.post('/jazz/service-cost', payload).subscribe(
      	response => {
          //Bind to view
		  let serviceCost = response.data;
			let serviceInput = response.input;
			
			// console.log("serviceCost response:",serviceCost);
			if(serviceCost.totalCostDay !== "" && serviceCost.totalCostMonth !== "" && serviceCost.totalCostWeek !== "" && serviceCost.totalCostYear !== "" && serviceCost.totalCostDay !== undefined && serviceCost.totalCostMonth !== undefined && serviceCost.totalCostWeek !== undefined && serviceCost.totalCostYear !== undefined){
				this.cost.perDay.value = serviceCost.totalCostDay.cost.toFixed(2).toString();
				this.cost.perDay.date = serviceCost.totalCostDay.key.substring(0,10);;
				this.cost.perWeek.value = serviceCost.totalCostWeek.cost.toFixed(2).toString();
				this.cost.perWeek.date = serviceCost.totalCostWeek.key.substring(0,10);;
				this.cost.perMonth.value = serviceCost.totalCostMonth.cost.toFixed(2).toString();
				this.cost.perMonth.date = serviceCost.totalCostMonth.key.substring(0,10);;
				this.cost.perYear.value = serviceCost.totalCostYear.cost.toFixed(2).toString();
				this.cost.perYear.date = serviceCost.totalCostYear.key.substring(0,4);
				this.noTotalCost = false;
			} else {
				this.noTotalCost = true;
			}
          if (serviceCost !== undefined && serviceCost.cost.length !== 0 ) {
			  this.noTotalCost = false;
			  

			this.serviceCostList = this.processServiceList(serviceCost, serviceInput);
			this.isGraphLoading=false;
			this.isDataNotAvailable=false;
			this.loadingState = 'default';
          } else if(serviceCost.cost.length === 0 ){
			this.noTotalCost = true;
			this.isGraphLoading=false;
			this.isDataNotAvailable=true;
			this.loadingState = 'default';
          } else{
			this.noTotalCost = true;
			this.isGraphLoading=true;
		  }
        },
        err => {
			this.noTotalCost = true;
			// this.isDataNotAvailable=true;
			this.isGraphLoading=false;
			// Log errors if any
			this.loadingState = 'error';
			this.errBody = err._body;
			
            this.errMessage = this.toastmessage.errorMessage(err,"serviceCost"); 
            try {
				this.parsedErrBody = JSON.parse(this.errBody);
				if(this.parsedErrBody.message != undefined && this.parsedErrBody.message != '' ) {
				  this.errMessage = this.parsedErrBody.message;
				}
			  } catch(e) {
				//   console.log('JSON Parse Error', e);
			  }
			  this.getTime();
			  this.errorURL = window.location.href;
			  this.errorAPI = "https://cloud-api.corporate.t-mobile.com/api/jazz/service-cost";
			  this.errorRequest = payload;
			  this.errorUser = this.authenticationservice.getUserId();
			  this.errorResponse = JSON.parse(err._body);

			// let errorMessage=this.toastmessage.errorMessage(err,"serviceCost");
            // this.popToast('error', 'Oops!', errorMessage);
		})
	};
	refreshCostData(event){
		this.isGraphLoading=true;
		this.isDataNotAvailable=false;
		this.loadingState = 'default';
		this.fetchGraphData('Day');
	}

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
	reportIssue(){

		// this.json = this.model.userFeedback ;

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
		this.filter = new Filter(this.costTableData.body);
		this.sort = new Sort(this.costTableData.body);
		// Draw graph for for day interval on init
		// this.dayCost();
		// this.yearlyCost();
		this.fetchGraphData("Day");
	}
	collectInputData(input){
		this.isDataNotAvailable=false;
		this.loadingState = 'default';
		this.isGraphLoading=true;

		//collect data from filter and dropdown onchange
		var filteredData=[];
		if(input!=undefined && input=="dev" || input =="stg"||input == "prod"){
			this.env = input;
		} else{
			this.start_date = input[0].start_date;
			this.interval = input[0].interval;
		}
		let dataCollect={
			env : this.env,
			startDate : this.start_date,
			setInterval : this.interval
		}
		filteredData.push(dataCollect);
		this.fetchServices(filteredData);
	}

    fetchGraphData(range){
		//Based on filter selected geerate start date and interval params for payload
		// this.isDataNotAvailable=false;
		// this.isGraphLoading=true;
		var graphDataInterval =[];
		var todayDate = new Date();
		var graphDataList = ["Daily", "Weekly", "Monthly",  "Yearly"];
		switch(range){
			case "Day":
			var resetdate = new Date(todayDate.setDate(todayDate.getDate()-6)).toISOString().substring(0, 10);
			var filteredData={
					start_date: resetdate,
					interval:graphDataList[0]
				}
				graphDataInterval.push(filteredData);
				break;

			case "Week":
			var  resetdate = new Date(todayDate.setDate(todayDate.getDate()-(7*6))).toISOString().substring(0, 10);
			var filteredData={
					start_date: resetdate,
					interval:graphDataList[1]
				}
				graphDataInterval.push(filteredData);
				break;

			case "Month":
			var currentMonth = new Date ((todayDate).toISOString().substring(0, 10)).getMonth();
			var currentYear = new Date ((todayDate).toISOString().substring(0, 10)).getFullYear();
			if(++currentMonth>6){
				var resetMonth = (currentMonth) - 6;
				var resetYear = currentYear;
			} else{
				var resetMonth= (currentMonth) + 6;
				var resetyear = --currentYear;
			}
			var resetdate = ""+resetYear+"-"+resetMonth+"-01 00:00:00"
				var filteredData={
					start_date: resetdate,
					interval: graphDataList[2]
				}
				graphDataInterval.push(filteredData);
				break;

			case "Year":
				var currentYear = new Date((todayDate).toISOString().substring(0, 10)).getFullYear();
				var resetdate = ""+(currentYear-6)+"-01-01"+" "+"00:00:00";
				var filteredData={
					start_date: resetdate,
					interval: graphDataList[3]
				}
				graphDataInterval.push(filteredData);
				break;
		}
		this.collectInputData(graphDataInterval);
  }
  public goToAbout(hash){
		  this.router.navigateByUrl('landing');
		  this.cache.set('scroll_flag',true);
		  this.cache.set('scroll_id',hash);
	}
		
		
	fetchEnvlist(){
		var env_list=this.cache.get('envList');
		if(env_list != undefined){
		  this.environmentList=env_list.friendly_name;
		}
	
	  }
	 

  onTypeSelected(event){}

	onFilterSelected(filters){
		var filter ;
		if (filters[0]) {
			filter = filters[0];
		}
			this.fetchGraphData(filter);
	}

}
