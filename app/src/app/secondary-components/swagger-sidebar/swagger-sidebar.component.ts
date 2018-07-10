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


@Component({
  selector: 'swagger-sidebar',
  templateUrl: './swagger-sidebar.component.html',
  styleUrls: ['./swagger-sidebar.component.scss']
})
export class SwaggerSidebarComponent implements OnInit {

  @Input() service: any = {};
  @Input() envSelected: any = {};  
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  swaggerAsset:any;
  swagger_json:any;
  validityMessage:string;
  valid:boolean = true;
  isloaded:string = 'default';
  cw_score:any = {};
  cw_message:any = '';
  cw_keysList;
  cw_results;
  cw_obj:any={};
  obj:any = {};
  assets;
  foundAsset;

  private http:any;
  constructor(
    private toasterService: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
    private request:RequestService,  
    private relaxedJson: RelaxedJsonService,
  ) {
    this.http = request;

   }

  closeBar(flag?) {  
    this.isloaded='popup' 
    this.onClose.emit(false);
    
  }
 
  close_bar(param){
    if(param == "yes"){
      this.closeBar();
      setTimeout(() => {
        this.isloaded='default';
      },1000)
    }
    else if(param == "no"){
      this.isloaded='default';
    }
    else{
      this.isloaded='popup';
    }
  }
  ngOnInit() {

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
    this.isloaded='default'
    try{
      let payload = JSON.parse(this.swagger_json);
      this.swagger_json = this.stringToPrettyString(this.swagger_json);
    }
    catch(e){
      this.validityMessage = 'Input is invalid JSON';
      this.valid = false;
    }
  }

  EvaluateJSON(){
    this.isloaded='loading';
    var payload = {
      "swaggerDoc":this.swagger_json
    }
    this.http.post('/jazz/apilinter',payload).subscribe(
      (response) => {
        this.isloaded='loaded';
        this.obj=response;       
        this.cw_obj = response.results;
        this.cw_score=response.results.score;
        this.cw_message=response.results.message;
       
          },
          (error) => {
            this.isloaded='error';
      });
  }

  getassets(){
    this.http.post('/jazz/assets/search', {
      service: this.service.service || this.service.name,
      domain: this.service.domain,
      environment: this.envSelected,
      limit: undefined
    }).subscribe((assetsResponse) => {
      this.assets = assetsResponse.data;
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

  getdata(){
    this.http.get(this.foundAsset.provider_id.replace('http','https')).subscribe(
      (response) => {
        this.swagger_json=JSON.stringify(response);
        this.swagger_json = this.stringToPrettyString(this.swagger_json);
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
  ngOnChanges(){
    if(this.service.hasOwnProperty('id')){
      this.getassets();


    }
  }
   

}
