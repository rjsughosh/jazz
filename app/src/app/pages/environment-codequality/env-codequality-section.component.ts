import {Component, OnInit, ElementRef, Inject, Input} from '@angular/core';
import {DayData, WeekData, MonthData, Month6Data, YearData} from './../service-metrics/data';
import {AfterViewInit, ViewChild} from '@angular/core';
import {ToasterService} from 'angular2-toaster';
import {RequestService, MessageService} from '../../core/services/index';
import {DataCacheService, AuthenticationService} from '../../core/services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {IonRangeSliderModule} from 'ng2-ion-range-slider';
import {setTimeout} from 'timers';
import {DataService} from '../data-service/data.service';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';


// import { Filter } from '../../secondary-components/jazz-table/jazz-filter';


@Component({
  selector: 'env-codequality-section',
  templateUrl: './env-codequality-section.component.html',
  styleUrls: ['./env-codequality-section.component.scss'],
  providers: [RequestService, MessageService, DataService],
})
export class EnvCodequalitySectionComponent implements OnInit {
  @Input() service: any = {};
  message: string;
  edit: boolean = true;
  save: boolean = false;
  minCards: boolean = false;
  maxCards: boolean = false;
  filteron: boolean = false;
  filterdone: boolean = true;
  errorTime: any;
  errorURL: any;
  errorAPI: any;
  errorRequest: any = {};
  errorResponse: any = {};
  errorUser: any;
  env: any;
  cqList: any = [];
  xAxis: '';
  yAxis: '';
  cardIndex: any;
  filtertext: any = 'past 6 months';
  cardindex: number = 0;
  link: any = [];
  sonar: any;
  selectedTimeRange: string = 'Month';
  payload: any = {};
  // selectedTimeRange:string="";
  graphArray: any = [];
  // name:any=[];
  value: any = [];
  date: any = [];
  data: any = [];
  x: any;
  noData: boolean = false;
  notemptydata: boolean = true;
  emptydata: boolean = false;
  yesdata: boolean = false;
  isError: boolean = false;
  graphDataAvailable: boolean = false;
  isGraphLoading: boolean = true;
  safeTransformX = 0;
  graphname: any;
  sonarlink: any;
  startDate = '';
  endDate = (new Date()).toISOString();
  public graphInput;
  name: any = [];
  // name = ['Unrsolved Issues','Major Issues','Fixed Issues','Bugs','Vulnarebilities','Code smells'];
  selected = ['MONTHLY'];
  errBody: any;
  parsedErrBody: any;
  errMessage: any;
  errorChecked: boolean = true;
  errorInclude: any = '';
  json: any = {};
  feedbackRes: boolean = false;
  openModal: boolean = false;
  feedbackMsg: string = '';
  feedbackResSuccess: boolean = false;
  feedbackResErr: boolean = false;
  isFeedback: boolean = false;
  toast: any;
  model: any = {
    userFeedback: ''
  };
  buttonText: string = 'SUBMIT';
  isLoading: boolean = false;
  sjson: any = {};
  djson: any = {};
  public lineChartData: Array<any> = [
    {data: [0, 0, 0, 20, 0], label: 'Major', lineTension: 0},
    {data: [0, 10, 10, 10, 0], label: 'Unresolved', lineTension: 0},
    {data: [20, 20, 10, 20, 20], label: 'Fixed', lineTension: 0}

  ];
  public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  public lineChartOptions: any = {
    legend: {position: 'bottom'},
    scales: {
      yAxes: [{
        ticks: {
          // steps : 2,
          // stepValue : 10,
          // max : 20,
          // min : 0
        }
      }]
    },
    responsive: false
  };
  public lineChartColors: Array<any> = [
    { //pink
      backgroundColor: 'rgba(237,0,140,0)',
      borderColor: 'rgba(237,0,140,1)',
      pointBorderColor: 'transparent',
    },
    { //blue
      backgroundColor: 'rgba(31,166,206,0)',
      borderColor: 'rgba(31,166,206,1)',
      pointBorderColor: 'transparent',
    },
    { //green
      backgroundColor: 'rgba(92,174,1,0)',
      borderColor: 'rgba(92,174,1,1)',
      pointBorderColor: 'transparent',
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  public filters:any = ['DAILY', 'WEEKLY', 'MONTHLY'];
  public filterSelected = [this.filters[0]];
  private toastmessage: any;
  public sectionStatus;
  public graph;
  public metrics;
  public selectedMetric;
  public filterData;
  public metricsIndex = 0;

  constructor(
    private toasterService: ToasterService,
    private messageservice: MessageService,
    private route: ActivatedRoute,
    private http: RequestService,
    private cache: DataCacheService,
    private router: Router,
    private authenticationservice: AuthenticationService,
    private dataS: DataService,
  ) {
  }

  refresh() {
    this.queryGraphData(this.filterData, this.metricsIndex);
  }

  onFilterSelected(event) {
    this.filterData = this.selectFilter(event[0]);
    this.queryGraphData(this.filterData, this.metricsIndex);
  }

  selectFilter(filterInput) {
    let filterData;
    this.filterSelected = [filterInput];
    switch (filterInput) {
      case 'DAILY':
        filterData = {
          fromDateISO: moment().subtract(7, 'day').toISOString(),
          headerMessage: '( past 7 days )',
          xAxisFormat: 'dd',
          stepSize: 86400000
        };
        break;
      case 'WEEKLY':
        filterData = {
          fromDateISO: moment().subtract(4, 'week').toISOString(),
          headerMessage: '( past 4 weeks)',
          xAxisFormat: 'MMM DD',
          stepSize: 604800000
        };
        break;
      case 'MONTHLY':
        filterData = {
          fromDateISO: moment().subtract(3, 'month').toISOString(),
          headerMessage: '( past 4 months )',
          xAxisFormat: 'MMM',
          stepSize: 2592000000
        };
        break;
    }
    filterData.toDateISO = moment().toISOString();
    filterData.toDateValue = moment(filterData.toDateISO).valueOf();
    filterData.fromDateValue = moment(filterData.fromDateISO).valueOf();
    return filterData;
  }

  selectMetric(index) {
    this.metricsIndex = index;
    this.selectedMetric = this.metrics[index];
    this.graph = this.formatGraphData(this.selectedMetric, this.filterData);
  }

  queryGraphData(filterData, metricIndex) {
    this.sectionStatus = 'loading';
    this.http.get('/jazz/codeq', {
      domain: this.service.domain,
      service: this.service.name,
      environment: this.route.snapshot.params['env'],
      to: filterData.toDateISO,
      from: filterData.fromDateISO
    })
      .subscribe((response) => {
        this.sectionStatus = 'resolved';
        this.metrics = response.data.metrics;
        this.selectedMetric = this.metrics[metricIndex];
        this.graph = this.formatGraphData(this.selectedMetric, filterData);
      }, (error) => {
        this.sectionStatus = 'error';
      });

  }

  formatGraphData(metricData, filterData) {
    let to = moment(filterData.toDateISO), from = moment(filterData.fromDateISO);
    let data = metricData.values
      .filter((dataPoint) => {
        let pointDate = moment(dataPoint.ts);
        let x = pointDate.diff(from);
        let y = pointDate.diff(to);
        return x > 0 && y < 0;
      })
      .map((dataPoint) => {
        return {
          x: moment(dataPoint.ts).valueOf(),
          y: parseInt(dataPoint.value)
        }
      });
    return {
      datasets: [data],
      options: filterData
    }
  }

  displayGraph() {
    this.http.get('/jazz/codeq?domain=' + this.service.domain + '&service=' + this.service.name + '&environment=' + this.env + '&from=' + this.startDate + '&to=' + this.endDate + '&').subscribe(response => {
        this.sectionStatus = 'resovled';
        if (!response.data) {
          this.emptydata = true;
          this.notemptydata = false;
          this.isGraphLoading = false;
          this.graphDataAvailable = false;
        } else {
          this.cqList = response.data.metrics;
          for (var i = 0; i < this.cqList.length; i++) {

            this.graphInput = this.cqList[this.cardindex];
            this.graphname = this.name[this.cardindex];

            this.cqList[i].xAxis = {
              'label': 'TIME',
              'range': 'day'
            };
            this.cqList[i].yAxis = {
              'label': 'ISSUES',
              'range': 'day'
            };
            this.cqList[i].data = this.cqList[i].values;
            this.graphArray[i] = this.cqList[i].data;
            if (this.graphArray[i].length != 0) {
              this.value[i] = this.graphArray[i][Math.floor((this.graphArray[i].length) - 1)].value;
              if (this.value[i] >= 1000) {
                this.value[i] = (this.value[i] / 1000).toFixed(1) + 'K';
              }
              if (this.value[i] >= 1000000) {
                this.value[i] = (this.value[i] / 1000000).toFixed(1) + 'M';
              }
              if (this.value[i] >= 1000000000) {
                this.value[i] = (this.value[i] / 1000000000).toFixed(1) + 'B';
              }
              this.date[i] = this.graphArray[i][Math.floor((this.graphArray[i].length) - 1)].ts.slice(0, -14).split('-').reverse().join('-');
            } else {
              this.value[i] = '';
              this.date[i] = 'OOPS! doesn\'t look like there is any data available here.';
              this.graphInput = this.cqList[this.cardindex];
              this.graphname = this.name[this.cardindex];
            }
            this.name[i] = this.cqList[i].name.replace('-', ' ').replace('-', ' ');
            this.link[i] = this.cqList[i].link;
            this.sonar = this.link[0];
            for (var j = 0; j < this.graphArray[i].length; j++) {
              // this.graphArray[i][j].date = this.graphArray[i][j].ts;
              this.graphArray[i][j].date = new Date(this.graphArray[i][j].ts);
            }
          }

          if (this.cqList.length != 0) {
            this.isGraphLoading = false;
            this.graphDataAvailable = true;
            this.yesdata = true;
            this.noData = false;
          } else {
            this.graphDataAvailable = true;
            this.noData = true;
            this.isGraphLoading = false;
            this.yesdata = false;
          }


        }
        this.filteron = false;
        this.filterdone = true;
        if (this.graphInput.values.length != 0) {
          this.graphDataAvailable = true;
          this.noData = false;
          this.yesdata = true;
        } else {
          this.graphDataAvailable = true;
          this.noData = true;
          this.yesdata = false;
        }
        setTimeout(() => {
          this.checkcarausal();
        }, 1000)

      },
      error => {
        this.graphDataAvailable = false;
        this.isGraphLoading = false;
        this.isError = true;
        this.payload = {
          'domain': this.service.domain,
          'service': this.service.name,
          'environment': this.env,
          'from': this.startDate,
          'to': this.endDate
        }
        this.getTime();
        this.errorURL = window.location.href;
        this.errorAPI = 'https://cloud-api.corporate.t-mobile.com/api/jazz/codeq';
        this.errorRequest = this.payload;
        this.errorUser = this.authenticationservice.getUserId();
        this.errorResponse = JSON.parse(error._body);

        // let errorMessage=this.toastmessage.errorMessage(err,"serviceCost");
        // this.popToast('error', 'Oops!', errorMessage);
      })
  };

  getTime() {
    var now = new Date();
    this.errorTime = ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + ' ' + now.getHours() + ':'
      + ((now.getMinutes() < 10) ? ('0' + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ('0' + now.getSeconds()) : (now.getSeconds())));
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

  errorIncluded() {
  }

  submitFeedback(action) {

    this.errorChecked = (<HTMLInputElement>document.getElementById('checkbox-slack')).checked;
    if (this.errorChecked == true) {
      this.json = {
        'user_reported_issue': this.model.userFeedback,
        'API': this.errorAPI,
        'REQUEST': this.errorRequest,
        'RESPONSE': this.errorResponse,
        'URL': this.errorURL,
        'TIME OF ERROR': this.errorTime,
        'LOGGED IN USER': this.errorUser
      }
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
      'title': 'Jazz: Issue reported by ' + this.authenticationservice.getUserId(),
      'project_id': 'CAPI',
      'priority': 'P4',
      'description': this.json,
      'created_by': this.authenticationservice.getUserId(),
      'issue_type': 'bug'
    }
    this.http.post('/platform/jira-issues', payload).subscribe(
      response => {
        this.buttonText = 'DONE';
        this.isLoading = false;
        this.model.userFeedback = '';
        var respData = response.data;
        this.feedbackRes = true;
        this.feedbackResSuccess = true;
        if (respData != undefined && respData != null && respData != '') {
          this.feedbackMsg = 'Thanks for reporting the issue. We’ll use your input to improve Jazz experience for everyone!';
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

  selectedMetrics(index, gname, link) {
    this.cardindex = index;
    this.graphname = gname;
    this.sonar = link;
    var ele = document.getElementsByClassName('metrics-card');
    for (var i = 0; i < ele.length; i++) {
      ele[i].classList.remove('arrow_box');
      ele[i].classList.remove('active');
    }
    ele[this.cardindex].className += ' arrow_box';
    ele[this.cardindex].className += ' active';
    this.graphInput = this.cqList[this.cardindex];
    if (this.graphInput.values.length != 0) {
      this.graphDataAvailable = true;
      this.noData = false;
      this.yesdata = true;
    } else {
      this.graphDataAvailable = true;
      this.noData = true;
      this.yesdata = false;
    }
    this.onFilterSelected(event);
  }

  sonarProjectLink(url) {
    window.open(url, '_blank');
  }

  onResize(event) {
    this.checkcarausal();
  }


  ngOnInit() {

    this.filterData = this.selectFilter(this.filterSelected[0]);
    this.sectionStatus = 'error';
    //this.queryGraphData(this.filterData, this.metricsIndex);
    // this.isGraphLoading = true;
    // this.cache.set('codequality', true);
    // this.route.params.subscribe(
    //   params => {
    //     this.env = params.env;
    //   });
    // if (this.env == 'prd') {
    //   this.env = 'prod';
    // }
    //
    // var date = new Date();
    // date.setDate(date.getDate() - 180);
    // var dateString = date.toISOString();
    // this.startDate = dateString;
    //
    // this.displayGraph();
    // // this.selectedMetrics(1,"gname","link")
    // this.dataS.currentMessage.subscribe(message => this.message = message)
    // this.newMessage();
  }

  newMessage() {
    this.dataS.changeMessage('fo')

  }

  public goToAbout(hash) {

    this.router.navigateByUrl('landing');
    this.cache.set('scroll_flag', true);
    this.cache.set('scroll_id', hash);
  }

  refreshCostData(event?) {
    this.isGraphLoading = true;
    this.displayGraph();
  }

  checkcarausal() {

    var mainEle = document.getElementsByClassName('scroll-cards-wrap')[0].clientWidth;

    var limit = document.getElementsByClassName('metrics-cards-wrap')[0].clientWidth;

    if (mainEle > limit) {
      this.maxCards = true;
    } else {
      this.maxCards = false;
      this.minCards = false;
    }
  }

  leftArrowClick() {
    var mainEle = document.getElementsByClassName('scroll-cards-wrap');
    var innerWidth = (mainEle[0].clientWidth + 12) / this.cqList.length;
    this.maxCards = true;
    if (this.safeTransformX < 0) {
      this.minCards = true;
      this.safeTransformX = this.safeTransformX + innerWidth;
      if (this.safeTransformX >= 0) {
        this.minCards = false;
      }
    }
  }

  rightArrowClick() {
    var mainEle = document.getElementsByClassName('scroll-cards-wrap');
    var limit = document.getElementsByClassName('metrics-cards-wrap')[0].clientWidth;
    var innerWidth = (mainEle[0].clientWidth) / this.cqList.length;
    this.minCards = true;
    if (this.safeTransformX > (-mainEle[0].clientWidth + limit)) {
      this.maxCards = true;
      this.safeTransformX = this.safeTransformX - innerWidth;
      if (this.safeTransformX <= (-mainEle[0].clientWidth + limit)) {
        this.maxCards = false;
      }
    }
  }
}
