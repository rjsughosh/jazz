/**
  * @type Component
  * @desc
  * @author sughosh
*/


import { Component, OnInit, EventEmitter,Input,Output,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService ,MessageService} from "../../core/services";
import {RelaxedJsonService} from "../../core/helpers/relaxed-json.service";
import {ToasterService} from 'angular2-toaster';
import { DataService } from '../../pages/data-service/data.service';
import { environment } from './../../../environments/environment';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'evaluate-swagger-sidebar',
  templateUrl: './evaluate-swagger-sidebar.component.html',
  styleUrls: ['./evaluate-swagger-sidebar.component.scss']
})
export class EvaluateSwaggerSidebarComponent implements OnInit {

  @Input() service: any = {};
  @Input() envSelected: any = {};
  @Input() ispublishing: boolean;
  @Input() assets: any = [];
  @Input() swagger_json: any;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() evaluate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRequestId: EventEmitter<any> = new EventEmitter<any>();

  private subscription: any;
  swaggerAsset:any;
  validityMessage:string;
  valid:boolean = true;
  isloaded:string = 'default';
  cw_score:any = {};
  cw_message:any = '';
  cw_keysList;
  cw_results;
  cw_obj:any={};
  obj:any = {};
  foundAsset;
  applicationInput:any = "";
  foobarInput:any = "";
  notesInput:any = "";
  evaluateBody:boolean = true;
  publishBody:boolean = false;
  public lineNumberCount: any = new Array(40).fill('');
  requestId:string;
  publishBtnText:string = "PUBLISH";
  error: boolean = true;
  environmentVars = environment.urls || {};
  tableHeader = [];
  evaluationComplete:boolean = false;
  loadingState: string = 'default';
  paginationSelected: Boolean = false;
  sidebarType:string;
  search_bar: string;
  reqJson:any;
  searchDetail_bar: string;
  detailView: boolean = true;
  oneObject: any;
  evaluateText:string = "EVALUATE";


  private http:any;
  constructor(
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
    private request:RequestService,
    private relaxedJson: RelaxedJsonService,
    private data : DataService,

  ) {
    this.http = request;

   }

  ngOnInit() {
  }
  formatSwagger(){
    if(this.swagger_json && typeof(this.swagger_json) !== 'string' ){
      this.swagger_json = JSON.stringify(this.swagger_json);
      this.swagger_json = this.stringToPrettyString(this.swagger_json);
    }
  }

  enableButton(event){
    this.ispublishing = false;
    this.publishBtnText = "PUBLISH";
  }

  SetType(type){
    this.sidebarType = type;
  }

  onCWDetailsearch(data) {
    this.searchDetail_bar = data.searchString;
  }

  onCWsearch(data) {
    this.search_bar = data.searchString;
  }

  closeBar(){
    this.onClose.emit();
  }
  stringToPrettyString(input) {
    let parser = this.relaxedJson.getParser();
    let objectValue = parser.stringToValue(input);
    let PrettyPrinter = this.relaxedJson.getPrinter();
    let opts = new PrettyPrinter.Options();
    opts.useQuotes = true;
    opts.useArrayCommas = true;
    opts.useObjectCommas = true;
    opts.objectItemNewline = true;
    opts.arrayItemNewline = true;
    let prettyPrinter = new PrettyPrinter(opts);
    let jsonString = prettyPrinter.valueToString(objectValue);
    return jsonString;
  }

  formatJSON(){
    this.isloaded='default';
    try{
      this.swagger_json = this.stringToPrettyString(this.swagger_json);
      let payload = JSON.parse(this.swagger_json);
      this.valid = true;
    }
    catch(e){
      this.validityMessage = 'Unable to parse JSON';
      this.valid = false;
    }
  }

  EvaluateJSON(){
    this.formatJSON();
    var payload = JSON.parse(this.swagger_json);
    this.ispublishing = true;
    this.evaluationComplete = false
    this.evaluateSwagger(payload);
    // this.evaluate.emit(payload);
  }

