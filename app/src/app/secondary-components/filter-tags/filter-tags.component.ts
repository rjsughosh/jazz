import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DataCacheService } from '../../core/services/index';


@Component({
  selector: 'filter-tags',
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss']
})
export class FilterTagsComponent implements OnInit {
    @Input() filtersApplied: any = {};
    @Output() OnCancel:EventEmitter<any> = new EventEmitter<any>();
    areTagsDefault:boolean;
   
    filterTags:Array<any>=[
        {
            key:'Time Range',
            value:'Day'
        },
        {
            key:'Time Period',
            value:1
        },
        {
            key:'Period',
            value:'15 Minutes'
        },
        {
            key:'Statistics',
            value:'Average'
        }];
        filter_TimeRange:any;
        filter_TimeRangeSlider:any;
        filter_Period:any;
        filter_Statistic:any;

        filter_TimeRange_default:any = 'Day';
        filter_TimeRangeSlider_default:any= 1;
        filter_Period_default:any = '15 Minutes';
        filter_Statistic_default:any= 'Average';

    constructor(private cache: DataCacheService){

    }

    setDefaults(){
        switch(this.filterTags[0].value){
            case 'Day':{   this.filter_Period_default = '15 Minutes'; 
                break;
            }
            case 'Week':{   this.filter_Period_default = '1 Hour';
                break;
            }
            case 'Month':{  this.filter_Period_default = '6 Hours';
                break;
            }
            case 'Year':{   this.filter_Period_default = '7 Days';
                break;
            }
        }
    }

    notify(key,value){
        this.setDefaults();
        
        
        switch(key){
            case 'filter-TimeRange':{
                this.filterTags[0].value=this.filter_TimeRange=value;
                break;
            }
            case 'filter-TimeRangeSlider':{
                this.filterTags[1].value=this.filter_TimeRange=value;                
                break;
            }
            case 'filter-Period':{
                this.filterTags[2].value=this.filter_TimeRange=value;                
                break;
            }
            case 'filter-Statistic':{
                this.filterTags[3].value=this.filter_TimeRange=value;                
                break;
            }
        }

    }
    
    notifyLogs(key,value){
        
        this.setDefaults();
        switch(key){
            case 'filter-TimeRange':{
                this.filterTags[0].value=this.filter_TimeRange=value;
                break;
            }
            case 'filter-TimeRangeSlider':{
                this.filterTags[1].value=this.filter_TimeRange=value;                
                break;
            }
            
        }
    }
    notifyServices(key){
        alert('notified bitches'+key);
    }
    clearall(value){
        this.OnCancel.emit(value);
        
    }
    ngOnChanges(x:any){
        this.filtersApplied='month';
        // this.filterForCancel=this.filtersApplied;
        // this.filterForCancel.emit(this.filtersApplied);

        // this.filterTags[0].value=this.filter_TimeRange=this.cache.get('filter-TimeRange');
        // this.filterTags[1].value=this.filter_TimeRangeSlider=this.cache.get('filter-TimeRangeSlider');
        // this.filterTags[2].value=this.filter_Period=this.cache.get('filter-Period');
        // this.filterTags[3].value=this.filter_Statistic=this.cache.get('filter-Statistic');


        
    }
    ngOnInit(){
        
        this.areTagsDefault=true;
    }
}
