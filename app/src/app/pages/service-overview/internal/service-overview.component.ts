/**
 * @type Component
 * @desc Service overview page
 * @author
 */

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  RequestService,
  DataCacheService,
  MessageService,
  AuthenticationService,
} from '../../../core/services/index';
import { ToasterService } from 'angular2-toaster';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { ServiceDetailComponent } from '../../service-detail/internal/service-detail.component';
import {
  ServiceFormData,
  RateExpression,
  CronObject,
  EventExpression,
} from './../../../secondary-components/create-service/service-form-data';
import { CronParserService } from '../../../core/helpers';
import { environment } from './../../../../environments/environment';
import { MyFilterPipe } from '../../../primary-components/custom-filter';
import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'service-overview',
  templateUrl: './service-overview.component.html',
  providers: [RequestService, MessageService, MyFilterPipe],
  styleUrls: [
    '../../service-detail/internal/service-detail.component.scss',
    './service-overview.component.scss',
  ],
})
export class ServiceOverviewComponent implements OnInit {
  @Output() onload: EventEmitter<any> = new EventEmitter<any>();
  @Output() onEnvGet: EventEmitter<any> = new EventEmitter<any>();
  @Output() open_sidebar: EventEmitter<any> = new EventEmitter<any>();
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('env') envComponent;
  @ViewChild('approverInput') approverInput: any;

  flag: boolean = false;

  @Input() service: any = {};
  @Input() isLoadingService: boolean;
  @Input() application_arr: any;
  private subscription: any;

  multiENV: boolean = true;
  environList = [];
  list_env = [];
  list_inactive_env = [];
  copyLink: string = 'Copy Link';
  disp_edit: boolean = true;
  hide_email_error: boolean = true;
  hide_slack_error: boolean = true;
  service_error: boolean = true;
  disp_show: boolean = true;
  disp_show2: boolean = true;
  err404: boolean = false;
  disable_button: boolean = false;
  email_valid: boolean;
  slack_valid: boolean;
  response_json: any;
  show_loader: boolean = false;
  plc_hldr: boolean = true;
  status_empty: boolean;
  appNameVis: string;
  isapplicationDisable: boolean = true;
  descriptionChanged: boolean = true;
  description_empty: boolean;
  approvers_empty: boolean;
  domain_empty: boolean;
  serviceType_empty: boolean;
  email_empty: boolean;
  slackChannel_empty: boolean = false;
  repository_empty: boolean;
  runtime_empty: boolean = false;
  tags_empty: boolean;
  ErrEnv: boolean = false;
  accounts = ['tmodevops', 'tmonpe'];
  regions = ['us-west-2', 'us-east-1'];
  errMessage = '';
  tags_temp: string = '';
  desc_temp: string = '';
  bitbucketRepo: string = '';
  repositorylink: string = '';
  islink: boolean = false;
  showCancel: boolean = false;
  private toastmessage: any = '';
  // mod_status:string;
  private http: any;
  statusCompleted: boolean = false;
  serviceStatusCompleted: boolean = false;
  serviceStatusPermission: boolean = false;
  serviceStatusRepo: boolean = false;
  serviceStatusValidate: boolean = false;
  serviceStatusCompletedD: boolean = false;
  serviceStatusPermissionD: boolean = false;
  serviceStatusRepoD: boolean = false;
  serviceStatusValidateD: boolean = false;
  serviceStatusStarted: boolean = true;
  serviceStatusStartedD: boolean = false;
  statusFailed: boolean = false;
  approversTouched: boolean = false;
  statusInfo: string = 'Service Creation started';
  private intervalSubscription: Subscription;
  swaggerUrl: string = '';
  baseUrl: string = '';
  update_payload: any = {};
  payloag_tags = [];
  service_request_id: any;
  creation_status: string;
  statusprogress: number = 20;
  animatingDots: any;
  noStg: boolean = false;
  noProd: boolean = false;
  DelstatusInfo: string = 'Deletion Started';
  creating: boolean = false;
  deleting: boolean = false;
  showcanvas: boolean = false;
  errBody: any;
  parsedErrBody: any;
  errorTime: any;
  errorURL: any;
  errorAPI: any;
  errorRequest: any = {};
  errorResponse: any = {};
  errorUser: any;
  envList = ['prod', 'stg'];
  friendlist = ['prod', 'stg'];
  errorChecked: boolean = true;
  errorInclude: any = '';
  json: any = {};
  errorcase: boolean = false;
  Nerrorcase: boolean = true;
  reqJson: any = {};
  createloader: boolean = true;
  showbar: boolean = false;
  friendly_name: any;
  list: any = {};
  selected: string = 'Minutes';
  eventSchedule: string = 'fixedRate';
  cronObj = new CronObject('0/5', '*', '*', '*', '?', '*');
  rateExpression = new RateExpression(
    undefined,
    undefined,
    'none',
    '5',
    this.selected,
    ''
  );
  eventExpression = new EventExpression(
    'awsEventsNone',
    undefined,
    undefined,
    undefined,
    undefined
  );
  viewMode: boolean = true;
  cronFieldValidity: any;
  requireInternalAccess: boolean = this.service.require_internal_access;
  vpcInitial: boolean = this.service.require_internal_access;
  publicSelected: boolean = this.service.is_public_endpoint;
  publicInitial: boolean = this.service.is_public_endpoint;
  cdnConfigSelected: boolean = this.service.create_cloudfront_url;
  cdnConfigInitial: boolean = this.service.create_cloudfront_url;
  selectedApproversLocal: any;
  saveClicked: boolean = false;
  advancedSaveClicked: boolean = false;
  showApplicationList: boolean = false;
  selectedApplications: any = [];
  listRuntime: Object;
  initialselectedApplications = [];
  oneSelected: boolean = false;
  appPlaceHolder: string = 'Start typing(min 3 char)...';
  applc: string;
  showAppclInput: boolean = true;
  isSlackAvailable: boolean;
  isPUTLoading: boolean = false;
  PutPayload: any;
  isPayloadAvailable: boolean = false;
  isenvLoading: boolean = false;
  token: string;
  noSubEnv: boolean = false;
  noEnv: boolean = false;
  slackChannel_temp: string;
  slackChannel_link: string = '';
  edit_save: string = 'EDIT';
  activeEnv: string = 'dev';
  Environments = [];
  isEnvChanged: boolean = false;
  environ_arr = [];
  displayApprovalTime: string;
  accSelected: string;
  approvalMinutes: number = 0;
  globalApprovalMin: number = 0;
  approvalHours: number = 0;
  globalApprovalHours: number = 0;
  approvalTime: number = 0;
  hoursArray: any = [];
  minuteDropDownDisable: boolean = false;
  approvalTimeChanged: boolean = false;
  minutesArray: any = [];
  isInputShow: boolean = false;
  isApproversChanged: boolean = false;
  showApproversList: boolean = false;
  approversLimitStatus: boolean = false;
  approversSaveStatus: boolean = false;
  showGenDeatils: boolean = true;
  resMessage: any;
  showGeneralField: boolean = false;
  approversList: any;
  approversListRes: any;
  selectedApprovers: any = [];
  approversListShow: any;
  changeCounterApp: number = 0;
  dispAppError: boolean = false;
  applc1: string = '';
  enableApiSecurity: boolean = false;
  isAppTouched: boolean = false;
  selectedApplicationLocal: any = [];
  rateData: any = ['Minutes', 'Hours', 'Days'];
  approversPlaceHolder: string = 'Start typing (min 3 chars)...';
  awsEventExpression: any;
  showApprovalField: boolean = false;
  endpList = [
    {
      name: 'tmo-dev-ops',
      arn: 'arn:aws:lambda:us-east-1:1:192837283062537',
      type: 'Account',
    },
    {
      name: 'us-east-2',
      arn: 'arn:test2',
      type: 'region',
    },
    {
      name: 'tmo-dev-ops2',
      arn: 'arn:test3',
      type: 'Account',
    },
    {
      name: 'tmo-dev-ops3',
      arn: 'arn:test4',
      type: 'region',
    },
  ];
  prodEnv: any;
  stgEnv: any;
  status: string = this.service.status;
  environments = [
    {
      stageDisp: 'PROD',
      stage: 'prd',
      serviceHealth: 'NA',
      lastSuccess: {},
      lastError: {
        value: 'NA',
        // unit: 'Days'
      },
      deploymentsCount: {
        value: 'NA',
        duration: 'Last 24 hours',
      },
      cost: {
        value: 'NA',
        duration: 'Per Day',
        // 'status': 'good'
      },
      codeQuality: {
        value: 'NA',
        // 'status': 'bad'
      },
    },
    {
      stageDisp: 'STAGE',
      stage: 'stg',
      serviceHealth: 'NA',
      lastSuccess: {
        value: 'NA',
        // unit: 'Days'
      },
      lastError: {},
      deploymentsCount: {
        value: 'NA',
        duration: 'Last 24 hours',
      },
      cost: {
        value: 'NA',
        duration: 'Per Day',
        // 'status': 'good'
      },
      codeQuality: {
        value: 'NA',
        // 'status': 'good'
      },
    },
  ];
  email_temp: string;
  branches = [
    {
      title: 'DEV',
      stage: 'dev',
    },
    {
      title: 'BRANCH1',
      stage: 'dev',
    },
    {
      title: 'BRANCH2',
      stage: 'dev',
    },
    {
      title: 'BRANCH3',
      stage: 'dev',
    },
    {
      title: 'BRANCH4',
      stage: 'dev',
    },
  ];

