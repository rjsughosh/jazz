import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { RequestService ,MessageService} from "../../core/services";
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'clear-water',
  templateUrl: './clear-water.component.html',
  styleUrls: ['./clear-water.component.scss']
})
export class ClearWaterComponent implements OnInit {

@Output() open_sidebar:EventEmitter<any> = new EventEmitter<any>();
@Input() service: any = {};
env:string;
swagger_json;
error:boolean=true;
cw_score:any = {};
cw_message:any = '';
cw_keysList;
cw_results;
oneObject:any;
isloaded:boolean = false;
expandText: string = 'Expand all';
tableHeader = [];
errMessage;
search_text:string;
loadingState:string='default';
paginationSelected: Boolean = false;
warningSelected:boolean;
search_bar:string;
searchDetail_bar:string;
detailView:boolean = true;
slideSidebar:boolean = false;
cw_obj:any={};
private subscription:any;
private http:any;
obj:any = {};
congratulations:boolean = false;
close: boolean = false;
closed: boolean = false;
options:any = {
  "fromDateISO": "2018-09-19T11:26:32.065Z",
  "fromDateValue": 1537356392065,
  "stepSize": 900000,
  "toDateISO": "2018-09-20T11:26:34.543Z",
  "toDateValue": 1537442794543,
  "tooltipXFormat": "MMM DD YYYY, h:mm a",
  "xAxisFormat": "h:mm a",
  "yMax": 100,
  "yMin": 0,
}
datasets:any = [];

  constructor(
    private request:RequestService,
    private route: ActivatedRoute,
    private router: Router,
  )
  {
    this.http = request;
  }



viewDetails(obj){
  this.search_bar='';
  this.searchDetail_bar="";
   var index=this.cw_results.indexOf(obj)
  this.oneObject = this.cw_results[index];
  this.oneObject['heading']=this.cw_keysList[index];
}

expandall(){
  for(var i=0;i<this.cw_results.length;i++){
    var rowData = this.cw_results[i];
    rowData['expanded'] = true;
  }
  this.expandText='Collapse all';

}

collapseall(){
  for(var i=0;i<this.cw_results.length;i++){
    var rowData = this.cw_results[i];
    rowData['expanded'] = false;
  }
  this.expandText='Expand all';
}

onRowClicked(row, index) {
  index=this.cw_results.indexOf(row)
  for (var i = 0; i < this.cw_results.length; i++) {
    var rowData = this.cw_results[i]
    if (i == index) {
      rowData['expanded'] = !rowData['expanded'];
    }
  }
}

openSidebar(){
this.slideSidebar = true;
document.getElementsByClassName('view-container')[0].classList.add('set-width');
  // this.open_sidebar.emit('swagger');

}
closeSidebar(){
  this.slideSidebar = false;
  let item = document.getElementsByClassName('view-container')[0];
  if(item){
      item.classList.remove('set-width');
  }

}
callapi(event){
  this.isloaded=false;
 this.getData(event);
}
onCWDetailsearch(data){
  this.searchDetail_bar = data.searchString;
}

onCWsearch(data){
  this.search_bar = data.searchString;
}

getData(payload?){
    var body;
    if(!payload){
      var swaggerAsset = this.service.assets.find((asset) => {
        return asset.type === 'swagger_url';
      });
      if(swaggerAsset){
        this.http.get(swaggerAsset.provider_id).subscribe(
          (response) => {
            this.swagger_json=response;
          },
          (error) =>{
            console.log('error',error)

          }
        );

        body = {
          "url": swaggerAsset && swaggerAsset.provider_id
        };
      }
    }
    else{
      body = payload;
    }
    this.subscription = this.http.post('/jazz/apilinter',body).subscribe(
    (response) => {
          this.obj=response;
          if(this.obj.results.errors == 0 && this.obj.results.warnings == 0){
            this.congratulations=true;
          }

          this.cw_obj = response.results;
          this.cw_score=response.results.score;
          this.cw_message=response.results.message;
          var arr = response.results.details;
          this.isloaded=true;
          this.error = false;
          this.cw_keysList = Object.keys(arr).map(key => {
            return key;
          });
          this.cw_results = Object.keys(arr).map(key => {
            return arr[key];
          });
          for(var i=0;i<this.cw_results.length;i++){
            this.cw_results[i]["heading"]=this.cw_keysList[i];
            this.cw_results[i].score = Math.abs(this.cw_results[i].score);
          }

        },
        (error) => {
          this.isloaded=true;
          this.error = true;
    });

  }


  refresh(){
    this.isloaded=false;
    this.getData();
  }
  ngOnInit() {
    this.env=this.route.snapshot.params['env'];
    this.getData();
  }

