/**
  * @type Component
  * @desc create service component
  * @author
*/


import { Http, Headers, Response } from '@angular/http';
import { Component, Input, OnInit, Output, EventEmitter, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { FORM_DIRECTIVES, ControlGroup, Control, Validators, FormBuilder, Validator, } from '@angular/common';
import { ServiceFormData, RateExpression, CronObject, EventExpression } from './../service-form-data';
import { FocusDirective } from './../focus.directive';
import { CronParserService } from '../../../core/helpers';
import { ToasterService } from 'angular2-toaster';
import { RequestService, DataCacheService, MessageService, AuthenticationService } from "../../../core/services";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { ServicesListComponent } from "../../../pages/services-list/services-list.component"
import {environment} from "../../../../environments/environment";
import { MyFilterPipe } from "../../../primary-components/custom-filter";

@Component({
  selector: 'create-service',
  templateUrl: './create-service.component.html',
  providers: [RequestService, MessageService,  MyFilterPipe],
  styleUrls: ['./create-service.component.scss']
})


export class CreateServiceComponent implements OnInit {

  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();


  public buildEnvironment = environment;
  typeOfService: string = "api";
  typeOfPlatform: string = "aws";
  disablePlatform = true;
  selected: string = "Minutes";
  runtime: string = 'nodejs8.10';
  eventSchedule: string = 'fixedRate';
  private slackSelected: boolean = false;
  private createslackSelected: boolean = false;
  private ttlSelected: boolean = false;
  showApproversList: boolean = false;
  showApplicationList:boolean = false;
  approverName: string;
  slackName: string;
  approversPlaceHolder : string = "Start typing (min 3 chars)...";
  currentUserSlack: boolean = false;
  git_clone: boolean = false;
  git_url: string = "";
  git_private: boolean = false;
  git_creds: any = {};
  git_username: string = "";
  git_pwd: string = "";
  selApprover: any = [];
  appIndex: any;
  git_err: boolean = false;
  enableAppInput:boolean = false;
  slackUsersList : any;
  approversList: any;
  approversListShow: any;
  approversListBasic: any;
  slackAvailble: boolean = false;
  slackNotAvailble: boolean = false;
  channelNameError: boolean = false;
  showLoader: boolean = false;
  showSlackList: boolean = false;
  showRegionList:boolean = false;
  showAccountList:boolean = false;
  oneSelected:boolean=false;


  isLoading: boolean = false;
  slackChannelLoader: boolean = false;
  serviceAvailable: boolean = false;
  serviceNotAvailable: boolean = false;
  serviceNameError: boolean = false;
  isDomainDefined: boolean = false;
  invalidttl: boolean = false;
  serviceRequested = false;
  serviceRequestFailure = false;
  serviceRequestSuccess = false;
  vpcdisable: boolean = false;
  serviceLink: string;
  Currentinterval: string = 'Minutes';
  rateExpressionIsValid: boolean = false;
  isLoadingNewSlack: boolean = false;
  rateExpressionError: string = '';
  cronFieldValidity: any;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  submitted = false;
  vpcSelected: boolean = false;
  publicSelected: boolean = false;
  resMessage: string = '';
  cdnConfigSelected: boolean = true;
  focusindex: any = -1;
  scrollList: any = '';
  toast: any;
  start: number = 0;
  gitCloneSelected: boolean = false;
  gitprivateSelected: boolean = false;
  //   model: any = {
  //     gitRepo: '',
  // };
  applications:any;
  application_arr=[];
  gitRepo: any = '';
  gitusername: any = '';
  gituserpwd: any = '';
  createSlackModel: any = {
    name: '',
    purpose: '',
    invites: ''
  };


  model = new ServiceFormData('', '', '', '', '', '');
  cronObj = new CronObject('0/5', '*', '*', '*', '?', '*')
  rateExpression = new RateExpression(undefined, undefined, 'none', '5', this.selected, '');
  eventExpression = new EventExpression("awsEventsNone", undefined, undefined, undefined);
  private doctors = [];
  private toastmessage: any;
  errBody: any;
  parsedErrBody: any;
  errMessage: any;
  firstcharvalidation: string = ""
  invalidServiceName: boolean = false;
  invalidServiceNameNum: boolean = false;
  invalidDomainName: boolean = false;
  notMyApp:boolean=false;
  loginUser: string = '';
  loginUserDetail: any;
  service: any = "";
  domain: any = "";
  reqId: any = "";
  poc_appname:string;
  appPlaceHolder:string = 'Start typing...';
  accounts=['tmodevops','tmonpe'];
  regions=['us-west-2', 'us-east-1'];
  selectedRegion=[];
  regionInput:string;
  isScrolled : boolean = false;
  selectedAccount=[];
  AccountInput:string;
  counter: number = 0;
  localRef : number = 0;
  applc:string;
  runtimeKeys : any;
  runtimeObject : any;
  public deploymentTargets = this.buildEnvironment["INSTALLER_VARS"]["CREATE_SERVICE"]["DEPLOYMENT_TARGETS"];
  public selectedDeploymentTarget = "";


  constructor(
    // private http: Http,
    private toasterService: ToasterService,
    private myFilterPipe : MyFilterPipe,
    private cronParserService: CronParserService,
    private http: RequestService,
    private cache: DataCacheService,
    private messageservice: MessageService,
    private servicelist: ServicesListComponent,
    private authenticationservice: AuthenticationService
  ) {
    this.toastmessage = messageservice;
    this.approversPlaceHolder = "Start typing (min 3 chars)...";
    this.runtimeObject = environment.envLists;
    this.runtimeKeys = Object.keys(this.runtimeObject);


  }


  public focusDynamo = new EventEmitter<boolean>();
  public focusKinesis = new EventEmitter<boolean>();
  public focusS3 = new EventEmitter<boolean>();

  chkDynamodb() {
    this.focusDynamo.emit(true);
    return this.eventExpression.type === 'dynamodb';
  }

  chkfrKinesis() {
    this.focusKinesis.emit(true);
    return this.eventExpression.type === 'kinesis';
  }

  chkS3() {
    this.focusS3.emit(true);
    return this.eventExpression.type === 's3';
  }

  // function for opening and closing create service popup
  closeCreateService(serviceRequest) {
    this.onClose.emit(false);
    if (serviceRequest) {
      this.servicelist.serviceCall();
    }
    this.selectedDeploymentTarget = '';
    this.approversPlaceHolder = "Start typing (min 3 chars)...";
    this.cache.set("updateServiceList", true);
    this.serviceRequested = false;
    this.serviceRequestFailure = false;
    this.serviceRequestSuccess = false;

    this.allUsersApprover = this.usersList.values.slice(0, this.usersList.values.length);
    this.allUsersSlack = this.usersList.values.slice(0, this.usersList.values.length);
    // this.approversList = this.approversListShow;
  }


  selectedApplications=[];
  selectedApprovers = [];
  selectedSlackUsers = [];

  rateData = ['Minutes', 'Hours', 'Days'];

  // function for changing service type
  changeServiceType(serviceType) {
    this.typeOfService = serviceType;
  }


  // function for changing platform type
  changePlatformType(platformType) {
    if (!this.disablePlatform) {
      this.typeOfPlatform = platformType;
    }
  }

  // function called on runtime change(radio)
  onSelectionChange(val) {
    this.runtime = val;
  }

  // function called on event schedule change(radio)
  onEventScheduleChange(val) {
    this.rateExpression.type = val;
    if(val !== `none`){
      this.eventExpression.type = 'awsEventsNone';
    }
  }
  onAWSEventChange(val) {
    this.eventExpression.type = val;
    if(val !== `none`){
      this.rateExpression.type = 'none';
    }
  }
  onSelectedDr(selected) {
    this.rateExpression.interval = selected;
    this.generateExpression(this.rateExpression)
  }

  getUserDetails(list) {
    this.loginUser = this.authenticationservice.getUserId();
    if (list.length) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].userId.toLowerCase() === this.loginUser) {
          this.loginUserDetail = list[i];
        }
      }
    }
  }

  statusFilter(item) {
    this.selected = item;
  };
  approversListRes: any;
  usersList;
  allUsersSlack = [];
  allUsersApprover = [];
  filteredSlackUsers = [];
  filteredApproversUsers = [];
  // function to get approvers list
  public getData() {

    this.http.get('/platform/ad/users')
      .subscribe((res: Response) => {
        this.approversListRes = res;
        this.usersList = this.approversListRes.data;
        this.allUsersSlack = this.usersList.values.slice(0, this.usersList.values.length);
        this.allUsersApprover = this.usersList.values.slice(0, this.usersList.values.length);

        this.getUserDetails(this.allUsersApprover);
      }, error => {
        this.resMessage = this.toastmessage.errorMessage(error, 'aduser');
        this.toast_pop('error', 'Oops!', this.resMessage);
      });
  }



  // function to validate slack channel
  public validateChannelName() {

    this.slackChannelLoader = true;
    this.http.get('/platform/is-slack-channel-available?slack_channel=' + this.model.slackName)
      .subscribe(
      (Response) => {
        var output = Response;
        this.slackChannelLoader = false;
        if (output.data.is_available == true) {
          this.slackAvailble = true;
          this.slackNotAvailble = false;
        } else if (output.data.is_available == false) {
          this.slackAvailble = false;
          this.slackNotAvailble = true;
        } else {
          this.serviceAvailable = true;
          this.slackAvailble = false;
          this.slackNotAvailble = false;
        }
      },
      (error) => {
        this.slackChannelLoader = false;
        var err = error;
        // this.channelNameError = true;
        this.resMessage = this.toastmessage.errorMessage(error, 'slackChannel');
        this.toast_pop('error', 'Oops!', this.resMessage);
      }
      );
  }

  // function to restore the slack channel availability when it is changed
  onSlackChange() {
    this.channelNameError = false;
    this.slackAvailble = false;
    this.slackNotAvailble = false;
  }

  // check service name availability
  public validateServiceName() {
    this.showLoader = true;
    this.model.serviceName = this.model.serviceName.toLowerCase();
    this.model.domainName = this.model.domainName.toLowerCase();


    this.http.get('/jazz/is-service-available/?service=' + this.model.serviceName + '&domain=' + this.model.domainName)
      .subscribe(
      (Response) => {

        var output = Response;
        this.showLoader = false;
        if (output.data.available == true) {
          this.serviceAvailable = true;
          this.serviceNotAvailable = false;
        } else if (output.data.available == false) {
          this.serviceAvailable = false;
          this.serviceNotAvailable = true;
        } else {
          //  this.serviceNameError = true;
          this.serviceAvailable = false;
          this.serviceNotAvailable = false;
        }
        this.checkdomainName();
        (error) => {
          this.showLoader = false;
          // this.serviceNameError = true;
          this.serviceAvailable = false;
          this.serviceNotAvailable = false;
          var err = error;
          this.checkdomainName();

        }
      },
      (error) => {
        this.showLoader = false;
        this.resMessage = this.toastmessage.errorMessage(error, 'serviceAvailability');
        this.toast_pop('error', 'Oops!', this.resMessage);
      }
      );
  }

  toast_pop(error, oops, errorMessage) {
    var tst = document.getElementById('toast-container');

    tst.classList.add('toaster-anim');
    this.toast = this.toasterService.pop(error, oops, errorMessage);
    setTimeout(() => {
      tst.classList.remove('toaster-anim');
    }, 3000);

  }
  checkdomainName() {
    if (this.model.domainName) {
      this.isDomainDefined = true;
    } else {
      this.isDomainDefined = false;
    }
  }

  // function to restore the service channel availability to false when it is changed
  onServiceChange() {
    this.isDomainDefined = false;
    this.serviceNameError = false;
    this.serviceAvailable = false;
    this.serviceNotAvailable = false;
  }

  onRegionChange(newVal) {
    if (!newVal) {
      this.showRegionList = false;
    } else {
      this.showRegionList = true;
    }
  }
  onAccountChange(newVal) {
    if (!newVal) {
      this.showAccountList = false;
    } else {
      this.showAccountList = true;
    }
  }

  focusInputAccount(event) {
    document.getElementById('AccountInput').focus();
  }

  focusInputRegion(event) {
    document.getElementById('regionInput').focus();
  }

  // function to create service
  public createService() {
    var approversPayload = []
    for (var i = this.selectedApprovers.length - 1; i >= 0; i--) {
      approversPayload.push(this.selectedApprovers[i].userId);
    }

    var payload = {
      "service_type": this.typeOfService,
      "service_name": this.model.serviceName,
      "approvers": approversPayload,
      "domain": this.model.domainName,
      "description": this.model.serviceDescription,
      //     "git_clone":this.git_clone,
      //     "git_url":this.git_url,
      //     "git_private":this.git_private,
      //     "git_creds":{
      // "properties":{
      //       "git_username":this.git_username,
      //       "git_pwd":this.git_pwd
      // }
      //     }

    };

    let obj = {};

    if (this.typeOfService == 'api') {
      payload["runtime"] = this.runtime;
      payload["require_internal_access"] = this.vpcSelected;
      payload["is_public_endpoint"] = this.publicSelected;
      payload["deployment_targets"] = {
        "api": this.selectedDeploymentTarget
      }
    }
    else if (this.typeOfService == 'function') {
      payload["runtime"] = this.runtime;
      // payload.service_type = 'lambda';
      payload["require_internal_access"] = this.vpcSelected;
      payload["deployment_targets"] = {
        "function": "aws_lambda"
      }
      if (this.rateExpression.type != 'none') {
        this.rateExpression.cronStr = this.cronParserService.getCronExpression(this.cronObj);
        if (this.rateExpression.cronStr == 'invalid') {
          return;
        } else if (this.rateExpression.cronStr !== undefined) {
          payload["rateExpression"] = this.rateExpression.cronStr;
        }
      }

      if (this.eventExpression.type !== "awsEventsNone") {
        var event = {};
        event["type"] = this.eventExpression.type;
        if (this.eventExpression.type === "dynamodb") {
          event["source"] = "arn:aws:dynamodb:us-west-2:302890901340:table/" + this.eventExpression.dynamoTable;
          event["action"] = "PutItem";
        } else if (this.eventExpression.type === "kinesis") {
          event["source"] = "arn:aws:kinesis:us-west-2:302890901340:stream/" + this.eventExpression.streamARN;
          event["action"] = "PutRecord";
        } else if (this.eventExpression.type === "s3") {
          event["source"] = this.eventExpression.S3BucketName;
          event["action"] = "s3:ObjectCreated:*";
        }
        payload["events"] = [];
        payload["events"].push(event);
      }

    } else if (this.typeOfService == 'website') {
      payload["is_public_endpoint"] = this.publicSelected;
      payload["create_cloudfront_url"] = this.cdnConfigSelected;

      //Abhishek: temp for Apigee-release
      if(this.cdnConfigSelected){
        this.selectedDeploymentTarget = "aws_cloudfront";
      }else{
        this.selectedDeploymentTarget = "aws_s3";
      }
      //Abhishek: END: temp for Apigee-release

      payload["deployment_targets"] = {
        "website": this.selectedDeploymentTarget
      }

      if (this.gitCloneSelected == true) {
        payload["git_repository"] = {};
        //payload["git_repository"]["git_url"] = this.git_url;
        obj = { "git_https_url": this.git_url, "git_creds": {} };

        if (this.git_private == true) {
          //payload["git_private"] = this.git_private;
          this.git_creds = {
            "git_username": this.gitusername,
            "git_pwd": this.gituserpwd
          }
          obj["git_creds"] = this.git_creds;
        }
        payload["git_repository"] = obj;
      }
    }

    if (this.slackSelected) {
      payload["slack_channel"] = this.model.slackName;
    }
    if (this.typeOfService == 'api' && this.ttlSelected) {
    }

    // if (this.typeOfService == 'function') {
    //   payload["accounts"]=this.selectedAccount;
    //   payload["regions"]=this.selectedRegion;
    // }
    if(this.notMyApp){
      payload["appName"]=this.poc_appname;
      payload["appID"]="poc";
    }
    else{
      payload["appName"]=this.selectApp.appName;
      payload["appID"]=this.selectApp.appID.toLowerCase();
    }
    this.isLoading = true;

    this.http.post('/jazz/create-serverless-service', payload)
      .subscribe(
      (Response) => {
        var service = payload.service_name;
        var domain = payload.domain;
        var reqId = Response.data.request_id;
        localStorage.setItem('request_id' + "_" + payload.service_name + "_" + payload.domain, JSON.stringify({ service: service, domain: domain, request_id: reqId }));
        var output = Response;
        // this.cache.set("request_id", Response.data.request_id);
        // this.cache.set("request_id_name", Response.input.service_name);
        this.serviceRequested = true;
        this.serviceRequestSuccess = true;
        this.serviceRequestFailure = false;
        this.isLoading = false;
        this.appPlaceHolder='Start typing...';
        // this.cache.set('request_id',output.data.request_id);
        // var index = output.data.indexOf("https://");
        // this.serviceLink = output.data.slice(index, output.data.length);
        this.resMessage = this.toastmessage.successMessage(Response, "createService");
        if (output.data != undefined && typeof (output.data) == 'string') {
          this.resMessage = output.data;
        } else if (output.data != undefined && typeof (output.data) == 'object') {
          this.resMessage = output.data.message;
        }
        this.selectedApprovers = [];
        this.selectedSlackUsers = [];
        this.selectedApplications=[];
        this.notMyApp=false;
        this.oneSelected=false;
        this.selectApp={};
        this.resetEvents();
        // this.toasterService.pop('success', 'Success!!', output.data.create_service.data);
        //this.toasterService.pop('success', resMessage);
      },
      (error) => {
        this.isLoading = false;
        this.serviceRequested = true;
        this.serviceRequestSuccess = false;
        this.serviceRequestFailure = true;
        console.log('', error);
        this.errBody = error._body;
        this.errMessage = this.toastmessage.errorMessage(error, 'createService');
        try {
          this.parsedErrBody = JSON.parse(this.errBody);
          if (this.parsedErrBody.message != undefined && this.parsedErrBody.message != '') {
            this.errMessage = this.parsedErrBody.message;
          }
        } catch (e) {
          console.log('JSON Parse Error', e);
        }
      }
      );
  }

  resetEvents(){
    this.eventExpression.dynamoTable = "";
    this.eventExpression.streamARN = "";
    this.eventExpression.S3BucketName = "";
    this.cronObj = new CronObject('0/5', '*', '*', '*', '?', '*')
    this.rateExpression.error = undefined;
    this.rateExpression.type = 'none';
    this.rateExpression.duration = "5";
    this.eventExpression.type = 'awsEventsNone';
    this.runtime = this.runtimeKeys[0];
  }
  // function to navigate from success or error screen to create service screen
  backToCreateService() {
    this.approversList.push(this.selApprover);
    this.selectedApprovers.splice(0, 1);
    this.serviceRequested = false;
    this.serviceRequestSuccess = false;
    this.serviceRequestFailure = false;
    this.approversPlaceHolder = "Start typing (min 3 chars)...";
  }


  // function to create a service
  onSubmit() {
    this.submitted = true;
    this.getData();
    this.createService();
    this.typeOfService = 'api';

    setTimeout(() => {
      this.vpcSelected = false;
      this.publicSelected = false;
      this.slackSelected = false;
      this.createslackSelected = false;
      this.ttlSelected = false;
      this.cdnConfigSelected = true;
      this.gitprivateSelected = false;
      this.gitCloneSelected = false;
    }, 2000)



  }
  onnotmyapp(){
    this.applc='';
    this.showApplicationList=false;
    this.selectedApplications=[];
    this.oneSelected=false;
  }
  onApplicationChange(newVal) {
    if (!newVal) {
      this.showApplicationList = false;
    } else {
      this.showApplicationList = true;
    }
  }
  // function to hide approver list when input field is empty
  onApproverChange(newVal) {
    if (!newVal) {
      this.approversPlaceHolder = "Start typing (min 3 chars)...";
      this.showApproversList = false;
    } else {
      this.approversPlaceHolder = "";
      if(newVal.length > 2 && this.allUsersSlack) {
        this.filteredApproversUsers = this.myFilterPipe.transform(this.allUsersApprover,newVal);
        this.showApproversList = true;
      }
      else
        this.showApproversList = false;
    }
  }

  onSlackUserChange(newVal) {
    if (!newVal) {
      this.approversPlaceHolder = "Start typing (min 3 chars)...";
      this.showApproversList = false;
    } else {
      this.approversPlaceHolder = "";
      if(newVal.length > 2 && this.allUsersSlack) {
        this.filteredSlackUsers = this.myFilterPipe.transform(this.allUsersSlack,newVal);
        this.showSlackList = true;
      }
      else
      this.showSlackList = false;
    }
  }

