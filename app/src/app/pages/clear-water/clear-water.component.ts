import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { RequestService ,MessageService} from "../../core/services";
import { Router, ActivatedRoute } from '@angular/router';


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
      swaggerAsset.provider_id = swaggerAsset.provider_id.replace('http://', 'https://');
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
}