  constructor(
    private router: Router,
    private zone: NgZone,
    private request: RequestService,
    private cdRef: ChangeDetectorRef,
    private messageservice: MessageService,
    private myFilterPipe: MyFilterPipe,
    private cronParserService: CronParserService,
    private cache: DataCacheService,
    private toasterService: ToasterService,
    private serviceDetail: ServiceDetailComponent,
    private authenticationservice: AuthenticationService
  ) {
    this.http = request;
    this.awsEventExpression = environment.awsEventExpression;
    this.toastmessage = messageservice;
    this.descriptionChanged = true;
    this.isInputShow = false;
    this.isSlackAvailable = false;
    this.listRuntime = environment.envLists;
    this.environList = Object.keys(environment.envLists);
    let localArray = [];
    this.environList.map(data => {
      localArray.push(environment.envLists[data]);
    });
    this.environList = localArray;
    for (let i = 0; i < 25; i++) {
      this.hoursArray.push(i);
    }
    for (let i = 5; i < 60; i = i + 5) {
      this.minutesArray.push(i);
    }
    this.getData();
  }

  onEditGeneral() {
    if (this.showApprovalField) {
      this.showApprovalField = false;
      this.onCancelClick();
    }
    this.showGeneralField = true;
  }

  onEditApproval() {
    if (this.showGeneralField) {
      this.showGeneralField = false;
      this.onCancelClick();
    }
    this.showApprovalField = true;
  }

  public getData() {
    let localApprovvs = JSON.parse(localStorage.getItem('approvers')) || {};
    if (Object.keys(localApprovvs).length > 0) {
      this.approversListRes = localApprovvs;
      this.approversListShow = localApprovvs.data.values.slice(
        0,
        localApprovvs.data.values.length
      );
      this.getApproversList();
      this.isInputShow = true;
    } else {
      this.http.get('/platform/ad/users').subscribe(
        (res: Response) => {
          this.approversListRes = res;
          this.approversListShow = this.approversListRes.data.values.slice(
            0,
            this.approversListRes.data.values.length
          );
          this.getApproversList();
          this.isInputShow = true;
        },
        error => {
          this.resMessage = this.toastmessage.errorMessage(error, 'aduser');
          this.toast_pop('error', 'Oops!', this.resMessage);
        }
      );
    }
  }

  getApproversList() {
    let locArr = [];
    this.approversListShow = this.approversListRes.data.values.slice(
      0,
      this.approversListRes.data.values.length
    );
    if (this.service.approvers && this.approversListShow) {
      if (this.approversListShow.length > 0) {
        this.service.approvers.map((data, index) => {
          for (let i = 0; i < this.approversListShow.length; i++) {
            if (
              this.approversListShow[i].userId.toLowerCase() ===
              data.toLowerCase()
            ) {
              locArr.push(this.approversListShow[i]);
              this.approversListShow.splice(i, 1);
            }
          }
        });
      }
      if (locArr.length > 0) {
        this.selectedApprovers = locArr.slice(0);
        this.selectedApproversLocal = locArr.slice(0);
      }
    }
  }

  copy_link(id) {
    var element = null; // Should be <textarea> or <input>
    element = document.getElementById(id);
    element.select();
    try {
      document.execCommand('copy');
      this.copyLink = 'Link Copied';
      setTimeout(() => {
        this.copyLink = 'Copy Link';
      }, 3000);
    } finally {
      document.getSelection().removeAllRanges;
    }
  }

  onenvSelected($event) {
    if (this.listRuntime[this.service.runtime] !== $event) {
      Object.keys(environment.envLists).map(data => {
        if (environment.envLists[data] == $event) this.accSelected = data;
      });
      this.isEnvChanged = true;
    } else {
      this.isEnvChanged = false;
    }
  }

  //method to watch changes on minute tab
  onenvSelectedMins($event) {
    if (this.globalApprovalMin !== $event) {
      this.approvalMinutes = $event;
      this.approvalTimeChanged = true;
    }
    if (
      this.globalApprovalMin === $event &&
      this.globalApprovalHours === this.approvalHours
    )
      this.approvalTimeChanged = false;
  }

  //method to watch changes on hours tab
  onenvSelectedHours($event) {
    if (this.approvalHours !== $event) {
      this.approvalTimeChanged = true;
      this.approvalHours = $event;
      if ($event === 0) {
        if (this.minutesArray[0] === 0) {
          this.minutesArray = this.minutesArray.slice(1);
        }
        this.approvalMinutes = this.minutesArray[0];
        this.minuteDropDownDisable = false;
      } else if ($event === 24) {
        if (this.minutesArray[0] !== 0) {
          this.minutesArray.unshift(0);
        }
        this.minuteDropDownDisable = true;
        this.approvalMinutes = 0;
      } else {
        if (this.minutesArray[0] !== 0) {
          this.minutesArray.unshift(0);
        }
        this.minuteDropDownDisable = false;
      }
    }
    if (
      this.globalApprovalHours === $event &&
      this.globalApprovalMin === this.approvalMinutes
    )
      this.approvalTimeChanged = false;
  }

  onEventScheduleChange(val) {
    this.rateExpression.type = val;
    this.eventExpression.type = 'awsEventsNone';
    if (val == 'cron' && this.service.eventScheduleRate) {
      this.setEventScheduleRate();
    }
  }
  onAWSEventChange(val) {
    this.rateExpression.type = 'none';
    this.eventExpression.type = val;
  }
  public focusDynamo = new EventEmitter<boolean>();
  public focusKinesis = new EventEmitter<boolean>();
  public focusS3 = new EventEmitter<boolean>();
  public focusSQS = new EventEmitter<boolean>();

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

  chkSQS() {
    this.focusSQS.emit(true);
    return this.eventExpression.type === 'sqs';
  }

  openLink(link) {
    if (link) {
      window.open(link, '_blank');
    }
  }

  stageClicked(stg) {
    let url = '/services/' + this.service['id'] + '/' + stg;
    this.router.navigateByUrl(url);
  }

  ValidURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
      return false;
    } else {
      return true;
    }
  }

  showService(s) {}

  onApproverChange(newVal) {
    if (!newVal) {
      this.approversPlaceHolder = 'Start typing (min 3 chars)...';
      this.showApproversList = false;
    } else {
      this.approversPlaceHolder = '';
      if (newVal.length > 2 && this.approversListShow.length > 0) {
        this.approversList = this.myFilterPipe.transform(
          this.approversListShow,
          newVal
        );
        if (this.approversList.length > 300)
          this.approversList = this.approversList.slice(0, 300);
        this.showApproversList = true;
      } else this.showApproversList = false;
    }
  }

  //function for comparing the passed array with service.approvers
  compareApproversArray(firstArr) {
    let serviceApproverss = [];
    let selectApproverss = [];
    if (this.service.approvers && firstArr) {
      //to make list to lowercase so that we can compare
      this.service.approvers.map(x => {
        serviceApproverss.push(x.toLowerCase());
      });
      firstArr.map(x => {
        selectApproverss.push(x.userId.toLowerCase());
      });
      return (
        _.difference(selectApproverss, serviceApproverss).length +
        _.difference(serviceApproverss, selectApproverss).length
      );
    }
    return undefined;
  }

  selectApprovers(approver) {
    this.applc1 = '';
    this.approversPlaceHolder = 'Start typing (min 3 chars)...';
    this.approverInput.nativeElement.blur();
    this.approverInput.nativeElement.focus();
    this.approversTouched = true;
    this.selApprover = approver;
    let thisclass: any = this;
    this.showApproversList = false;
    thisclass.approverName = '';
    this.selectedApprovers.push(approver);

    if (this.selectedApprovers.length === 5) this.isInputShow = false; //not to show input box

    if (this.selectedApprovers.length > 0) this.approversLimitStatus = false;

    //checking for the difference in arrays
    if (this.compareApproversArray(this.selectedApprovers) !== 0) {
      this.approversSaveStatus = true;
    } else {
      this.approversSaveStatus = false;
    }
    for (var i = 0; i < this.approversListShow.length; i++) {
      if (this.approversListShow[i].displayName === approver.displayName) {
        this.approversListShow.splice(i, 1);
        return;
      }
    }
  }

  onTextAreaChange(desc_temp) {
    if (!desc_temp) {
      desc_temp = null;
    }
    this.update_payload.description = desc_temp;

    if (this.service.description !== desc_temp) {
      this.descriptionChanged = false;
    } else {
      this.descriptionChanged = true;
    }
  }

  loadPlaceholders() {
    if (this.service.tags != undefined)
      this.tags_temp = this.service.tags.join();

    this.desc_temp = this.service.description;
    this.email_temp = this.service.email;
    this.slackChannel_temp = this.service.slackChannel;
  }

  updateTags() {
    var payloag_tags;
    payloag_tags = this.tags_temp.split(',');
    payloag_tags.forEach(function(item, index) {
      payloag_tags[index] = item.trim();
    });
    this.update_payload.tags = payloag_tags;
  }

  openSidebar() {
    this.open_sidebar.emit(true);
  }

  private isCronObjValid(cronObj) {
    var cronValidity = this.cronParserService.validateCron(cronObj);
    this.cronFieldValidity = cronValidity;
    if (cronValidity.isValid === true) {
      return true;
    }
    return false;
  }

  onApplicationChange(newVal) {
    if (!newVal) {
      this.showApplicationList = false;
    } else {
      this.showApplicationList = true;
    }
  }

  focusInputApplication(event) {
    let applclocal1 = document.getElementById('applc');
    if (applclocal1) applclocal1.focus();
  }
  keypress(hash) {
    if (hash.key == 'ArrowDown') {
      this.focusindex++;
      if (this.focusindex > 0) {
        var pinkElements = document.getElementsByClassName('pinkfocus')[3];
      }
      if (this.focusindex > 2) {
        this.scrollList = {
          position: 'relative',
          top: '-' + (this.focusindex - 2) * 2.9 + 'rem',
        };
      }
    } else if (hash.key == 'ArrowUp') {
      if (this.focusindex > -1) {
        this.focusindex--;

        if (this.focusindex > 1) {
          this.scrollList = {
            position: 'relative',
            top: '-' + (this.focusindex - 2) * 2.9 + 'rem',
          };
        }
      }
      if (this.focusindex == -1) {
        this.focusindex = -1;
      }
    } else if (hash.key == 'Enter' && this.focusindex > -1) {
      this.approverInput.nativeElement.blur();
      event.preventDefault();
      this.approversPlaceHolder = 'Start typing(min 3 char)...';
      var pinkElement;
      pinkElement = document.getElementsByClassName('pinkfocususers')[0]
        .children;
      var approverObj = {
        displayName: pinkElement[0].attributes[2].value,
        givenName: pinkElement[0].attributes[3].value,
        userId: pinkElement[0].attributes[4].value,
        userEmail: pinkElement[0].attributes[5].value,
      };
      this.selectApprovers(approverObj);
      this.cdRef.markForCheck();
      this.showApproversList = false;
      this.focusindex = -1;
    } else {
      this.focusindex = -1;
    }
  }

  removeApprover(index, approver) {
    this.approversTouched = true;
    if (this.selectedApprovers.length > 0) {
      this.approversLimitStatus = false;
      this.approversListShow.push(approver);
      this.selectedApprovers.splice(index, 1);
    } else {
      this.approversLimitStatus = true;
    }
    if (this.compareApproversArray(this.selectedApprovers) > 0) {
      this.approversSaveStatus = true;
    } else {
      this.approversSaveStatus = false;
    }
    if (this.selectedApprovers.length == 0) {
      this.approversLimitStatus = true;
      this.approversSaveStatus = false;
    }
    if (this.selectedApprovers.length == 5) this.isInputShow = false;
    else this.isInputShow = true;
  }

  removeApplication(index, app) {
    this.oneSelected = false;
    this.isAppTouched = true;
    this.dispAppError = false;
    this.selectApp = {};
    this.showAppclInput = true;
    this.appPlaceHolder = 'Start typing...';
    this.selectedApplications = [];
  }

  focusInput(event) {
    if (this.isInputShow) document.getElementById('applc1').focus();
  }

  blurApplication() {
    setTimeout(() => {
      this.applc = '';
      this.showApplicationList = false;
    }, 200);
  }

  keypressApplication(hash) {
    if (hash.key == 'ArrowDown') {
      this.focusindex++;
      if (this.focusindex > 0) {
        var pinkElements = document.getElementsByClassName(
          'pinkfocusapplication'
        )[0];
        if (pinkElements == undefined) {
          this.focusindex = 0;
        }
        // var id=pinkElements.children[0].innerHTML;
      }
      if (this.focusindex > 2) {
        this.scrollList = {
          position: 'relative',
          top: '-' + (this.focusindex - 2) * 2.9 + 'rem',
        };
      }
    } else if (hash.key == 'ArrowUp') {
      if (this.focusindex > -1) {
        this.focusindex--;

        if (this.focusindex > 1) {
          this.scrollList = {
            position: 'relative',
            top: '-' + (this.focusindex - 2) * 2.9 + 'rem',
          };
        }
      }
      if (this.focusindex == -1) {
        this.focusindex = -1;
      }
    } else if (hash.key == 'Enter' && this.focusindex > -1) {
      if (this.accounts.length == 0) {
        this.showApplicationList = false;
      }
      event.preventDefault();
      var pinkElement = document.getElementsByClassName(
        'pinkfocusapplication'
      )[0].children;

      var appobj = {
        issueID: pinkElement[0].attributes[3].value,
        appName: pinkElement[0].attributes[2].value,
      };

      this.selectApplication(appobj);
      this.showApplicationList = false;
      this.focusindex = -1;
    } else {
      this.focusindex = -1;
    }
  }

  selectApp;
  selectApplication(app) {
    this.dispAppError = true;
    this.isAppTouched = true;
    this.showAppclInput = false;
    this.oneSelected = true;
    this.selectApp = app;
    let thisclass: any = this;
    this.showApplicationList = false;
    thisclass.applc1 = '';
    this.selectedApplications.push(app);
    let nonRepeatedData = data => data.filter((v, i) => data.indexOf(v) === i);
    this.application_arr = nonRepeatedData(this.application_arr);
    return;
  }

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
          this.cronObj = new CronObject(
            '0/' + duration,
            '*',
            '*',
            '*',
            '?',
            '*'
          );
        } else if (interval == 'Hours') {
          this.cronObj = new CronObject(
            '0',
            '0/' + duration,
            '*',
            '*',
            '?',
            '*'
          );
        } else if (interval == 'Days') {
          this.cronObj = new CronObject(
            '0',
            '0',
            '1/' + duration,
            '*',
            '?',
            '*'
          );
        }
        this.rateExpression.isValid = true;
        this.rateExpression.cronStr = this.cronParserService.getCronExpression(
          this.cronObj
        );
      }
    } else if (rateExpression['type'] == 'cron') {
      var cronExpression;
      var cronObj = this.cronObj;
      var cronObjFields = this.cronParserService.cronObjFields;
      var _isCronObjValid = this.isCronObjValid(cronObj);

      if (_isCronObjValid === false) {
        this.rateExpression.isValid = false;
        this.rateExpression.error = 'Please enter a valid cron expression';
      } else {
        this.rateExpression.isValid = true;
        this.rateExpression.cronStr = this.cronParserService.getCronExpression(
          this.cronObj
        );
      }
    }

    if (this.rateExpression.isValid === undefined) {
      return undefined;
    } else if (this.rateExpression.isValid === false) {
      return 'invalid';
    } else if (this.rateExpression.isValid === true) {
      return this.rateExpression.cronStr;
    }
  }

  getAppName(app) {
    if (app) {
      this.selectedApplicationLocal = [];
      //checking the complete app list arrived
      if (this.application_arr.length > 200) {
        this.isapplicationDisable = false;
        this.showAppclInput = false;
        this.selectedApplications = [];
        if (this.application_arr.length > 100) {
          let localRef = this.application_arr.filter(
            a => a.appID == app.app_id || a.issueID == app.app_id
          );
          if (localRef.appID == app.app_id) {
            localRef = localRef.slice(0);
          }
          if (localRef.length == 0) {
            localRef[0] = app;
          }
          this.selectedApplications.push(localRef[0]);
          this.selectedApplicationLocal.push(localRef[0]);
          this.appNameVis = this.selectedApplications[0].appName;
          return;
        }
      }
      //getting the app list
      setTimeout(() => {
        this.getAppName(app);
      }, 500);
    }
  }

  onSelectedDr(selected) {
    this.rateExpression.interval = selected;
    this.generateExpression(this.rateExpression);
  }

  onEditClick() {
    this.descriptionChanged = true;
    this.loadPlaceholders();
    var appobj = {
      issueID: '',
      appName: this.service.app_name,
    };
    if (this.service.app_name && this.selectedApplications.length == 0)
      this.selectApplication(appobj);
    this.disp_show = false;
    //to check approver limit on edit
    if (this.selectedApprovers.length === 5) this.isInputShow = false;
  }

  onEditClickAdvanced() {
    this.disp_show2 = false;
    this.publicSelected = this.publicInitial;
    this.cdnConfigSelected = this.cdnConfigInitial;
  }
  onCompleteClick() {
    this.isPUTLoading = true;
    this.http
      .put('/jazz/services/' + this.service.id, this.PutPayload)
      .subscribe(
        Response => {
          this.isPUTLoading = false;
          this.advancedSaveClicked = false;
          this.disp_show = true;
          this.disp_show2 = true;
          this.isLoadingService = true;
          this.serviceDetail.onDataFetched(Response.data);
          this.isLoadingService = false;
          this.loadPlaceholders();
          this.disp_show = true;
          this.saveClicked = false;
          this.selectedApplications = [];
          let successMessage = this.toastmessage.successMessage(
            Response,
            'updateService'
          );
          this.toast_pop(
            'success',
            '',
            'Data for service: ' + this.service.name + ' ' + successMessage
          );
        },
        Error => {
          this.isLoadingService = false;
          this.isPUTLoading = false;
          this.advancedSaveClicked = false;
          this.disp_show = true;
          this.disp_show2 = true;
          this.saveClicked = false;
          this.edit_save = 'SAVE';
          let errorMessage = this.toastmessage.errorMessage(
            Error,
            'updateService'
          );
          this.toast_pop('error', 'Oops!', errorMessage);
          // this.toast_pop('error','Oops!', "Data cannot be updated. Service Error.");
        }
      );
  }
  onAdvancedSaveClick() {
    this.saveClicked = false;
    this.advancedSaveClicked = true;
    let payload = {};
    let obJ = {};

    if (this.advancedSaveClicked) {
      if (this.rateExpression.type) {
        if (this.rateExpression.type != 'none') {
          this.rateExpression.cronStr = this.cronParserService.getCronExpression(
            this.cronObj
          );
          if (this.rateExpression.cronStr == 'invalid') {
            return;
          } else if (this.rateExpression.cronStr !== undefined) {
            obJ['eventScheduleRate'] = `cron(${this.rateExpression.cronStr})`;
          }
        } else {
          obJ['eventScheduleRate'] = null;
        }
      }

      if (this.eventExpression.type) {
        if (this.eventExpression.type !== 'awsEventsNone') {
          var event = {};
          event['type'] = this.eventExpression.type;
          if (this.eventExpression.type === 'dynamodb') {
            event['source'] =
              this.awsEventExpression.dynamodb +
              this.eventExpression.dynamoTable;
            event['action'] = 'PutItem';
          } else if (this.eventExpression.type === 'kinesis') {
            event['source'] =
              this.awsEventExpression.kinesis + this.eventExpression.streamARN;
            event['action'] = 'PutRecord';
          } else if (this.eventExpression.type === 's3') {
            event['source'] = this.eventExpression.S3BucketName;
            event['action'] = 's3:ObjectCreated:*';
          } else if (this.eventExpression.type === 'sqs') {
            event['source'] =
              this.awsEventExpression.sqs + this.eventExpression.SQSstreamARN;
            event['action'] = 'PutItem';
          }
          let locEventArr = [];
          locEventArr.push(event);
          obJ['events'] = locEventArr;
        } else {
          var event = {};
          event['type'] = 'NA';
          event['source'] = 'NA';
          event['action'] = 'NA';
          let locEventArr = [];
          locEventArr.push(event);
          obJ['events'] = locEventArr;
        }
      }
      if (this.requireInternalAccess !== this.service.require_internal_access) {
        obJ['require_internal_access'] = this.requireInternalAccess;
      }
      if (this.publicSelected !== this.publicInitial) {
        obJ['is_public_endpoint'] = this.publicSelected;
      }
      if (this.cdnConfigSelected !== this.cdnConfigInitial) {
        obJ['create_cloudfront_url'] = this.cdnConfigSelected;
      }
      if (this.service.enable_api_security !== this.enableApiSecurity) {
        obJ['enable_api_security'] = this.enableApiSecurity;
      }
    }
    payload['metadata'] = obJ;
    this.PutPayload = payload;
    if (Object.keys(this.PutPayload).length > 0) this.isPayloadAvailable = true;
  }

  onSaveClick() {
    this.changeCounterApp = 0;
    this.showApprovalField = false;
    this.showGeneralField = false;
    this.isApproversChanged = false;
    this.approversSaveStatus = false;
    this.saveClicked = true;
    this.advancedSaveClicked = false;
    this.descriptionChanged = true;
    this.approvalTimeChanged = false;
    this.isEnvChanged = false;
    this.approvalTime = this.approvalHours * 60 + this.approvalMinutes;
    let payload = {};
    if (this.saveClicked) {
      if (this.desc_temp != this.service.description) {
        payload['description'] = this.desc_temp;
      }
      if (this.slackChannel_temp != this.service.slackChannel) {
        payload['slack_channel'] = this.slackChannel_temp;
      }
      if (this.accSelected != this.service.runtime) {
        payload['metadata'] = {
          providerRuntime: this.accSelected,
        };
      }
      if (this.selectedApplications[0].appName != this.service.app_name) {
        payload['metadata'] = {
          app_id: this.selectedApplications[0].appID,
        };
        payload['app_name'] = this.selectedApplications[0].appName;
      }
      if (this.compareApproversArray(this.selectedApprovers) > 0) {
        let localData = [];
        this.selectedApprovers.map(data => {
          localData.push(data.userId);
        });
        payload['metadata'] = {
          approvers: localData,
        };
      }
      if (
        this.approvalTime != this.service.approvalTimeOutInMins &&
        this.approvalTime
      ) {
        payload['metadata'] = {
          approvalTimeOutInMins: this.approvalTime,
        };
      }
    }
    this.PutPayload = payload;
    if (Object.keys(this.PutPayload).length > 0) this.isPayloadAvailable = true;
  }

  resetSelectedApprovers() {
    this.selectedApprovers = this.selectedApproversLocal.slice(0);
  }

  cancelAdvanceSave() {
    event.stopPropagation();
    this.saveClicked = false;
    this.advancedSaveClicked = false;
    this.onCancelClick();
  }

  onCancelClick() {
    this.showApprovalField = false;
    this.showGeneralField = false;
    this.showApproversList = false;
    this.isAppTouched = false;
    this.approversSaveStatus = false;
    this.changeCounterApp = 0;
    this.approversLimitStatus = false;
    this.isInputShow = true;
    this.enableApiSecurity = this.service.enable_api_security;
    this.requireInternalAccess = this.service.require_internal_access;
    this.dispAppError = false;
    this.update_payload = {};
    this.selectedApplications = this.selectedApplicationLocal.slice(0);
    if (this.selectedApplications.length > 0) {
      this.showAppclInput = false;
    }
    this.setApprovalData();
    this.approvalTimeChanged = false;
    this.accSelected = this.service.runtime;
    this.isEnvChanged = false;
    this.oneSelected = false;
    this.disp_show = true;
    this.disp_show2 = true;
    this.edit_save = 'EDIT';
    this.showCancel = false;
    this.descriptionChanged = true;
    this.hide_email_error = true;
    this.hide_slack_error = true;
    this.isSlackAvailable = false;
    if (this.subscription != undefined) this.subscription.unsubscribe();
    this.show_loader = false;
    this.disableSaveBtn();
    this.resetSelectedApprovers();
  }
  toast_pop(error, oops, errorMessage) {
    var tst = document.getElementById('toast-container');
    tst.classList.add('toaster-anim');
    this.toasterService.pop(error, oops, errorMessage);
    setTimeout(() => {
      tst.classList.remove('toaster-anim');
    }, 3000);
  }

  popup(state, id) {
    if (state == 'enter') {
      var ele = document.getElementById(id);
      ele.classList.add('endp-visible');
    }
    if (state == 'leave') {
      var ele = document.getElementById(id);
      ele.classList.remove('endp-visible');
    }
  }

  checkSlackNameAvailability() {
    if (this.slackChannel_temp == '') {
      this.hide_slack_error = true;
      this.isSlackAvailable = true;
      return;
    }
    this.validateChannelName();
    return;
  }

  check_email_valid() {
    var regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (
      this.email_temp == '' ||
      this.email_temp == null ||
      this.email_temp == undefined
    ) {
      this.hide_email_error = true;
      this.service.email = this.email_temp;
    } else {
      if (!regex.test(this.email_temp)) {
        //if it doesnt match with email pattern
        this.hide_email_error = false;
        this.email_valid = false;
      } //email matches
      else {
        this.hide_email_error = true;

        // this.service.email=this.email_temp;
        this.email_valid = true;
      }
    }
  }

  public validateChannelName() {
    this.isSlackAvailable = false;
    this.show_loader = true;
    if (this.slackChannel_temp == '' || this.slackChannel_temp == null) {
      this.hide_slack_error = true;
      this.show_loader = false;
    } else {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = this.http
        .get(
          '/platform/is-slack-channel-available?slack_channel=' +
            this.slackChannel_temp
        )
        .subscribe(
          Response => {
            let isAvailable = Response.data.is_available;

            this.isSlackAvailable = isAvailable;
            if (isAvailable) {
              //if valid
              this.hide_slack_error = true;
            } else {
              this.hide_slack_error = false;
            }
            this.show_loader = false;
          },
          error => {
            var err = error;
            this.show_loader = false;
          }
        );
    }
  }

  disableSaveBtn() {
    if (!this.hide_slack_error) {
      return true;
    }
    if (!this.hide_email_error) {
      return true;
    }
    if (this.show_loader) {
      return true;
    }
    return false;
  }

  slack_link() {
    if (
      this.service.slackChannel == '' ||
      this.service.slackChannel == undefined
    ) {
      //do nothing
    } else {
      this.slackChannel_link =
        'https://t-mo.slack.com/messages/' + this.service.slackChannel;
      this.openLink(this.slackChannel_link);
    }
  }

  check_empty_fields() {
    if (
      this.service.description == undefined ||
      this.service.description == null ||
      this.service.description == ''
    ) {
      this.description_empty = true;
    } else {
      this.description_empty = false;
    }
    if (
      this.service.approvers == undefined ||
      this.service.approvers == null ||
      this.service.approvers == ''
    ) {
      this.approvers_empty = false;
    }
    if (
      this.service.domain == undefined ||
      this.service.domain == null ||
      this.service.domain == ''
    ) {
      this.domain_empty = true;
    }
    if (
      this.service.serviceType == undefined ||
      this.service.serviceType == null ||
      this.service.serviceType == ''
    ) {
      this.serviceType_empty = true;
    }
    if (
      this.service.email == undefined ||
      this.service.email == null ||
      this.service.email == ''
    ) {
      this.email_empty = true;
    } else {
      this.email_empty = false;
      this.email_temp = this.service.email;
    }
    if (
      this.service.slackChannel == undefined ||
      this.service.slackChannel == null ||
      this.service.slackChannel == ''
    ) {
      this.slackChannel_empty = true;
    } else {
      this.slackChannel_empty = false;
      this.slackChannel_temp = this.service.slackChannel;
    }
    if (
      this.service.repository == undefined ||
      this.service.repository == null ||
      this.service.repository == ''
    ) {
      this.repository_empty = true;
    }
    if (
      this.service.runtime == undefined ||
      this.service.runtime == null ||
      this.service.runtime == ''
    ) {
      this.runtime_empty = true;
    } else {
      this.runtime_empty = false;
    }
    if (
      this.service.tags == undefined ||
      this.service.tags == null ||
      this.service.tags == ''
    ) {
      this.tags_empty = true;
    } else {
      this.tags_empty = false;
    }
  }

  serviceCreationStatus() {
    this.statusprogress = 20;
    this.creating = true;
    this.deleting = false;
    this.intervalSubscription = Observable.interval(5000)
      .switchMap(response =>
        this.http.get('/jazz/request-status?id=' + this.service_request_id)
      )
      .subscribe(
        response => {
          let dataResponse = <any>{};
          dataResponse.list = response;
          var respStatus = dataResponse.list.data;
          if (respStatus.status.toLowerCase() === 'completed') {
            this.statusCompleted = true;
            this.serviceStatusCompleted = true;
            this.serviceStatusPermission = true;
            this.serviceStatusRepo = true;
            this.serviceStatusValidate = true;
            this.statusInfo = 'Wrapping things up';
            this.statusprogress = 100;
            localStorage.removeItem(
              'request_id' + '_' + this.service.name + '_' + this.service.domain
            );
            // alert('last stage');
            this.http
              .get('/jazz/services/' + this.service.id)
              .subscribe(response => {
                this.serviceDetail.onDataFetched(response.data);
              });
            this.intervalSubscription.unsubscribe();
            setTimeout(() => {
              this.service_error = false;
            }, 5000);
          } else if (respStatus.status.toLowerCase() === 'failed') {
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
              if (
                element.name === 'TRIGGER_FOLDERINDEX' &&
                element.status === 'COMPLETED'
              ) {
                this.serviceStatusCompleted = true;
                this.statusInfo = 'Wrapping things up';
                this.statusprogress = 100;
                localStorage.removeItem(
                  'request_id' + this.service.name + this.service.domain
                );
              } else if (
                element.name === 'ADD_WRITE_PERMISSIONS_TO_SERVICE_REPO' &&
                element.status === 'COMPLETED'
              ) {
                this.serviceStatusPermission = true;
                this.statusInfo = 'Adding required permissions';
                this.statusprogress = 85;
              } else if (
                element.name === 'PUSH_TEMPLATE_TO_SERVICE_REPO' &&
                element.status === 'COMPLETED'
              ) {
                this.serviceStatusRepo = true;
                this.statusInfo = 'Getting your code ready';
                this.statusprogress = 60;
              } else if (
                element.name === 'VALIDATE_INPUT' &&
                element.status === 'COMPLETED'
              ) {
                this.serviceStatusValidate = true;
                this.statusInfo = 'Validating your request';
                this.statusprogress = 35;
              } else if (
                element.name === 'CALL_ONBOARDING_WORKFLOW' &&
                element.status === 'COMPLETED'
              ) {
                this.serviceStatusStarted = true;
                this.statusInfo = 'Service Creation started';
                this.statusprogress = 20;
              }
            });
          }
          document
            .getElementById('current-status-val')
            .setAttribute('style', 'width:' + this.statusprogress + '%');
        },
        error => {
          this.service_error = false;
          this.serviceCreationStatus();
        }
      );
  }

  modifyEnvArr() {
    var j = 0;
    var k = 2;
    this.sortEnvArr();

    if (this.environ_arr != undefined)
      for (var i = 0; i < this.environ_arr.length; i++) {
        this.environ_arr[i].status = this.environ_arr[i].status.replace(
          '_',
          ' '
        );
        // this.environ_arr[i].status=this.environ_arr[i].status.split(" ").join("\ n")
        if (
          this.environ_arr[i].logical_id == 'prd' ||
          this.environ_arr[i].logical_id == 'prod'
        ) {
          this.prodEnv = this.environ_arr[i];
          continue;
        }
        if (this.environ_arr[i].logical_id == 'stg') {
          this.stgEnv = this.environ_arr[i];
          continue;
        } else {
          this.Environments[j] = this.environ_arr[i];
          this.envList[k] = this.environ_arr[i].logical_id;
          if (this.environ_arr[i].friendly_name != undefined) {
            this.friendlist[k++] = this.environ_arr[i].friendly_name;
          } else {
            this.friendlist[k++] = this.environ_arr[i].logical_id;
          }

          j++;
        }
      }
    this.list = {
      env: this.envList,
      friendly_name: this.friendlist,
    };

    if (this.Environments.length == 0) {
      this.noSubEnv = true;
    }
    if (this.prodEnv.logical_id == undefined) {
      this.noProd = true;
    }
    if (this.stgEnv.logical_id == undefined) {
      this.noStg = true;
    }

    // this.envList
    this.cache.set('envList', this.list);
  }

  sortEnvArr() {
    var j = 0;
    var k = 0;

    for (var i = 0; i < this.environ_arr.length; i++) {
      if (this.environ_arr[i].status != 'inactive') {
        this.list_env[j] = this.environ_arr[i];

        // this.list_env[i]
        j++;
      }
      if (this.environ_arr[i].status == 'inactive') {
        this.list_inactive_env[k] = this.environ_arr[i];
        k++;
      }
    }
    this.environ_arr = this.list_env.slice(0, this.list_env.length);

    this.environ_arr.push.apply(this.environ_arr, this.list_inactive_env);
  }

  getenvData() {
    this.isenvLoading = true;
    this.ErrEnv = false;
    if (this.service == undefined) {
      return;
    }
    // this.http.get('https://cloud-api.corporate.t-mobile.com/api/jazz/environments?domain=jazztesting&service=test-multienv').subscribe(
    this.http
      .get(
        '/jazz/environments?domain=' +
          this.service.domain +
          '&service=' +
          this.service.name
      )
      .subscribe(
        response => {
          this.isenvLoading = false;
          this.environ_arr = response.data.environment;
          if (this.environ_arr != undefined)
            if (this.environ_arr.length == 0 || response.data == '') {
              this.noEnv = true;
            }
          this.ErrEnv = false;

          this.modifyEnvArr();
        },
        err => {
          this.isenvLoading = false;
          console.log('error', err);
          this.ErrEnv = true;
          if (err.status == 404) this.err404 = true;
          this.errMessage = 'Something went wrong while fetching your data';
          this.errMessage = this.toastmessage.errorMessage(err, 'environment');
          var payload = {
            domain: +this.service.domain,
            service: this.service.name,
          };
          this.getTime();
          this.errorURL = window.location.href;
          this.errorAPI =
            'https://cloud-api.corporate.t-mobile.com/api/jazz/environments';
          this.errorRequest = payload;
          this.errorUser = this.authenticationservice.getUserId();
          this.errorResponse = JSON.parse(err._body);
        }
      );
  }

  getTime() {
    var now = new Date();
    this.errorTime =
      now.getMonth() +
      1 +
      '/' +
      now.getDate() +
      '/' +
      now.getFullYear() +
      ' ' +
      now.getHours() +
      ':' +
      (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()) +
      ':' +
      (now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds());
  }

  feedbackRes: boolean = false;
  openModal: boolean = false;
  feedbackMsg: string = '';
  feedbackResSuccess: boolean = false;
  feedbackResErr: boolean = false;
  isFeedback: boolean = false;
  toast: any;
  model: any = {
    userFeedback: '',
  };
  buttonText: string = 'SUBMIT';
  isLoading: boolean = false;
  sjson: any = {};
  djson: any = {};

  reportIssue() {
    this.json = {
      user_reported_issue: this.model.userFeedback,
      API: this.errorAPI,
      REQUEST: this.errorRequest,
      RESPONSE: this.errorResponse,
      URL: this.errorURL,
      'TIME OF ERROR': this.errorTime,
      'LOGGED IN USER': this.errorUser,
    };

    this.openModal = true;
    this.errorChecked = true;
    this.isLoading = false;
    this.errorInclude = JSON.stringify(this.djson);
    this.sjson = JSON.stringify(this.json);
  }

  openFeedbackForm() {
    this.isFeedback = true;
    this.model.userFeedback = '';
    this.feedbackRes = false;
    this.feedbackResSuccess = false;
    this.feedbackResErr = false;
    this.isLoading = false;
    this.buttonText = 'SUBMIT';
  }

  mailTo() {
    location.href =
      'mailto:serverless@t-mobile.com?subject=Jazz : Issue reported by' +
      ' ' +
      this.authenticationservice.getUserId() +
      '&body=' +
      this.sjson;
  }

  errorIncluded() {}

  submitFeedback(action) {
    this.errorChecked = (<HTMLInputElement>(
      document.getElementById('checkbox-slack')
    )).checked;
    if (this.errorChecked == true) {
      this.json = {
        user_reported_issue: this.model.userFeedback,
        API: this.errorAPI,
        REQUEST: this.errorRequest,
        RESPONSE: this.errorResponse,
        URL: this.errorURL,
        'TIME OF ERROR': this.errorTime,
        'LOGGED IN USER': this.errorUser,
      };
    } else {
      this.json = this.model.userFeedback;
    }
    this.sjson = JSON.stringify(this.json);

    this.isLoading = true;

    if (action == 'DONE') {
      this.openModal = false;
      return;
    }

    var payload = {
      title:
        'Jazz: Issue reported by ' + this.authenticationservice.getUserId(),
      project_id: 'CAPI',
      priority: 'P4',
      description: this.json,
      created_by: this.authenticationservice.getUserId(),
      issue_type: 'bug',
    };
    this.http.post('/platform/jira-issues', payload).subscribe(
      response => {
        this.buttonText = 'DONE';
        this.isLoading = false;
        this.model.userFeedback = '';
        var respData = response.data;
        this.feedbackRes = true;
        this.feedbackResSuccess = true;
        if (respData != undefined && respData != null && respData != '') {
          this.feedbackMsg =
            'Thanks for reporting the issue. We’ll use your input to improve Jazz experience for everyone!';
        }
      },
      error => {
        this.buttonText = 'DONE';
        this.isLoading = false;
        this.feedbackResErr = true;
        this.feedbackRes = true;
        this.feedbackMsg = this.toastmessage.errorMessage(error, 'jiraTicket');
      }
    );
  }

  frndload(event) {}

  is_multi_env: boolean = false;

  ngOnInit() {
    if (environment.envName == 'oss')
      if (environment.multi_env == false) this.multiENV = false;
    if (environment.multi_env) this.is_multi_env = true;
    if (environment.envName == 'oss') this.internal_build = false;

    this.service.accounts = 'tmo-dev-ops, tmo-int';
    this.service.regions = 'us-west-2, us-east';

    this.createloader = true;
    if (
      this.service.status == 'deletion completed' ||
      this.service.status == 'deletion started'
    ) {
      this.showcanvas = true;
    } else {
      this.showcanvas = false;
    }
    this.showCancel = false;

    if (
      this.service.status == 'creation started' ||
      this.service.status == 'deletion started'
    ) {
      try {
        this.reqJson = JSON.parse(
          localStorage.getItem(
            'request_id' + '_' + this.service.name + '_' + this.service.domain
          )
        );

        this.service_request_id = this.reqJson.request_id;
      } catch (e) {
        console.log(e);
      }
    } else {
      localStorage.removeItem(
        'request_id' + '_' + this.service.name + '_' + this.service.domain
      );
    }
    this.creation_status = this.service.status;
    this.animatingDots = '...';
    this.testingStatus();
  }

  testingStatus() {
    setInterval(() => {
      this.onload.emit(this.service.status);
    }, 500);
  }

  ngAfterContentInit() {
    this.setApprovalData();
  }

  //method responsible for conversion of minutes in hours and minutes.
  setApprovalData() {
    this.approvalTime = +this.service.approvalTimeOutInMins;
    if (this.approvalTime / 60 >= 1) {
      this.approvalHours = Math.floor(this.approvalTime / 60);
      this.globalApprovalHours = this.approvalHours;
      if (this.approvalHours > 0 && this.minutesArray[0] !== 0)
        this.minutesArray.unshift(0);
      //adding zero
      else if (this.approvalHours === 0 && this.minutesArray[0] === 0)
        this.minutesArray = this.minutesArray.slice(1); //removing zero

      this.approvalMinutes = this.approvalTime - this.approvalHours * 60; //calculating minutes
      this.globalApprovalMin = this.approvalMinutes;
      if (this.approvalHours === 1)
        this.displayApprovalTime = `${this.approvalHours} hour ${
          this.approvalMinutes
        } minutes`;
      else if (this.approvalHours !== 1)
        this.displayApprovalTime = `${this.approvalHours} hours ${
          this.approvalMinutes
        } minutes`;
    } else if (this.approvalTime) {
      this.approvalMinutes = this.approvalTime;
      this.globalApprovalMin = this.approvalMinutes;
      this.displayApprovalTime = `${this.approvalMinutes ||
        this.service.approvalTimeOutInMins} minutes`;
    }
  }

  transform_env_oss(data) {
    var arrEnv = data.data.environment;
    if (environment.multi_env) {
      for (var i = 0; i < arrEnv.length; i++) {
        arrEnv[i].status = arrEnv[i].status.replace('_', ' ');
        if (arrEnv[i].logical_id == 'prod') this.prodEnv = arrEnv[i];
        else this.Environments.push(arrEnv[i]);
      }
    } else {
      for (var i = 0; i < arrEnv.length; i++) {
        arrEnv[i].status = arrEnv[i].status.replace('_', ' ');
        if (arrEnv[i].logical_id == 'prod') this.prodEnv = arrEnv[i];
        else this.stgEnv = arrEnv[i];
      }
    }
    arrEnv[0].status.replace('_', ' ');
  }

  envfoross() {
    var url_multi_env = 'https://api.myjson.com/bins/k6qvn';
    var url_dev_prod = 'https://api.myjson.com/bins/vhzdf';
    var chosen_url;
    if (environment.multi_env) {
      chosen_url = url_multi_env;
    } else {
      chosen_url = url_dev_prod;
    }

    this.http.get(chosen_url).subscribe(
      response => {
        this.transform_env_oss(response);
        // var spoon = response.data.environment;
        // console.log("spoon == ", spoon[1])
        // for(var i=0 ; i < spoon.length ; i++ ){
        //    if(spoon[i].friendly_name != undefined){
        //        this.friendly_name = spoon[i].friendly_name;
        //    }
        // }
        // this.friendly_name = response
        // this.isenvLoading=false;
        //   this.environ_arr=response.data.environment;
        //   if(this.environ_arr!=undefined)
        //     if(this.environ_arr.length==0 || response.data==''){
        //             this.noEnv=true;
        //     }
        //   this.ErrEnv=false;

        //   var obj1={"service":"test-create","domain":"jazz-testing","last_updated":"2017-10-16T08:02:13:210","status":"active","created_by":"aanand12","physical_id":"master","created":"2017-10-16T08:02:13:210","id":"f7635ea9-26ad-0661-4e52-14fd48421e22","logical_id":"dev"}
        //   var obj2={"service":"test-create","domain":"jazz-testing","last_updated":"2017-10-16T08:02:13:210","status":"active","created_by":"aanand12","physical_id":"master","created":"2017-10-16T08:02:13:210","id":"f7635ea9-26ad-0661-4e52-14fd48421e22","logical_id":"feature"}
        //   var obj3={"service":"test-create","domain":"jazz-testing","last_updated":"2017-10-16T08:02:13:210","status":"active","created_by":"aanand12","physical_id":"master","created":"2017-10-16T08:02:13:210","id":"f7635ea9-26ad-0661-4e52-14fd48421e22","logical_id":"stg"}
        //   this.environ_arr[1]=obj1;
        //   this.environ_arr[2]=obj2;
        //   this.environ_arr[3]=obj3;
        //   this.modifyEnvArr();
      },
      err => {
        // this.isenvLoading=false;

        console.log('oss error', err);
      }
    );
  }

  public getJSON(): Observable<any> {
    console.log('file path-------', environment.configFile);
    return this.http
      .get('./../../../../' + environment.configFile)
      .map((response: Response) => {
        const data = response.json();
        return data;
      });
  }

  setEventScheduleRate() {
    let localEvenSchedule = this.service.eventScheduleRate;
    localEvenSchedule = localEvenSchedule.replace(/[\(\)']+/g, ' ');
    localEvenSchedule = localEvenSchedule.split(' ');
    this.rateExpression.type = localEvenSchedule[0];
    this.cronObj.minutes = localEvenSchedule[1];
    this.cronObj.hours = localEvenSchedule[2];
    this.cronObj.dayOfMonth = localEvenSchedule[3];
    this.cronObj.month = localEvenSchedule[4];
    this.cronObj.dayOfWeek = localEvenSchedule[5];
    this.cronObj.year = localEvenSchedule[6];
  }

  refresh_env() {
    this.envComponent.refresh();
  }
  internal_build: boolean = true;

  ngOnChanges(x: any) {
    this.selectedApprovers = [];
    this.selectedApplications = [];
    if (environment.multi_env) this.is_multi_env = true;
    if (environment.envName == 'oss') this.internal_build = false;
    var obj;
    //setting the value of approvalTimeOut
    if (this.service.approvalTimeOutInMins) {
      this.setApprovalData();
    }
    if (this.service.approvers) {
      this.service.approvers.map(data => {
        let obj = {
          userId: data,
        };
        this.selectedApprovers.push(obj);
      });
      //saving the value
      this.isInputShow = true;
      this.selectedApproversLocal = this.selectedApprovers.slice(0);
      this.changeCounterApp = 1;
      if (this.service.approvers.length == 5) {
        this.isInputShow = false;
      }
    }
    if (this.service.enable_api_security) {
      this.enableApiSecurity = this.service.enable_api_security;
    }
    if (this.service.approvers) {
      if (
        Object.keys(this.service.approvers).length ==
        Object.keys(this.selectedApprovers).length
      ) {
        this.getApproversList();
      }
    }

    if (this.service.eventScheduleRate) {
      this.setEventScheduleRate();
    }

    if (this.service.app_id) {
      let obj = {
        appName: this.service.app_name || this.service.app_id,
        app_id: this.service.app_id,
      };
      this.selectedApplications.push(obj);
      this.getAppName(obj);
    }
    this.loadPlaceholders();

    this.prodEnv = {};
    this.stgEnv = {};

    this.publicInitial = this.service.is_public_endpoint;
    this.cdnConfigInitial = this.service.create_cloudfront_url;
    this.vpcInitial = this.service.require_internal_access;
    this.requireInternalAccess = this.service.require_internal_access;

    // this.selectedApplications[0] = this.service.app_name;
    if (!this.internal_build) {
      this.envfoross();
    }

    this.check_empty_fields();

    setTimeout(() => {
      this.islink = this.ValidURL(this.service.repository);
      if (this.islink) {
        if (this.internal_build) {
          this.bitbucketRepo = 'View on Bitbucket';
        } else {
          this.bitbucketRepo = 'Git Repo';
        }
        // this.bitbucketRepo = "View on Bitbucket";
        this.repositorylink = this.service.repository;
      } else if (this.service.repository === '[Archived]') {
        this.bitbucketRepo = 'Archived';
        this.repositorylink = '';
      }
    }, 100);

    if (
      this.service.status == 'creation started' ||
      this.service.status == 'deletion started'
    ) {
      try {
        this.reqJson = JSON.parse(
          localStorage.getItem(
            'request_id' + '_' + this.service.name + '_' + this.service.domain
          )
        );

        this.service_request_id = this.reqJson.request_id;
      } catch (e) {
        console.log(e);
      }
    } else {
      localStorage.removeItem(
        'request_id' + '_' + this.service.name + '_' + this.service.domain
      );
    }
    this.creation_status = this.service.status;
    this.animatingDots = '...';
    this.testingStatus();

    // request status api call
    if (
      this.service.status === 'creation started' &&
      !this.serviceStatusCompleted &&
      this.service_request_id != undefined
    ) {
      this.serviceCreationStatus();
    } else if (
      this.service.status === 'deletion started' &&
      !this.serviceStatusCompleted
    ) {
      this.serviceDeletionStatus();
    }
  }
  ngOnDestroy() {
    //unsubscribe  request status api call
    if (
      (this.service.status === 'creation started' ||
        this.service.status === 'deletion started') &&
      this.intervalSubscription
    ) {
      this.intervalSubscription.unsubscribe();
    }
  }

  serviceDeletionStatus() {
    this.creating = false;
    this.deleting = true;

    this.intervalSubscription = Observable.interval(5000)
      .switchMap(response =>
        this.http.get('/jazz/request-status?id=' + this.service_request_id)
      )
      .subscribe(
        response => {
          this.createloader = false;
          let dataResponse = <any>{};
          dataResponse.list = response;
          var respStatus = dataResponse.list.data;
          if (respStatus.status.toLowerCase() === 'completed') {
            this.statusCompleted = true;
            this.serviceStatusCompleted = true;
            this.serviceStatusPermission = true;
            this.serviceStatusRepo = true;
            this.serviceStatusValidate = true;
            this.DelstatusInfo = 'Wrapping things up';
            this.statusprogress = 100;
            this.service.status = 'deletion completed';
            localStorage.removeItem(
              'request_id' + '_' + this.service.name + '_' + this.service.domain
            );
            setTimeout(() => {
              this.service_error = false;
              this.router.navigateByUrl('services');
            }, 5000);
            this.intervalSubscription.unsubscribe();
          } else if (respStatus.status.toLowerCase() === 'failed') {
            this.statusCompleted = false;
            this.statusFailed = true;
            this.serviceStatusStarted = false;
            this.serviceStatusStartedD = true;
            this.serviceStatusCompletedD = true;
            this.serviceStatusPermissionD = true;
            this.serviceStatusRepoD = true;
            this.serviceStatusValidateD = true;
            this.DelstatusInfo = 'Deletion failed';
            this.service.status = 'deletion failed';
            setTimeout(() => {
              this.service_error = false;
            }, 5000);
            // this.intervalSubscription.unsubscribe();
          } else {
            this.statusCompleted = false;
            respStatus.events.forEach(element => {
              if (
                element.name === 'DELETE_PROJECT' &&
                element.status === 'COMPLETED'
              ) {
                this.serviceStatusPermission = true;
                this.DelstatusInfo = 'Wrapping things up';
                this.statusprogress = 100;
                localStorage.removeItem(
                  'request_id' + this.service.name + this.service.domain
                );
              } else if (
                element.name === 'BACKUP_PROJECT' &&
                element.status === 'COMPLETED'
              ) {
                this.serviceStatusRepo = true;
                this.DelstatusInfo = 'Finishing up';
                8;
                this.statusprogress = 81;
              } else if (
                element.name === 'UNDEPLOY_WEBSITE' &&
                element.status === 'COMPLETED' &&
                this.service.serviceType == 'website'
              ) {
                this.serviceStatusValidate = true;
                this.DelstatusInfo = 'Backing up code';
                this.statusprogress = 48;
              } else if (
                element.name === 'DELETE_API_DOC' &&
                element.status === 'COMPLETED' &&
                this.service.serviceType == 'api'
              ) {
                this.serviceStatusValidate = true;
                this.DelstatusInfo = 'Backing up code';
                this.statusprogress = 48;
              } else if (
                element.name === 'UNDEPLOY_LAMBDA' &&
                element.status === 'COMPLETED' &&
                this.service.serviceType == 'function'
              ) {
                this.serviceStatusValidate = true;
                this.DelstatusInfo = 'Backing up code';
                this.statusprogress = 48;
              } else if (
                element.name === 'CALL_DELETE_WORKFLOW' &&
                element.status === 'COMPLETED'
              ) {
                this.serviceStatusStarted = true;
                this.DelstatusInfo = 'Deleting assets';
                this.statusprogress = 20;
              }
            });
          }
          document
            .getElementById('current-status-val')
            .setAttribute('style', 'width:' + this.statusprogress + '%');
        },
        error => {
          if (error.status == '404') {
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
      );
  }

  public goToAbout(hash) {
    this.router.navigateByUrl('landing');
    this.cache.set('scroll_flag', true);
    this.cache.set('scroll_id', hash);
  }

  focusindex: number;
  showRegionList: boolean;
  showAccountList: boolean;
  selectedAccount = [];
  selectedRegion = [];
  scrollList: any;

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

  selRegion: any;
  selApprover: any;
  selectAccount(account) {
    this.selApprover = account;
    let thisclass: any = this;
    this.showAccountList = false;
    thisclass.AccountInput = '';
    this.selectedAccount.push(account);
    this.update_payload.accounts = this.selectedAccount;
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
  selectRegion(region) {
    this.selApprover = region;
    let thisclass: any = this;
    this.showRegionList = false;
    thisclass.regionInput = '';
    this.selectedRegion.push(region);
    this.update_payload.regions = this.selectedRegion;
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
  keypressAccount(hash) {
    if (hash.key == 'ArrowDown') {
      this.focusindex++;
      if (this.focusindex > 0) {
        var pinkElements = document.getElementsByClassName('pinkfocus')[0];
        if (pinkElements == undefined) {
          this.focusindex = 0;
        }
        // var id=pinkElements.children[0].innerHTML;
      }
      if (this.focusindex > 2) {
        this.scrollList = {
          position: 'relative',
          top: '-' + (this.focusindex - 2) * 2.9 + 'rem',
        };
      }
    } else if (hash.key == 'ArrowUp') {
      if (this.focusindex > -1) {
        this.focusindex--;

        if (this.focusindex > 1) {
          this.scrollList = {
            position: 'relative',
            top: '-' + (this.focusindex - 2) * 2.9 + 'rem',
          };
        }
      }
      if (this.focusindex == -1) {
        this.focusindex = -1;
      }
    } else if (hash.key == 'Enter' && this.focusindex > -1) {
      event.preventDefault();
      var pinkElement = document.getElementsByClassName('pinkfocus')[0]
        .children;

      var approverObj = pinkElement[0].attributes[2].value;

      this.selectAccount(approverObj);
      this.approversPlaceHolder = 'Start typing (min 3 chars)...';

      this.focusindex = -1;
    } else {
      this.focusindex = -1;
    }
  }

  keypressRegion(hash) {
    if (hash.key == 'ArrowDown') {
      this.focusindex++;
      if (this.focusindex > 0) {
        var pinkElements = document.getElementsByClassName('pinkfocus2')[0];
        if (pinkElements == undefined) {
          this.focusindex = 0;
        }
        // var id=pinkElements.children[0].innerHTML;
      }
      if (this.focusindex > 2) {
        this.scrollList = {
          position: 'relative',
          top: '-' + (this.focusindex - 2) * 2.9 + 'rem',
        };
      }
    } else if (hash.key == 'ArrowUp') {
      if (this.focusindex > -1) {
        this.focusindex--;

        if (this.focusindex > 1) {
          this.scrollList = {
            position: 'relative',
            top: '-' + (this.focusindex - 2) * 2.9 + 'rem',
          };
        }
      }
      if (this.focusindex == -1) {
        this.focusindex = -1;
      }
    } else if (hash.key == 'Enter' && this.focusindex > -1) {
      event.preventDefault();
      var pinkElement = document.getElementsByClassName('pinkfocus2')[0]
        .children;
      this.approversPlaceHolder = 'Start typing (min 3 chars)...';
      var approverObj = pinkElement[0].attributes[2].value;

      this.selectRegion(approverObj);

      this.focusindex = -1;
    } else {
      this.focusindex = -1;
    }
  }
}
