/** 
  * @type Component 
  * @desc Generic tab element
  * @author
*/

import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import {environment} from './../../../environments/environment';
 
@Component({
  selector: 'tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  @Input() tabData;
  @Input() type;
  @Input() selectedTab;
  @Input() public tabChanged: Function;
  @Output() onSelected:EventEmitter<boolean> = new EventEmitter<boolean>();
disableobj:any= {
'overview':true,
'access control':true,
'cost':true,
'metrics':true,
'logs':true,
'deployments':true,
'code quality':true,
'assets':true,
};

  constructor() { }

  onDropdownClick(index){
    this.onSelected.emit(index)
    this.selectedTab = index;
  }
  disabletabs(){
    var tabs;
    
      tabs=environment.serviceTabs;
    console.log('tabs after env',this.disableobj);
    for(var i=0;i<tabs.length;i++){
      if(tabs[i] == 'overview') this.disableobj['overview']=false;
      if(tabs[i] == 'access control') this.disableobj['access control']=false;
      if(tabs[i] == 'cost') this.disableobj['cost']=false;
      if(tabs[i] == 'metrics') this.disableobj['metrics']=false;
      if(tabs[i] == 'logs') this.disableobj['logs']=false;
    }
    console.log('tabs after dis env',this.disableobj)

  }
  disableENVtabs(){
    var tabs;
    tabs=environment.environmentTabs;
    console.log('tabs dataa now in this',this.tabData)
    console.log('tabs after env env env',tabs);
    for(var i=0;i<tabs.length;i++){
      if(tabs[i] == 'overview') this.disableobj['overview']=false;
      if(tabs[i] == 'deployments') this.disableobj['deployments']=false;
      if(tabs[i] == 'code quality') this.disableobj['code quality']=false;
      if(tabs[i] == 'assets') this.disableobj['assets']=false;
      if(tabs[i] == 'logs') this.disableobj['logs']=false;
    }
    console.log('tabs after dis env',this.disableobj)
  }
  ngOnInit() {
    this.disabletabs();
    this.disableENVtabs();
    // this.disableobj=environment.serviceTabs;
    // console.log('tabs after env',this.disableobj)
    // console.log('tabs data',this.tabData)

  }

}
