/** 
  * @type Component 
  * @desc 
  * @author
*/


import { Component, OnInit, EventEmitter,Input,Output,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TableTemplateComponent } from './../table-template/table-template.component';

@Component({
  selector: 'overview-sidebar',
  templateUrl: './overview-sidebar.component.html',
  styleUrls: ['./overview-sidebar.component.scss']
})
export class OverviewSidebarComponent implements OnInit {

  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('tabletemplate') tableTemplate:TableTemplateComponent;



  title:string='Service One\'s Endpoints';
  endpEmpty:boolean=false;
  filterSelected:boolean = false;
  errMessage:string='';
  errCode:number;
  tableHeader2 = [
    {
      label: 'Name',
      key: 'name',
      sort: true,
      filter: {
        type: 'input'
      }
    },{
      label: 'Type',
      key: 'type',
      sort: true,
      filter: {
        type: 'input'
      }
    },{
      label: 'ARN Link',
      key: 'arnlink',
      sort: false,
      
    }
  ];
  endpList = [{
    name:'tmo-dev-ops',
    arn:'arn:test1',
    type:'Account',
  },
  {
    name:'tmo-dev-ops',
    arn:'arn:test2',
    type:'Account'
  },
  {
    name:'us-west-2',
    arn:'arn:test3',
    type:'Region'
  },
  {
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },
  {
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },{
    name:'us-west-2',
    arn:'arn:test3',
    type:'Region'
  },{
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },{
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },{
    name:'us-west-2',
    arn:'arn:test3',
    type:'Region'
  },{
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },{
    name:'us-west-2',
    arn:'arn:test3',
    type:'Region'
  },{
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },{
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },{
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },{
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },{
    name:'tmo-dev-ops',
    arn:'arn:test123',
    type:'Account'
  },
];

copylinkmsg:string="Copy to clipboard";
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  closeBar(flag) {
    
    this.onClose.emit(false);
  }
  onFilter(event){
     
  }

  onSort(event){
     
  }
  paginatePage(event){

  }

  onRowClicked(row,i){

  }
  ngOnInit() {
  }

  myFunction() {
    setTimeout( this.resetCopyValue(), 3000);
 }
 
 resetCopyValue(){
    this.copylinkmsg = "COPY LINK TO CLIPBOARD";
 }
 
 onServiceSearch(event){

 }

 copyClipboard(copyapilinkid){


    var element = null; // Should be <textarea> or <input>
    element = document.getElementById("myid");
    element.select();
    try {
        document.execCommand("copy");
        this.copylinkmsg = "LINK COPIED";
    }
    finally {
      document.getSelection().removeAllRanges;
    }
  }
  
 

}
