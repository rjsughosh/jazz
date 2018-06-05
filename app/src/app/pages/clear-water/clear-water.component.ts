import { Component, OnInit ,Input} from '@angular/core';
import { RequestService ,MessageService} from "../../core/services";
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'clear-water',
  templateUrl: './clear-water.component.html',
  styleUrls: ['./clear-water.component.scss']
})
export class ClearWaterComponent implements OnInit {

  constructor(
    private request:RequestService,
    private route: ActivatedRoute,
    private router: Router,
  ) 
  {
    this.http = request;
  }

  private subscription:any;
  private http:any;
  obj:any = {
};
@Input() service: any = {};
env:string;
error:boolean=true;
cw_score:any = {};
cw_message:any = '';
cw_keysList;
cw_results;
oneObject:any;
isloaded:boolean = false;
expandText: string = 'Expand all';


tableHeader = [
  
]
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
    } else{
      rowData['expanded'] = false;
    }
  }
}
errMessage;
search_text:string;
loadingState:string='default';
paginationSelected: Boolean = false;
warningSelected:boolean;
search_bar:string;
searchDetail_bar:string;
detailView:boolean = true;
viewDetails(index){
  this.oneObject = this.cw_results[index];
  this.oneObject['heading']=this.cw_keysList[index];

}
hideWarning(){

}
onCWDetailsearch(data){

  this.searchDetail_bar = data.searchString;
}
onCWsearch(data){
  this.search_bar = data.searchString;
}
cw_obj:any={};
getData(){
    var body = {
      "url":"http://cloud-api-doc.corporate.t-mobile.com/"+this.service.domain+"_"+this.service.name+"/"+this.env+"/swagger.json"
    };
    this.subscription = this.http.post('/jazz/apilinter',body).subscribe(
    (response) => {
          this.obj=response;
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
          }
        },
        (error) => {     
          this.isloaded=true;  
          this.error = true;
        
    });
    
  }
  ngOnInit() {
    this.route.params.subscribe(
      params => {
      this.env = params.env;
    });
    this.getData();
  }
  ngOnChanges(){
    this.route.params.subscribe(
      params => {
      this.env = params.env;
    });
  }

}