selRegion:any;
selectAccount(account){

  this.selApprover = account;
    let thisclass: any = this;
    this.showAccountList = false;
    thisclass.AccountInput = '';
    this.selectedAccount.push(account);
    for (var i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i] === account) {
        this.accounts.splice(i, 1);
        return;
      }
    }
}
removeAccount(index, account) {
  this.accounts.push(account);
  this.selectedAccount.splice(index, 1);
}
selectRegion(region){
  this.selApprover = region;
    let thisclass: any = this;
    this.showRegionList = false;
    thisclass.regionInput = '';
    this.selectedRegion.push(region);
    for (var i = 0; i < this.regions.length; i++) {
      if (this.regions[i] === region) {
        this.regions.splice(i, 1);
        return;
      }
    }
}
removeRegion(index, region) {
  this.regions.push(region);
  this.selectedRegion.splice(index, 1);
}
keypressAccount(hash){
  if (hash.key == 'ArrowDown') {
    this.focusindex++;
    if (this.focusindex > 0) {
      var pinkElements = document.getElementsByClassName("pinkfocus")[0];
      if (pinkElements == undefined) {
        this.focusindex = 0;
      }
    }
    if (this.focusindex > 2) {
      this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindex - 2) * 2.9) + 'rem' };

    }
  }
  else if (hash.key == 'ArrowUp') {
    if (this.focusindex > -1) {
      this.focusindex--;

      if (this.focusindex > 1) {
        this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindex - 2) * 2.9) + 'rem' };
      }
    }
    if (this.focusindex == -1) {
      this.focusindex = -1;


    }
  }
  else if (hash.key == 'Enter' && this.focusindex > -1) {
    if(this.accounts.length == 0){
      this.showApproversList = false;
    }
    event.preventDefault();
    var pinkElement = document.getElementsByClassName("pinkfocus")[0].children;

    var approverObj = pinkElement[0].attributes[2].value;

    this.selectAccount(approverObj);

    this.showApproversList = false;
    this.slackName = '';
    this.focusindex = -1;

  } else {
    this.focusindex = -1;
  }
}
focusindexR:number=-1;
focusInputApplication(event) {
  document.getElementById('applc').focus();
}
keypressRegion(hash){
  if (hash.key == 'ArrowDown') {
    this.focusindexR++;
    if (this.focusindexR > 0) {
      var pinkElements = document.getElementsByClassName("pinkfocus")[1];
      if (pinkElements == undefined) {
        this.focusindexR = 0;
      }
    }
    if (this.focusindexR > 2) {
      this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindexR - 2) * 2.9) + 'rem' };

    }
  }
  else if (hash.key == 'ArrowUp') {
    if (this.focusindexR > -1) {
      this.focusindexR--;

      if (this.focusindexR > 1) {
        this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindexR - 2) * 2.9) + 'rem' };
      }
    }
    if (this.focusindexR == -1) {
      this.focusindexR = -1;


    }
  }
  else if (hash.key == 'Enter' && this.focusindexR > -1) {
    event.preventDefault();
    var pinkElement = document.getElementsByClassName("pinkfocus")[0].children;

    var approverObj = pinkElement[0].attributes[2].value;

    this.selectRegion(approverObj);

    this.showApproversList = false;
    this.slackName = '';
    this.focusindexR = -1;

  } else {
    this.focusindexR = -1;
  }
}