  ngOnDestroy(){
    this.closeSidebar();
  }

  progressCompleted:boolean = false;
  creating: boolean = true;
  statusprogress: number = 5;
  animatingDots: any;
  deleting: boolean = false;
  private intervalSubscription: Subscription;
  service_request_id: any;
  statusCompleted: boolean = false;
  serviceStatusCompleted: boolean = false;
  // serviceStatusPermission: boolean = false;
  // serviceStatusRepo: boolean = false;
  // serviceStatusValidate: boolean = false;
  serviceStatusCompletedD: boolean = false;
  serviceStatusPermissionD: boolean = false;
  serviceStatusRepoD: boolean = false;
  serviceStatusValidateD: boolean = false;
  serviceStatusStarted: boolean = true;
  serviceStatusStartedD: boolean = false;
  statusFailed: boolean = false;
  statusInfo: string = 'Service Creation started';
  service_error: boolean = true;


  serviceCreationStatus() {
    this.statusprogress = 5;
    this.creating = true;
    this.deleting = false;
    // this.intervalSubscription = Observable.interval(5000)
    //   .switchMap((response) => this.http.get('/jazz/request-status?id=' + this.service_request_id))
    //   .subscribe(
    //       response => {

    //           let dataResponse = <any>{};
    //           dataResponse.list = response;
    //           var respStatus = dataResponse.list.data;
    //           if (respStatus.status.toLowerCase() === 'completed') {
    //               this.statusCompleted = true;
    //               this.serviceStatusCompleted = true;
    //               // this.serviceStatusPermission = true;
    //               // this.serviceStatusRepo = true;
    //               // this.serviceStatusValidate = true;
    //               this.statusInfo = 'Wrapping things up';
    //               this.statusprogress = 100;
    //               localStorage.removeItem('request_id' + "_" + this.service.name + "_" + this.service.domain);
    //               // alert('last stage');
    //               this.http.get('/jazz/services/' + this.service.id).subscribe(
    //                   (response) => {
    //                       // this.serviceDetail.onDataFetched(response.data);
    //                   }
    //               )
    //               this.intervalSubscription.unsubscribe();
    //               setTimeout(() => {
    //                   this.service_error = false;
    //               }, 5000);
    //           } else if (respStatus.status.toLowerCase() === 'failed') {
    //               this.statusCompleted = false;
    //               this.statusFailed = true;
    //               this.serviceStatusStarted = false;
    //               this.serviceStatusStartedD = true;
    //               this.serviceStatusCompletedD = true;
    //               this.serviceStatusPermissionD = true;
    //               this.serviceStatusRepoD = true;
    //               this.serviceStatusValidateD = true;
    //               this.statusInfo = 'Creation failed';
    //               setTimeout(() => {
    //                   this.service_error = false;
    //               }, 5000);

    //           } else {
    //               this.statusCompleted = false;
    //               // respStatus.events.forEach(element => {
    //               //     if (element.name === 'TRIGGER_FOLDERINDEX' && element.status === 'COMPLETED') {
    //               //         this.serviceStatusCompleted = true;
    //               //         this.statusInfo = 'Wrapping things up';
    //               //         this.statusprogress = 100;
    //               //         localStorage.removeItem('request_id' + this.service.name + this.service.domain);
    //               //     } else if (element.name === 'ADD_WRITE_PERMISSIONS_TO_SERVICE_REPO' && element.status === 'COMPLETED') {
    //               //         // this.serviceStatusPermission = true;
    //               //         // this.statusInfo = 'Adding required permissions';
    //               //         this.statusprogress = 85;
    //               //     } else if (element.name === 'PUSH_TEMPLATE_TO_SERVICE_REPO' && element.status === 'COMPLETED') {
    //               //         this.serviceStatusRepo = true;
    //               //         this.statusInfo = 'Getting your code ready';
    //               //         this.statusprogress = 60;
    //               //     } else if (element.name === 'VALIDATE_INPUT' && element.status === 'COMPLETED') {
    //               //         this.serviceStatusValidate = true;
    //               //         this.statusInfo = 'Validating your request';
    //               //         this.statusprogress = 35;
    //               //     } else if (element.name === 'CALL_ONBOARDING_WORKFLOW' && element.status === 'COMPLETED') {
    //               //         this.serviceStatusStarted = true;
    //               //         this.statusInfo = 'Service Creation started';
    //               //         this.statusprogress = 20;
    //               //     }
    //               // });
    //           }
    //           document.getElementById('current-status-val').setAttribute("style", "width:" + this.statusprogress + '%');

    //       },
    //       error => {

    //           this.service_error = false;
    //           this.serviceCreationStatus();
    //       }
    //   )
  }

}
