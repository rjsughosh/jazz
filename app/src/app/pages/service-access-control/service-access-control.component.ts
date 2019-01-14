/** 
  * @type Component 
  * @desc Service access control page
  * @author
*/

import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { RequestService, MessageService } from '../../core/services/index';


@Component({
  selector: 'service-access-control',
  templateUrl: './service-access-control.component.html',
  providers: [ RequestService, MessageService ],
  styleUrls: ['./service-access-control.component.scss']
})
export class ServiceAccessControlComponent implements OnInit {

  accessGranted:Boolean = false;
  i: number = 0;
  groupStatus:any = ['Read' , 'Manage' , 'Admin'];
  grpName:string;
  resMessage : any;
  approversListShow: any;
  private http: any;
  private toastmessage: any = '';
  approversListRes: any;
  disableCode: boolean = false;
  disableManage: boolean = false;
  disableDeploy: boolean = false;
  selectedApprovers: any;
  saveEnabled:boolean = false;
  public newGroup: any = {
    'name': '',
    'accessType':'read'
  }
  showDisplay:Boolean = true;
  // list groups which has access for specific action//
  groupsAccess: any = {
    'manage': [{
        'name': 'John Smith (jSmith)',
        'readOnly':false,
        'accessType':'admin',
        "userType": 'Admin',
    }],
    'code' : [{
        'name': 'John Smith (jSmith)',
        'accessType':'read',
        'readOnly':false,
        'userType':"Read Only"
    }],
    'deploy' : [{
        'name': 'John Smith (jSmith)',
        'readOnly':false
    }]
  }

  // list of all the groups//
  groupList: any = [{'givenName':'group one'}, {'givenName':'group two'}, {'givenName':'group three'},{'givenName':'group four'},{'givenName':'group five'},{'givenName':'group six'},{'givenName':'group seven'}]
  
  // function to show group list(auto-complete)
  ongrpNameChange(category, i){
    if(category == 'manage'){
       this.groupsAccess.manage[i].showGroups = true;
    } else if(category == 'code'){
       this.groupsAccess.code[i].showGroups = true;
    } else if(category == 'deploy'){
       this.groupsAccess.deploy[i].showGroups = true;
    } 
  }
  
  //function for deleting group
  deletegroup(i,category){
    if(category == 'manage'){
       this.groupsAccess.manage.splice(i,1);
       if(this.groupsAccess.manage.length == 1)
         this.disableManage = true;
      else
         this.disableManage = false
    } else if(category == 'code'){
       this.groupsAccess.code.splice(i,1);
       if(this.groupsAccess.code.length == 1)
       this.disableCode = true;
    else
       this.disableCode = false;
    } else if(category == 'deploy'){
       this.groupsAccess.deploy.splice(i,1);
    } 
  }
  
  //function for adding group
  addgroup(i,category){
     this.saveEnabled = true;
    if(category == 'manage'){
       this.groupsAccess.manage.push({'name': '','accessType':'read', 'userType':"Read Only"});
       if(this.groupsAccess.manage.length == 1)
         this.disableManage = true;
      else
         this.disableManage = false;

      console.log(this.groupsAccess);
    } else if(category == 'code'){
      if(this.groupsAccess.code[i].accessType == 'read')
       this.groupsAccess.code.push({'name': '','accessType':'read', 'userType':"Read Only"});
       else
       this.groupsAccess.code.push({'name': '','accessType':'write', 'userType':"Write"});
       if(this.groupsAccess.code.length == 1)
         this.disableCode = true;
      else
         this.disableCode = false;
    } else if(category == 'deploy'){
       this.groupsAccess.deploy.push({'name': '','accessType':'read', 'userType':"Read Only"});
       if(this.groupsAccess.code.length == 1)
         this.disableDeploy = true;
      else
         this.disableDeploy = false;
    } 
  }

  onEditClick(){
     this.showDisplay = false;
  }

  onSaveClick(){
     this.showDisplay = true;
  }
  onCancelClick(){
   this.showDisplay = true;
  }
  refresh(){

  }
  //function for selecting group from list of groups//
  selectApprovers(group, index , category){
     if(category == 'manage'){
       this.groupsAccess.manage[index].name = `${group.displayName} (${group.userId})`;
       this.groupsAccess.manage[index].showGroups = false;
    } else if(category == 'code'){
       this.groupsAccess.code[index].name = `${group.displayName} (${group.userId})`;
       this.groupsAccess.code[index].showGroups = false;
    } else if(category == 'deploy'){
       this.groupsAccess.deploy[index].name = `${group.displayName} (${group.userId})`;
       this.groupsAccess.deploy[index].showGroups = false;
    } 
  }
  
  // function to update data whenever radio status is changed(read , manage, admin)
  onSelectionChange(value,index){
      this.groupsAccess.code[index].accessType = value;
      if(this.groupsAccess.code[index].accessType == 'read')
         this.groupsAccess.code[index].userType = "Read Only";
      else
         this.groupsAccess.code[index].userType = "Write";
      
  }

  onManagementChange(value,index){
   this.groupsAccess.manage[index].accessType = value;
   if(this.groupsAccess.manage[index].accessType == 'read')
   this.groupsAccess.manage[index].userType = "Read Only";
   else
   this.groupsAccess.manage[index].userType = "Admin";
  }

  public getData() {
   let localApprovvs = JSON.parse(localStorage.getItem('approvers')) ||  {};
   if(Object.keys(localApprovvs).length>0){
       this.approversListRes = localApprovvs;
       this.approversListShow= localApprovvs.data.values.slice(0, localApprovvs.data.values.length);
   }else {
       this.http.get('/platform/ad/users')
       .subscribe((res: Response) => {
           this.approversListRes = res;
           this.approversListShow= this.approversListRes.data.values.slice(0, this.approversListRes.data.values.length);
       }, error => {
           this.resMessage = this.toastmessage.errorMessage(error, 'aduser');
           this.toast_pop('error', 'Oops!', this.resMessage);
       });
    }
   this.groupList = this.approversListShow.slice(0,100);
   console.log(this.groupList);
   }
   toast_pop(error, oops, errorMessage) {
      var tst = document.getElementById('toast-container');
      tst.classList.add('toaster-anim');
      this.toasterService.pop(error, oops, errorMessage);
      setTimeout(() => {
         tst.classList.remove('toaster-anim');
      }, 3000);
}

ngOnChanges(){
   if(this.groupsAccess.code.length == 1)
         this.disableCode = true;
      else
         this.disableCode = false;
    if(this.groupsAccess.manage.length == 1)
         this.disableManage = true;
      else
         this.disableManage = false;

}


  constructor(
   private request: RequestService,
   private toasterService: ToasterService,
   private messageservice: MessageService
  ) {
   this.http = request;
   this.toastmessage = messageservice;
   this.getData();
   }

  ngOnInit() {
  }

}
