import { Component, OnInit ,Input,Output,EventEmitter, ViewChild} from '@angular/core';
import { RequestService ,MessageService} from "../../core/services";
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import * as _ from "lodash";
import * as moment from 'moment';
import { environment } from './../../../environments/environment';
import { DataService } from '../data-service/data.service';
import { ToasterService } from 'angular2-toaster';
import { EvaluateSwaggerSidebarComponent } from './../../secondary-components/evaluate-swagger-sidebar/evaluate-swagger-sidebar.component';

@Component({
  selector: 'clear-water',
  templateUrl: './clear-water.component.html',
  styleUrls: ['./clear-water.component.scss']
})
export class ClearWaterComponent implements OnInit {

  @Output() open_sidebar: EventEmitter<any> = new EventEmitter<any>();
  @Input() service: any = {};
  @ViewChild('EvaluateSidebar') EvaluateSidebar : EvaluateSwaggerSidebarComponent;

  env: string;
  swagger_json;
  error: boolean = true;
  cw_score: any = {};
  cw_message: any = '';
  cw_keysList;
  cw_results;
  oneObject: any;
  isloaded: boolean = false;
  expandText: string = 'Expand all';
  tableHeader = [];
  errMessage;
  search_text: string;
  loadingState: string = 'default';
  paginationSelected: Boolean = false;
  warningSelected: boolean;
  search_bar: string;
  reqJson:any;
  searchDetail_bar: string;
  detailView: boolean = true;
  slideSidebar: boolean = false;
  cw_obj: any = {};
  private subscription: any;
  private http: any;
  obj: any = {};
  congratulations: boolean = false;
  close: boolean = false;
  closed: boolean = false;
  hidden:boolean = true;
  public graphData;
  historicalChangeTrendURI: string;
  isSlidebarLoading:boolean = false;
  isGraphloaded:boolean = false;
  graphError:boolean = false;
  datasets;
  private toastmessage:any = '';
  showAddService: boolean = false;
  requestStatusErrorCount=0;
  requestStatusErrorLimit=3;
  headerObj = {
    'accept': 'application/json'
  };
  clearwater_ntid:string = environment.clearwater.ntid;


  constructor(
    private request: RequestService,
    private route: ActivatedRoute,
    private router: Router,
    private data : DataService,
    private toasterService: ToasterService,
    private messageservice: MessageService,
  )
  {
    this.http = request;
    this.toastmessage = messageservice;
  }



  viewDetails(obj) {
    this.search_bar = '';
    this.searchDetail_bar = '';
    let index = this.cw_results.indexOf(obj);
    this.oneObject = this.cw_results[index];
    this.oneObject['heading'] = this.cw_keysList[index];
  }

  expandall() {
    for (let i = 0; i < this.cw_results.length; i++) {
      let rowData = this.cw_results[i];
      rowData['expanded'] = true;
    }
    this.expandText = 'Collapse all';

  }

  collapseall() {
    for (let i = 0; i < this.cw_results.length; i++) {
      let rowData = this.cw_results[i];
      rowData['expanded'] = false;
    }
    this.expandText = 'Expand all';
  }

  onRowClicked(row, index) {
    index = this.cw_results.indexOf(row)
    for (let i = 0; i < this.cw_results.length; i++) {
      let rowData = this.cw_results[i];
      if (i === index) {
        rowData['expanded'] = !rowData['expanded'];
      }
    }
  }

  showService(isShow,type){
    this.showAddService = isShow;
    this.EvaluateSidebar.SetType(type)

  }

  formatGraphData(metricData) {
    let valueProperty = "score";

    let values = metricData.slice(-5) //take last 25 points only.
      .sort((pointA, pointB) => {
        return moment(pointA.dateTimeGMT).diff(moment(pointB.dateTimeGMT));
      })
      .map((dataPoint) => {
        return {
          x: moment(dataPoint.dateTimeGMT).valueOf(),
          y: parseInt(dataPoint[valueProperty])
        };
      });

    let timeRange = {
      format: 'MM-DD-YYYY h:mm A',
      range: moment(values[0].x).toISOString() //selecting the first date value
    };

    let options = {
      tooltipXFormat: 'MM-DD-YYYY h:mm A',
      fromDateISO: timeRange.range,
      fromDateValue: moment(timeRange.range).valueOf(),
      toDateISO: moment().toISOString(),
      s: moment().valueOf(),
      xAxisFormat: timeRange.format,
      stepSize: 3600000,
      yMin: values.length ?
        .9 * (values.map((point) => {
          return point.y;
        })
          .reduce((a, b) => {
            return Math.min(a, b);
          })) : 0,
      yMax: 100
    };

    return {
      datasets: [values],
      options: options
    };
  }

