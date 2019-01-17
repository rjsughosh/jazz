import { Component,ViewContainerRef, OnInit, Input, Output, EventEmitter,ViewChild } from '@angular/core';
import {DataCacheService } from '../../core/services/index';

@Component({
  selector: '[advanced_filters]',
  templateUrl: './advanced-filters.component.html',
  styleUrls: ['./advanced-filters.component.scss']
})
export class AdvancedFiltersComponent implements OnInit {
   

    constructor(public viewContainerRef: ViewContainerRef , private cache: DataCacheService) {}
    data: any;
    @Input() advanced_filter_input:any = {};
    @Input() logs:boolean = false;
    @Input() assets:boolean = false;

    @Input() service: any = {};

    @Output() onFilterSelect:EventEmitter<any> = new EventEmitter<any>();


    slider:any;
    sliderFrom = 1;
    sliderPercentFrom = 0;
    sliderMax:number = 7;


    filterSelected:boolean;

    selectFilter:any={}
    periodList: Array<string> = ['15 Minutes','1 Hour','6 Hours','1 Day','7 Days','30 Days'];
    periodSelected:string= this.periodList[0];

    timePeriodList: Array<number> = [1,2,3,4,5,6,7];
    selectedTimePeriod: number = 1;

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
        console.log("e === ",e);
        // this.FilterTags.notify('filter-TimeRangeSlider',e.from);
        this.selectFilter["key"]='slider';
        this.selectFilter["value"]=e;
        this.onFilterSelect.emit(this.selectFilter);

        this.sliderFrom =e.from;
        this.sliderPercentFrom=e.from_percent;
        // var resetdate = this.getStartDate(this.selectedTimeRange, this.sliderFrom);
        // // this.payload.start_time = resetdate;
        // this.callMetricsFunc();
    }

    resetslider(e){
        this.sliderPercentFrom=0;
        this.sliderFrom=e;
        this.onClickFilter();
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
        //console.log('slidermax, ',event)
        this.sliderMax=event;
        // update time period list when sliderMax changes
        var timePeriodList = [];
        for (var i = this.sliderFrom; i <= this.sliderMax; i ++){
            timePeriodList.push(i);
        }
        this.timePeriodList = timePeriodList;
        this.sliderFrom=1;
        this.sliderPercentFrom=0;


    }
    onRangeListSelected(range){
    
        this.selectedTimeRange = range;
        this.selectFilter["key"]='range';
        this.selectFilter["value"]=range;
        this.onFilterSelect.emit(this.selectFilter);
        
    }

    onTimePeriodSelected(period){
        this.selectedTimePeriod = period;
        this.selectFilter["key"]='slider';
        this.sliderFrom = period;
        this.sliderPercentFrom = this.sliderMax > 1 ? (period - 1) / (this.sliderMax - 1) : 1;
        var event = {
            value: period,
            from: period,
            from_percent: this.sliderPercentFrom
        };
        
        this.selectFilter["value"] = event;
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
    // var slider = document.getElementById('sliderElement');
    // if( this.sliderFrom == 1 ){
    //     slider.getElementsByClassName('irs-single')[0].attributes[0].ownerElement.innerHTML = "1";
    // }
    // if(slider != null || slider != undefined){
    //     slider.getElementsByClassName('irs-line-mid')[0].setAttribute('style','border-radius:10px;')
        
    //     slider.getElementsByClassName('irs-bar-edge')[0].setAttribute('style',' background: none;background-color: #ed008c;border-bottom-left-radius:10px;border-top-left-radius:10px;width: 10px;');
        
    //     slider.getElementsByClassName('irs-single')[0].setAttribute('style',' background: none;background-color: #ed008c;left:'+this.sliderPercentFrom+'%');
       
    //     slider.getElementsByClassName('irs-bar')[0].setAttribute('style',' background: none;left:10px;background-color: #ed008c;width:'+this.sliderPercentFrom+'%');
        
    //     slider.getElementsByClassName('irs-slider single')[0].setAttribute('style','width: 20px;top: 20px;height: 20px;border-radius: 50%;cursor:pointer;background: none; background-color: #fff;left:'+this.sliderPercentFrom+'%');
        
    //     slider.getElementsByClassName('irs-max')[0].setAttribute('style','background: none');
       
    //     slider.getElementsByClassName('irs-min')[0].setAttribute('style','background: none');
    // }
    
    
    
  }
    isAPI:boolean = false;
   hideleft:boolean=false;
   style_exp:string='none';

    ngOnInit(){
        var env_list=this.cache.get('envList')
        if(env_list != undefined)
            this.envList=env_list.friendly_name;  
        var comp=this;
        setTimeout(() => {
                    if(this.service.serviceType == 'api')this.isAPI=true;
                    if(this.service.ismetrics){
                        comp.style_exp = '0 2px 4px 0 rgba(0, 0, 0, 0.15) !important;';
                    }                      
        },10)                
        this.advanced_filter_input = this.data.advanced_filter_input;
        this.service = this.data.service;
        this.pathList = ['/'+this.service.domain+'/'+this.service.name];
        this.pathSelected = this.pathList[0];

        if(this.service.ismetrics){
            this.statisticSelected=this.statisticList[1];
        }
        
    }
    ngOnChanges(x:any){
       this.pathList = ['/'+this.service.domain+'/'+this.service.name];
        this.pathSelected = this.pathList[0];

        }
}