blurAccount(){
  this.AccountInput='';
  setTimeout(() => {
    this.showAccountList=false;
  }, 500);

}

blurRegion(){
  this.regionInput='';
  setTimeout(() => {
    this.showRegionList=false;
  }, 500);

}

blurApplication(){
  setTimeout(() => {
    this.applc='';
    this.showApplicationList=false;
  }, 200);

}
  //function for selecting approvers from dropdown//
  selectApprovers(approver) {

    this.selApprover = approver;
    let thisclass: any = this;
    this.showApproversList = false;
    thisclass.approverName = '';
    this.selectedApprovers.push(approver);
    for (var i = 0; i < this.allUsersApprover.length; i++) {
      if (this.allUsersApprover[i].displayName === approver.displayName) {
        this.allUsersApprover.splice(i, 1);
        return;
      }
    }


  }

  selectSlackUser(approver) {

    let thisclass: any = this;
    this.showSlackList = false;
    // thisclass.slackName = '';
    this.approversPlaceHolder = "Start typing (min 3 chars)...";
    this.selectedSlackUsers.push(approver);
    for (var i = 0; i < this.allUsersSlack.length; i++) {
      if (this.allUsersSlack[i].displayName === approver.displayName) {
        this.allUsersSlack.splice(i, 1);
        return;
      }
    }
  }


  // function for removing selected approvers
  removeApprover(index, approver) {
    this.allUsersApprover.push(approver);
    this.selectedApprovers.splice(index, 1);
  }

  removeSlackUser(index, approver) {
    this.allUsersSlack.push(approver);
    this.selectedSlackUsers.splice(index, 1);
  }

  //function for closing dropdown on outside click//
  closeDropdowns() {
    this.approversPlaceHolder = "Start typing (min 3 chars)...";
    this.showApproversList = false;
  }

  // function for slack channel avalability //
  checkSlackNameAvailability() {
    this.createSlackModel.name = this.model.slackName;
    if (!this.model.slackName) {
      return;
    }
    this.validateChannelName();
  }




  validateGIT() {
    var giturl = this.gitRepo;
    var lastpart = giturl.substring(giturl.length - 4, giturl.length);
    if (lastpart != '.git' && this.gitRepo != '') this.git_err = true;
    else this.git_err = false;
  }

  validateName(event) {

    if (this.model.serviceName != null) {
      this.firstcharvalidation = Number(this.model.serviceName[0]).toString();
    }
    if (this.firstcharvalidation != "NaN") {
      this.invalidServiceName = true;
    }

    if (this.model.domainName != null) {
      this.firstcharvalidation = Number(this.model.domainName[0]).toString();
    }
    if (this.firstcharvalidation != "NaN") {
      this.invalidDomainName = true;
    }


    if (this.model.serviceName != null && (this.model.serviceName[0] == ('-')) || (this.model.serviceName[this.model.serviceName.length - 1] === '-')) {
      this.invalidServiceName = true;
    }

    if (this.model.domainName != null && (this.model.domainName[0] === '-' || this.model.domainName[this.model.domainName.length - 1] === '-')) {
      this.invalidDomainName = true;
    }

    if (this.invalidServiceName == false && this.invalidDomainName == false && this.invalidServiceNameNum == false) {
      this.serviceNameAvailability();
    }
  }
  // function for service name avalability //
  serviceNameAvailability() {
    if (!this.model.serviceName || !this.model.domainName) {
      return;
    }
    this.validateServiceName();
  }

  // function ttl value
  onTTLChange() {
    if (this.model.ttlValue) {
      if (parseInt(this.model.ttlValue) > 3600 || parseInt(this.model.ttlValue) < 1) {
        this.invalidttl = true;
      } else {
        this.invalidttl = false;
      }
    } else {
      this.invalidttl = true;
    }
  };

  // function disable the submit till all entered datas are valid
  disableForm() {
    if(this.selectedApplications.length<1 && !this.notMyApp) return true;
    if(this.notMyApp && !this.poc_appname) return true;
    if (this.git_err) return true;

    if (this.selectedApprovers === undefined || this.selectedApprovers.length === 0) {
      return true;
    }
    if (!this.serviceAvailable) {
      return true;
    }
    if (this.slackSelected && !this.slackAvailble) {
      return true
    }
    if (this.ttlSelected && this.invalidttl) {
      return true
    }
    if (this.rateExpression.error != undefined && this.typeOfService == 'function' && this.rateExpression.type != 'none') {
      return true
    }
    if (this.eventExpression.type == 'dynamodb' && this.eventExpression.dynamoTable == undefined) {
      return true
    }
    if (this.eventExpression.type == 'kinesis' && this.eventExpression.streamARN == undefined) {
      return true
    }
    if (this.eventExpression.type == 's3' && this.eventExpression.S3BucketName == undefined) {
      return true
    }
    if (this.invalidServiceName || this.invalidDomainName || this.invalidServiceNameNum) {
      return true
    }
    // this.approverName = '';
    if (this.approverName != '') {
      return true;
    }
    return false;
  }
  gitChange() {

    this.gitCloneSelected = !this.gitCloneSelected;
    if (!this.gitCloneSelected) {
      this.git_err = false;
    }


  }

  keypressApprovers(hash) {
    if (this.typeOfService == 'website') {
      var gitClone = <HTMLInputElement>document.getElementById("checkbox-gitclone");

      this.git_clone = gitClone.checked;
      if (this.git_clone) {
        var gitPrivate = <HTMLInputElement>document.getElementById("checkbox-gitprivate");

        this.git_private = gitPrivate.checked;

        this.git_url = "https://" + this.gitRepo;
      }
    }

    if (hash.key == 'ArrowDown') {
      this.focusindex++;
      if (this.focusindex > 0) {
        var pinkElements = document.getElementsByClassName("pinkfocus")[3];

      }
      if (this.focusindex > 2) {
        this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindex - 2) * 2.9) + 'rem' };

      }
    }
    else if (hash.key == 'ArrowUp') {

      if (this.focusindex > -1) {
        this.focusindex--;

        if (this.focusindex > 1) {
          this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindex - 2) * 2.9) + 'rem' };
        }
      }
      if (this.focusindex == -1) {
        this.focusindex = -1;


      }
    }
    else if (hash.key == 'Enter' && this.focusindex > -1) {
      event.preventDefault();
      var pinkElement;
      pinkElement = document.getElementsByClassName('pinkfocususers')[0].children;

      var approverObj = {
        displayName: pinkElement[0].attributes[2].value,
        givenName: pinkElement[0].attributes[3].value,
        userId: pinkElement[0].attributes[4].value,
        userEmail: pinkElement[0].attributes[5].value
      }
      this.selectApprovers(approverObj);

      this.showApproversList = false;
      this.approverName = '';
      this.focusindex = -1;

    } else {
      this.focusindex = -1;
    }
  }

  keypressSlack(hash)
  {
    if (hash.key == 'ArrowDown') {
      this.focusindex++;
      if (this.focusindex > 0) {
        var pinkElements = document.getElementsByClassName("pinkfocus")[0];
        if (pinkElements == undefined) {
          this.focusindex = 0;
        }
      }
      if (this.focusindex > 2) {
        this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindex - 2) * 2.9) + 'rem' };

      }
    }
    else if (hash.key == 'ArrowUp') {
      if (this.focusindex > -1) {
        this.focusindex--;

        if (this.focusindex > 1) {
          this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindex - 2) * 2.9) + 'rem' };
        }
      }
      if (this.focusindex == -1) {
        this.focusindex = -1;


      }
    }
    else if (hash.key == 'Enter' && this.focusindex > -1) {
      event.preventDefault();
      var pinkElement;
      pinkElement = document.getElementsByClassName("pinkfocuslack")[0].children;

      var approverObj = {
        displayName: pinkElement[0].attributes[2].value,
        givenName: pinkElement[0].attributes[3].value,
        userId: pinkElement[0].attributes[4].value,
        userEmail: pinkElement[0].attributes[5].value
      }
      this.selectSlackUser(approverObj);

      this.showApproversList = false;
      this.slackName = '';
      this.focusindex = -1;

    } else {
      this.focusindex = -1;
    }
  }

  slackFunction() {
    if (!this.slackSelected) {
      this.createslackSelected = false;
    }
  }

  CrSlackFunction() {

  }

  focusInput(event) {
    document.getElementById('approverName').focus();
  }

  focusInput2(event) {
    document.getElementById('slackName').focus();
  }

  createSlack(event) {
    event.preventDefault();
    var payload = {
      "channel_name": this.model.slackName,
      "users": []
    }
    var currentuser = this.authenticationservice.getUserId();
    for (var i = 0; i < this.selectedSlackUsers.length; i++) {
      payload.users[i] = { "email_id": this.selectedSlackUsers[i].userEmail };
      if (this.selectedSlackUsers[i].userId.toLowerCase() == currentuser) {
        this.currentUserSlack = true;
      }
      if (!this.currentUserSlack) {
        payload.users[this.selectedSlackUsers.length] = { "email_id": this.loginUserDetail.userEmail };
      }
      this.isLoadingNewSlack = true;
      this.http.post('/platform/slack-channel', payload).subscribe(
        (Response) => {
          var output = Response;
          this.resMessage = this.toastmessage.successMessage(Response, "createSlack");
          this.isLoadingNewSlack = false;

          this.createslackSelected = false;
          this.validateChannelName();
          this.toast_pop('success', 'Success!!', this.resMessage);
        },
        (error) => {

          this.isLoadingNewSlack = false;
          this.errBody = error._body;
          this.errMessage = this.toastmessage.errorMessage(error, 'createSlack');
          this.toast_pop('error', 'Oops!', this.errMessage);
          try {
            this.parsedErrBody = JSON.parse(this.errBody);
          } catch (e) {
            console.log('JSON Parse Error', e);
          }
        });
    }
  }

  cancelCreateSlack() {
    this.createslackSelected = false;
    this.createSlackModel.name = '';
    this.createSlackModel.purpose = '';
    this.createSlackModel.invites = '';
    for (var i = 0; i < this.selectedSlackUsers.length; i++) {
      this.approversListBasic.push(this.selectedSlackUsers[i]);
    }
    this.selectedSlackUsers = [];
  }
  selectAccountsRegions(){

    this.selectAccount('tmodevops');
    this.selectRegion('us-west-2');
  }

  keypressApplication(hash){
    if (hash.key == 'ArrowDown') {
      this.focusindex++;
      if (this.focusindex > 0) {
        var pinkElements = document.getElementsByClassName("pinkfocusapplication")[0];
        if (pinkElements == undefined) {
          this.focusindex = 0;
        }
        // var id=pinkElements.children[0].innerHTML;
      }
      if (this.focusindex > 2) {
        this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindex - 2) * 2.9) + 'rem' };

      }
    }
    else if (hash.key == 'ArrowUp') {
      if (this.focusindex > -1) {
        this.focusindex--;

        if (this.focusindex > 1) {
          this.scrollList = { 'position': 'relative', 'top': '-' + ((this.focusindex - 2) * 2.9) + 'rem' };
        }
      }
      if (this.focusindex == -1) {
        this.focusindex = -1;


      }
    }
    else if (hash.key == 'Enter' && this.focusindex > -1) {
      if(this.accounts.length == 0){
        this.showApproversList = false;
      }
      event.preventDefault();
      var pinkElement = document.getElementsByClassName("pinkfocusapplication")[0].children;
      var appobj = {
        "appID":pinkElement[0].attributes[3].value,
        "appName": pinkElement[0].attributes[2].value
      }


      this.selectApplication(appobj);
      this.showApplicationList = false;
      this.slackName = '';
      this.focusindex = -1;
    } else {
      this.focusindex = -1;
    }
  }
  selectApp;
  selectApplication(app) {
    this.oneSelected=true;
    this.appPlaceHolder='';
    this.selectApp = app;
    let thisclass: any = this;
    this.showApplicationList = false;
    thisclass.applc = '';
    this.selectedApplications.push(app);
    let nonRepeatedData = (data) => data.filter((v,i) => data.indexOf(v) === i);
    this.application_arr = nonRepeatedData(this.application_arr);
    return;

  }
  removeApplication(index, approver) {
    this.oneSelected=false;
    this.selectApp={};
    this.appPlaceHolder='Start typing...';
    // this.application_arr.push(approver);
    let nonRepeatedData = (data) => data.filter((v,i) => data.indexOf(v) === i);
    this.application_arr = nonRepeatedData(this.application_arr);
    this.selectedApplications.splice(index, 1);
  }
  start_at:number=0;
  getapplications(){
    this.http.get('https://cloud-api.corporate.t-mobile.com/api/cloud/workloads?startAt='+this.start_at)
    .subscribe((res: Response) => {
      this.applications=res;

      this.application_arr.push.apply(this.application_arr,this.applications.data.summary);
      this.start_at = this.start_at+100;
      if(this.applications.data.total > this.start_at ){
        setTimeout(() => {
          this.getapplications();
        }, 3000);

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
        this.enableAppInput = true;
        return;
      }

    }, error => {

    });
  }


 ngOnInit() {
    this.selectAccountsRegions();
    this.runtime = this.runtimeKeys[0];
    this.getData();
    this.getapplications();
    if(this.cronObj.minutes == '')
      this.cronObj.minutes='0/5';
  };

  publicEndpoint() {
    if (this.publicSelected = true) {
      this.vpcSelected = false;
    }
  }

  ngOnChanges(x: any) {
    if(this.cronObj.minutes == '')
      this.cronObj.minutes='0/5';

  }


  inputChanged(val) {
    this.Currentinterval = val;
  }

  private isCronObjValid(cronObj) {
    var cronValidity = this.cronParserService.validateCron(cronObj);
    this.cronFieldValidity = cronValidity;
    if (cronValidity.isValid === true) {
      return true;
    }
    return false;
  };



  generateExpression(rateExpression) {
    if (this.rateExpression !== undefined) {
      this.rateExpression.error = undefined;
    }
    if (rateExpression === undefined || rateExpression['type'] === 'none') {
      this.rateExpression.isValid = undefined;
    } else if (rateExpression['type'] == 'rate') {
      var duration, interval;
      duration = rateExpression['duration'];
      interval = rateExpression['interval'];

      if (duration === undefined || duration === null || duration <= 0) {
        this.rateExpression.isValid = false;
        this.rateExpression.error = 'Please enter a valid duration';
      } else {
        if (interval == 'Minutes') {
          this.cronObj = new CronObject(('0/' + duration), '*', '*', '*', '?', '*');
        } else if (interval == 'Hours') {
          this.cronObj = new CronObject('0', ('0/' + duration), '*', '*', '?', '*');
        } else if (interval == 'Days') {
          this.cronObj = new CronObject('0', '0', ('1/' + duration), '*', '?', '*');
        }
        this.rateExpression.isValid = true;
        this.rateExpression.cronStr = this.cronParserService.getCronExpression(this.cronObj);
      }
    } else if (rateExpression['type'] == 'cron') {
      var cronExpression;
      var cronObj = this.cronObj;
      var cronObjFields = this.cronParserService.cronObjFields;
      var _isCronObjValid = this.isCronObjValid(cronObj)

      if (_isCronObjValid === false) {
        this.rateExpression.isValid = false;
        this.rateExpression.error = 'Please enter a valid cron expression';
      } else {
        this.rateExpression.isValid = true;
        this.rateExpression.cronStr = this.cronParserService.getCronExpression(this.cronObj);
      }
    }

    if (this.rateExpression.isValid === undefined) {
      return undefined;
    } else if (this.rateExpression.isValid === false) {
      return 'invalid';
    } else if (this.rateExpression.isValid === true) {
      return this.rateExpression.cronStr;
    }
  };

}