  openSidebar() {
    this.slideSidebar = true;
    this.isGraphloaded = false;
    setTimeout(() => {
      this.isGraphloaded = true;
    },600)
    document.getElementsByClassName('view-container')[0].classList.add('set-width');

  }
  closeSidebar() {
    this.slideSidebar = false;
    this.isGraphloaded = false;
    setTimeout(() => {
      this.isGraphloaded = true;
    },600)
    let item = document.getElementsByClassName('view-container')[0];
    if (item) {
      item.classList.remove('set-width');
    }

  }
  callapi(event) {
    this.isloaded = false;
    // this.getData(event);
    this.getGraphData(event, 'sidebar');
  }
  onCWDetailsearch(data) {
    this.searchDetail_bar = data.searchString;
  }

  onCWsearch(data) {
    this.search_bar = data.searchString;
  }

  onRequestId(requestID){
    this.servicePublishStatus(requestID);
    this.requestStatusErrorCount=0;
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

  getSwaggerUrl(serviceAssets) {
    const swaggerAsset = serviceAssets.find((asset) => {
      return asset.type === 'swagger_url';
    });
    if(!swaggerAsset){
      this.isloaded = true;
      this.error = true;
    }

    if (swaggerAsset) {
      this.http.get(swaggerAsset.provider_id, null, this.headerObj).subscribe(
        (response) => {
          this.swagger_json = response;
          this.getGraphData(this.swagger_json);
        },
        (error) => {
          console.log('error', error);
          this.isloaded = true;
          this.error = true;

        }
      );
    }
  }

  getGraphData(swagger_json , sidebar?) {
    let swaggerLintPayload;
    if(sidebar === "sidebar"){
      swaggerLintPayload = {
        'swaggerDoc': swagger_json,
      };
    }
    else{
      swaggerLintPayload ={
        'swaggerDoc': swagger_json,
        'ntid': this.clearwater_ntid,
        'swaggerId': `${this.service.domain}_${this.service.name}_${this.env}`
      };
    }

    this.subscription = this.http.post(environment.urls.swaggerApiUrl, swaggerLintPayload, this.headerObj)
      .subscribe(
        (response) => {
          this.obj = response;
          if (this.obj.results.errors == 0 && this.obj.results.warnings == 0) {
            this.congratulations = true;
          }

          this.cw_obj = response.results;
          this.cw_score = response.results.score;
          this.cw_message = response.results.message;
          var arr = response.results.details;
          this.isloaded = true;
          this.error = false;
          this.cw_keysList = Object.keys(arr).map(key => {
            return key;
          });
          this.cw_results = Object.keys(arr).map(key => {
            return arr[key];
          });
          for (var i = 0; i < this.cw_results.length; i++) {
            this.cw_results[i]["heading"] = this.cw_keysList[i];
            this.cw_results[i].score = Math.abs(this.cw_results[i].score);
          }
          this.historicalChangeTrendURI = response.links.historicalChangeTrendURI;
          if(!sidebar){
            this.http.get(this.historicalChangeTrendURI, null, this.headerObj).subscribe((response) => {
              this.graphData = this.formatGraphData(response.changeHistory);
              console.log("cw-data", JSON.stringify(this.graphData));
              setTimeout(() => {
                this.isGraphloaded = true;
              },1000)

            },
            (error) => {
              console.log('error', error)
              this.graphError = true;
            });
          }
          else{
            this.EvaluateSidebar.enableButton(true);
          }

        },
        (error) => {
          this.isloaded = true;
          this.error = true;
        }
      );
  }

  refresh() {
    this.isloaded = false;
    this.getSwaggerUrl(this.service.assets);
  }

  refreshGraph(){
    this.isGraphloaded = false;
    this.http.get(this.historicalChangeTrendURI,null, this.headerObj).subscribe((response) => {
      this.graphData = this.formatGraphData(response.changeHistory);
      setTimeout(() => {
        this.isGraphloaded = true;
      },1000)
    },
    (error) => {
      console.log('error', error)
      this.graphError = true;
    });
  }
  ngOnInit() {

    this.env = this.route.snapshot.params['env'];
    this.getSwaggerUrl(this.service.assets);
    if(this.env == 'prod'){
      try{
        this.reqJson = JSON.parse(localStorage.getItem('cw_request_id'+"_"+this.service.name+"_"+this.service.domain));
        if(this.reqJson){
          this.servicePublishStatus(this.reqJson.request_id);
        }
      }
      catch(e){
        console.log(e)
      }
    }
  }


  ngOnDestroy() {
    this.closeSidebar();
    this.hidden=true;
    this.env=this.route.snapshot.params['env'];
  }



  progressCompleted: boolean = true;
  creating: boolean = true;
  statusprogress: number = 5;
  animatingDots: any;
  deleting: boolean = false;
  private intervalSubscription: Subscription;
  service_request_id: any;
  statusCompleted: boolean = true;
  serviceStatusCompleted: boolean = false;
  serviceStatusCompletedD: boolean = false;
  serviceStatusPermissionD: boolean = false;
  serviceStatusRepoD: boolean = false;
  serviceStatusValidateD: boolean = false;
  serviceStatusStarted: boolean = true;
  serviceStatusStartedD: boolean = false;
  statusFailed: boolean = false;
  statusInfo: string = 'Starting';
  service_error: boolean = true;

  servicePublishStatus(message) {
    this.statusCompleted = false;
    this.statusInfo = "Starting";
    this.serviceStatusCompleted = false;
    this.statusCompleted = false;
    this.progressCompleted = false;
    this.service_error = true;
    this.statusFailed = false;
    if(message || message===null){
    this.statusprogress = 5;
    this.hidden = false;
    this.intervalSubscription = Observable.interval(3000)
      .switchMap((response,error) => this.http.get('/jazz/request-status?id='+message))
      .subscribe(
          response => {
            let dataResponse = <any>{};
            dataResponse.list = response;
            var respStatus = dataResponse.list.data;
            let currentStatus = respStatus.events[respStatus.events.length - 1].name;
            this.requestStatusErrorCount = 0;
            if (respStatus.status.toLowerCase() === 'completed' && currentStatus === 'CLEARWATER_SEND_NOTIFICATION') {
                this.serviceStatusCompleted = true;
                this.serviceStatusPermissionD = true;
                this.serviceStatusRepoD = true;
                this.serviceStatusValidateD = true;
                this.statusInfo = 'Wrapping things up';
                this.statusprogress = 100;
                this.hidden = true;
                this.intervalSubscription.unsubscribe();
                this.statusInfo = "Completed";
                localStorage.removeItem('cw_request_id_' + this.service.name + '_' + this.service.domain);
                setTimeout(() => {
                    this.service_error = false;
                    this.statusCompleted = true;
                    this.EvaluateSidebar.enableButton(true);
                }, 5000);
            } else if (respStatus.status.toLowerCase() === 'failed') {
                this.statusFailed = true;
                this.service_error = true;
                this.serviceStatusStarted = false;
                this.serviceStatusStartedD = true;
                this.serviceStatusCompletedD = true;
                this.serviceStatusPermissionD = true;
                this.serviceStatusRepoD = true;
                this.serviceStatusValidateD = true;
                this.statusInfo = 'Creation failed';
                localStorage.removeItem('cw_request_id_' + this.service.name + '_' + this.service.domain);
                setTimeout(() => {
                    this.statusCompleted = true;
                }, 5000);

            } else {
                this.statusCompleted = false;

                if (currentStatus === 'CLEARWATER_SEND_NOTIFICATION') {
                    // this.serviceStatusCompleted = true;
                    this.statusInfo = 'Sending Notification';
                    this.statusprogress = 93;
                    localStorage.removeItem('cw_request_id_' + this.service.name + '_' + this.service.domain);
                } else if (currentStatus === 'CLEARWATER_RAISE_PR') {
                    this.serviceStatusPermissionD = true;
                    this.statusInfo = 'Raising PR';
                    this.statusprogress = 85;
                } else if (currentStatus === 'CLEARWATER_FORK_REPO') {
                    this.serviceStatusRepoD = true;
                    this.statusInfo = 'Forking Repository';
                    this.statusprogress = 60;
                } else if (currentStatus === 'CLEARWATER_GET_ARTIFACTS') {
                    this.serviceStatusValidateD = true;
                    this.statusInfo = 'Getting Artifacts';
                    this.statusprogress = 35;
                } else if (currentStatus === 'CLEARWATER_INITIALIZATION') {
                    this.serviceStatusStartedD = true;
                    this.statusInfo = 'Initializing Clear Water';
                    this.statusprogress = 20;
                }else if (currentStatus === 'CALL_CLEARWATER_PUBLISH_WORKFLOW') {
                  this.serviceStatusStartedD = true;
                  this.statusInfo = 'Publishing Service';
                  this.statusprogress = 10;
                }
            }
            document.getElementById('current-status-val').setAttribute("style", "width:" + this.statusprogress + '%');
          },
          error => {

              this.service_error = false;
              this.requestStatusErrorCount++;
              if(this.requestStatusErrorCount < this.requestStatusErrorLimit){
                this.servicePublishStatus(this.reqJson.request_id);
              }
              else{
                this.servicePublishStatus(undefined);
                localStorage.removeItem('cw_request_id_' + this.service.name + '_' + this.service.domain);
                this.toast_pop('error', 'Oops!', 'Failed to Publish Swagger');
                this.progressCompleted = true;
                this.EvaluateSidebar.enableButton(true);
              }
          }
      )
  }

}

}