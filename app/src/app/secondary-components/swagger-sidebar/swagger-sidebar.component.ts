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
  @Output() evaluate: EventEmitter<any> = new EventEmitter<any>();

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
  public lineNumberCount: any = new Array(40).fill('');


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




  ngOnInit() {

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
    var payload = {
      "swaggerDoc":this.swagger_json
    }
    this.evaluate.emit(payload);
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

  ontextareaScroll(){
    var target = $("#target");
    $("#source").scroll(function() {
      target.prop("scrollTop", this.scrollTop)
            .prop("scrollLeft", this.scrollLeft);
    });
    }

  getdata(){
    this.foundAsset.provider_id=this.foundAsset.provider_id.replace('http://', 'https://');
    console.log('swagger url, ',this.foundAsset.provider_id)
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
  ngOnChanges(){
    if(this.service.hasOwnProperty('id')){
      this.getassets();


    }
  }


}