  evaluateSwagger(swagger_json){
    this.evaluateText = "EVALUATING"
    this.isloaded = 'loading';

    let swaggerLintPayload = {
      'swaggerDoc': swagger_json,
    };
    this.subscription = this.http.post(environment.urls.swaggerApiUrl, swaggerLintPayload)
    .subscribe(
      (response) => {
        this.obj = response;
        this.cw_obj = response.results;
        this.cw_score = response.results.score;
        this.cw_message = response.results.message;
        var arr = response.results.details;
        this.isloaded = 'default';
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
        this.enableButton(true);
        this.evaluationComplete = true;
        this.evaluateText = "EVALUATE";


      },
      (error) => {
        this.isloaded = 'loading';
        this.error = true;
        this.evaluationComplete = true;
        this.evaluateText = "EVALUATE";
      }
    );
  }
  getassets(){
    this.http.get('/jazz/assets', {
      service: this.service.service || this.service.name,
      domain: this.service.domain,
      environment: this.envSelected,
      limit: undefined
    }).subscribe((assetsResponse) => {
      this.assets = assetsResponse.data.assets;
      this.service.assets = this.assets;
      if(this.assets[0].hasOwnProperty('type')){
        this.foundAsset = this.assets.find((asset) => {
          return asset.type === 'swagger_url';
        });
        if(this.foundAsset){
          this.getdata();
        }

      }

    }, (err) => {
      this.toast_pop('error', 'Oops!', 'Swagger File Not Found.');
    });
  }

  toast_pop(error, oops, errorMessage) {
    var tst = document.getElementById('toast-container');
    tst.classList.add('toaster-anim');
    this.toasterService.pop(error, oops, errorMessage);
    setTimeout(() => {
      tst.classList.remove('toaster-anim');
    }, 3000);
  }

  lineNumbers() {
    let lines  = this.swagger_json.split(/\r*\n/);
    let line_numbers = lines.length;
    this.lineNumberCount = new Array(line_numbers).fill('');
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


  viewDetails(obj) {
    this.search_bar = '';
    this.searchDetail_bar = '';
    let index = this.cw_results.indexOf(obj);
    this.oneObject = this.cw_results[index];
    this.oneObject['heading'] = this.cw_keysList[index];
  }
  ontextareaScroll(){
    var target = $("#target");
    $("#source").scroll(function() {
      target.prop("scrollTop", this.scrollTop)
            .prop("scrollLeft", this.scrollLeft);
    });
    }

  getdata(){
    this.http.get(this.foundAsset.provider_id).subscribe(
      (response) => {
        this.swagger_json=JSON.stringify(response);
        this.swagger_json = this.stringToPrettyString(this.swagger_json);
        this.lineNumbers();
      },
      (error) =>{
        try{
          var err =JSON.parse(error)
          console.log('error',err)
        }
        catch(e){
          console.log(e)
        }

      }
    )


  }
  goback(){
    this.isloaded='default';
  }



  summaryClicked(position){
    if(position === "top"){
      this.evaluateBody = !this.evaluateBody;
    }
    else{
      this.publishBody = !this.publishBody;
    }
  }

  publish(){
    this.isloaded = 'loading';
    this.ispublishing = true;
    this.publishBtnText = "PUBLISHING";
    let payload = {
      service_id : this.service.id,
      service_name : this.service.name,
      domain : this.service.domain,
      description: this.notesInput,
      username : this.service.created_by
    }
    this.http.post('/jazz/publish-to-clearwater', payload).subscribe((Response) => {
      this.notesInput = '';
      localStorage.setItem('cw_request_id' + "_" + payload.service_name + "_" + payload.domain, JSON.stringify(
        { service: this.service.name,
          domain: this.service.domain,
          request_id: Response.data.request_id
        }));
      this.closeBar();
      this.isloaded = 'default';
      this.onRequestId.emit(Response.data.request_id);
    },
    (err) => {
      this.notesInput = '';
      this.publishBtnText = "PUBLISH";
      this.isloaded = 'default';
      this.ispublishing = false;
      this.toast_pop('error', 'Oops!', 'Error in publishing swagger');
    });
  }

  ngOnChanges(){
    if(this.service.hasOwnProperty('id') && !this.assets && !this.swagger_json){
      this.getassets();
    }else{
      this.formatSwagger();
    }
  }
}
