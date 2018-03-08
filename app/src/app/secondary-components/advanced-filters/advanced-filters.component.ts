import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DataCacheService } from '../../core/services/index';
@Component({
  selector: 'advanced-filters',
  templateUrl: './advanced-filters.component.html',
  styleUrls: ['./advanced-filters.component.scss']
})
export class AdvancedFiltersComponent implements OnInit {
   

    constructor(){

    }
    @Input() advanced_filter_input:any = {};
    @Input() service: any = {};
    
    @Output() onFilterSelect:EventEmitter<any> = new EventEmitter<any>();


    sliderPercentFrom:number;


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
  

    onPeriodSelected(period){
        this.periodSelected=period;
        this.selectFilter["key"]='period';
        this.selectFilter["value"]=period;
        this.onFilterSelect.emit(this.selectFilter);
        // console.log('#$@#$$@#@#$#$',this.FilterTags);;
        // this.FilterTags.notify('filter-Period',period);
        // this.cache.set('filter-Period',period);
        // this.payload.interval = this.periodListSeconds[this.periodList.indexOf(period)];
        // this.callMetricsFunc();
    }

    onRangeListSelected(range){
        // this.FilterTags.notify('filter-TimeRange',range);
        // this.sendDefaults(range);
        
        // // this.cache.set('filter-TimeRange',range);
        // this.timerangeSelected=range;
        // this.sliderFrom =1;
        // this.FilterTags.notify('filter-TimeRangeSlider',this.sliderFrom);
        
        // var resetdate = this.getStartDate(range, this.sliderFrom);
        // this.resetPeriodList(range);
        this.selectedTimeRange = range;
        this.selectFilter["key"]='range';
        this.selectFilter["value"]=range;
        this.onFilterSelect.emit(this.selectFilter);
        // this.payload.start_time = resetdate;
        // this.callMetricsFunc();
    }
    onEnvSelected(envt){
        // this.FilterTags.notify('filter-Env',envt);
        this.envSelected = envt;
        this.selectFilter["key"]='environment';
        this.selectFilter["value"]=envt;
        this.onFilterSelect.emit(this.selectFilter);
        // this.payload.environment = envt;
        // var env_list=this.cache.get('envList');
        //     var fName = env_list.friendly_name;
        //     var index = fName.indexOf(envt);
        //     var env = env_list.env[index];
        // this.envSelected = envt;
        // this.payload.environment = env;
        // this.callMetricsFunc();
        // this.envUpdate = true;
        // this.methodSelected = this.methodList[0];
    }
    onStatisticSelected(statistics){
    // this.payload.statistics = statistics;
    // this.FilterTags.notify('filter-Statistic',statistics);
    
    // this.cache.set('filter-Statistic',statistics);
    this.statisticSelected = statistics;
    this.selectFilter["key"]='statistics';
    this.selectFilter["value"]=statistics;
    this.onFilterSelect.emit(this.selectFilter);
    // this.payload.statistics = statistics;
    // this.callMetricsFunc();
    }

    onMethodListSelected(method){

        // this.FilterTags.notify('filter-Method',method);

        this.methodSelected=method;
        this.selectFilter["key"]='method';
        this.selectFilter["value"]=method;
        this.onFilterSelect.emit(this.selectFilter);
        // this.displayMetrics();
    }
    
    onPathListicSelected(path){
        this.pathSelected=path;
        this.selectFilter["key"]='path';
        this.selectFilter["value"]=path;
        this.onFilterSelect.emit(this.selectFilter);
        // this.displayMetrics();
    }
   onaccSelected(event){
    // this.FilterTags.notify('filter-Account',event);
    this.accSelected=event;
    this.selectFilter["key"]='account';
    this.selectFilter["value"]=event;
    this.onFilterSelect.emit(this.selectFilter);

   }

	onregSelected(event){
    // this.FilterTags.notify('filter-Region',event);
    this.regSelected=event;
    this.selectFilter["key"]='region';
    this.selectFilter["value"]=event;
    this.onFilterSelect.emit(this.selectFilter);
   }

   onClickFilter(){
    
    //ng2-ion-range-slider
      
    var slider = document.getElementById('sliderElement');
    
    slider.getElementsByClassName('irs-line-mid')[0].setAttribute('style','border-radius:10px;')
    slider.getElementsByClassName('irs-bar-edge')[0].setAttribute('style',' background: none;background-color: #ed008c;border-bottom-left-radius:10px;border-top-left-radius:10px;width: 10px;');
    slider.getElementsByClassName('irs-single')[0].setAttribute('style',' background: none;background-color: #ed008c;left:'+this.sliderPercentFrom+'%');
    slider.getElementsByClassName('irs-bar')[0].setAttribute('style',' background: none;left:10px;background-color: #ed008c;width:'+this.sliderPercentFrom+'%');
    slider.getElementsByClassName('irs-slider single')[0].setAttribute('style','width: 20px;top: 20px;height: 20px;border-radius: 50%;cursor:pointer;background: none; background-color: #fff;left:'+this.sliderPercentFrom+'%');
    slider.getElementsByClassName('irs-max')[0].setAttribute('style','background: none');
    slider.getElementsByClassName('irs-min')[0].setAttribute('style','background: none');
    
  }

   
    ngOnInit(){
        
    }
    ngOnChanges(x:any){
        // this.filterTags();
        // this.fetchEnvlist();
    
        // // console.log('---------------------------------------------------------aplied filter chaneged',this.filtersApplied);
        this.pathList = ['/'+this.service.domain+'/'+this.service.name];
        this.pathSelected = this.pathList[0];
        }
}
