import { Component,ViewContainerRef, OnInit, Input, Output, EventEmitter,ViewChild } from '@angular/core';
import {DataCacheService } from '../../core/services/index';
import {IonRangeSliderModule} from "ng2-ion-range-slider";


@Component({
  selector: '[advanced_filters]',
  templateUrl: './advanced-filters.component.html',
  styleUrls: ['./advanced-filters.component.scss']
})
export class AdvancedFiltersComponent implements OnInit {
   

    constructor(public viewContainerRef: ViewContainerRef , private cache: DataCacheService) { }
    data: any;
    @Input() advanced_filter_input:any = {};
    @Input() logs:boolean = false;
    @Input() assets:boolean = false;

    @Input() service: any = {};
    @ViewChild('sliderElement') sliderElement: IonRangeSliderModule;

    
    @Output() onFilterSelect:EventEmitter<any> = new EventEmitter<any>();


    slider:any;
    sliderFrom = 1;
    sliderPercentFrom;
    sliderMax:number = 7;


    filterSelected:boolean;

    selectFilter:any={}
    periodList: Array<string> = ['15 Minutes','1 Hour','6 Hours','1 Day','7 Days','30 Days'];
    periodSelected:string= this.periodList[0];

    rangeList: Array<string> = ['Day', 'Week', 'Month', 'Year'];
    selectedTimeRange:string= this.rangeList[0];

    statisticList: Array<string> = ['Average', 'Sum', 'Maximum','Minimum'];
    statisticSelected:string= this.statisticList[0];

    methodList:Array<string>  = ['POST','GET','DELETE','PUT'];
    methodSelected:string = this.methodList[0];

    pathList:Array<string>=[];
    pathSelected:string = '';

    
    accList=['tmodevops','tmonpe'];
    regList=['us-west-2', 'us-east-1'];

	accSelected:string = 'tmodevops';
    regSelected:string = 'us-west-2';

    envList:any=['prod','stg'];
    envSelected:string=this.envList[0];
  
    getRange(e){
        this.sliderPercentFrom=e.from_percent;
        // this.FilterTags.notify('filter-TimeRangeSlider',e.from);
        this.selectFilter["key"]='slider';
        this.selectFilter["value"]=e;
        this.onFilterSelect.emit(this.selectFilter);

        // this.sliderFrom =e.from;
        // this.sliderPercentFrom=e.from_percent;
        // var resetdate = this.getStartDate(this.selectedTimeRange, this.sliderFrom);
        // // this.payload.start_time = resetdate;
        // this.callMetricsFunc();
    }
      
    onPeriodSelected(period){
        this.periodSelected=period;
        this.selectFilter["key"]='period';
        this.selectFilter["value"]=period;
        this.onFilterSelect.emit(this.selectFilter);
        
    }
    resetPeriodList(event){
        this.periodList=event;
        this.periodSelected=this.periodList[0];
    }
    setSlider(event){
        console.log('slidermax, ',event)
        this.sliderMax=event;
        this.sliderFrom=1;
        this.sliderPercentFrom=0;


    }
    onRangeListSelected(range){
       
        this.sliderFrom =1;
        this.sliderPercentFrom=0;
        this.selectedTimeRange = range;
        this.selectFilter["key"]='range';
        this.selectFilter["value"]=range;
        this.onFilterSelect.emit(this.selectFilter);
        
    }
    onEnvSelected(envt){
        this.envSelected = envt;
        this.selectFilter["key"]='environment';
        this.selectFilter["value"]=envt;
        this.onFilterSelect.emit(this.selectFilter);
        
    }
    onStatisticSelected(statistics){
   
    this.statisticSelected = statistics;
    this.selectFilter["key"]='statistics';
    this.selectFilter["value"]=statistics;
    this.onFilterSelect.emit(this.selectFilter);
   
    }

    onMethodListSelected(method){

        this.methodSelected=method;
        this.selectFilter["key"]='method';
        this.selectFilter["value"]=method;
        this.onFilterSelect.emit(this.selectFilter);
        
    }
    
    onPathListicSelected(path){
        this.pathSelected=path;
        this.selectFilter["key"]='path';
        this.selectFilter["value"]=path;
        this.onFilterSelect.emit(this.selectFilter);
    }
   onaccSelected(event){
    this.accSelected=event;
    this.selectFilter["key"]='account';
    this.selectFilter["value"]=event;
    this.onFilterSelect.emit(this.selectFilter);

   }

	onregSelected(event){
    this.regSelected=event;
    this.selectFilter["key"]='region';
    this.selectFilter["value"]=event;
    this.onFilterSelect.emit(this.selectFilter);
   }

   onClickFilter(){
    var from = this.cache.get("sliderFrom");
    console.log("from = ",from);
    if(from == 1){
        this.sliderPercentFrom  = 0;
    }
    console.log("sliderPercentFrom = ",this.sliderPercentFrom);
      
    var slider = document.getElementById('sliderElement');
    console.log('slider  -=->',slider);
    if(slider != null || slider != undefined){
        // alert('1')
        slider.getElementsByClassName('irs-line-mid')[0].setAttribute('style','border-radius:10px;')
        
        // alert('2')
        // console.log('2 ,',slider);
        slider.getElementsByClassName('irs-bar-edge')[0].setAttribute('style',' background: none;background-color: #ed008c;border-bottom-left-radius:10px;border-top-left-radius:10px;width: 10px;');
        // alert('3')
        // console.log('3 ,',slider);
        slider.getElementsByClassName('irs-single')[0].setAttribute('style',' background: none;background-color: #ed008c;left:'+this.sliderPercentFrom+'%');
        // alert('4')
        // console.log('4 ,',slider);
        slider.getElementsByClassName('irs-bar')[0].setAttribute('style',' background: none;left:10px;background-color: #ed008c;width:'+this.sliderPercentFrom+'%');
        // alert('5')


        
        // console.log('5 ,',slider);
        slider.getElementsByClassName('irs-slider single')[0].setAttribute('style','width: 20px;top: 20px;height: 20px;border-radius: 50%;cursor:pointer;background: none; background-color: #fff;left:'+this.sliderPercentFrom+'%');
        // alert('6')
        // console.log('6 ,',slider);
        // slider.getElementsByClassName('irs-slider single')[0].classList.add('newone')
        slider.getElementsByClassName('irs-max')[0].setAttribute('style','background: none');
        // alert('7')
        // console.log('7 ,',slider);
        slider.getElementsByClassName('irs-min')[0].setAttribute('style','background: none');
    }
    
    
    
  }

   
    ngOnInit(){
        console.log(this.data);
        this.advanced_filter_input = this.data.advanced_filter_input;
        this.service = this.data.service;
        var from = this.cache.get("sliderFrom");
        console.log("from = ", from);
        
    }
    ngOnChanges(x:any){
       this.pathList = ['/'+this.service.domain+'/'+this.service.name];
        this.pathSelected = this.pathList[0];
        var from = this.cache.get("sliderFrom");
        console.log("from = ", from);
        }
}
