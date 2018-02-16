import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../../core/services/index';
import { ToasterService} from 'angular2-toaster';
import {DataCacheService } from '../../core/services/index';
import { HttpModule } from '@angular/http';
import { RequestService , MessageService } from "../../core/services";
import { release } from 'os';



@Component({
    selector: 'landing',
    templateUrl: 'landing.component.html',
    providers : [RequestService],
    styleUrls: ['landing.component.scss']
})

export class LandingComponent implements OnInit {

    buttonText: string = 'GET STARTED NOW';
    goToLogin: boolean = false;
    safeTransformX: number=0;
    releases: Array<any> = [];
    releases_selected:any={};

    monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    private subscription:any;
    private http:any;
    releases_time=[];
    min: boolean=true;
    max: boolean=false;
    dropShow:boolean = true;
    selected_release:any={};
    json:any;
    cardActive:boolean=true;
    title = 'Create. Manage. Self-Service.';
    subtitle = 'Our API Services system allows you to seamlessly create, deploy, and manage all you API needs.';
    override = false;
    private IDLE_TIMEOUT = 60*10; //seconds
    num_ser_cr:number=160;
    num_users:number=100;
    num_act_usr:number=20;
    num_act_ser:number=120;

    public getStartedNow(){
       
        if(this.authenticationservice.isLoggedIn()){
            this.router.navigateByUrl('/services');
        } else {
            this.goToLogin = true;
            this.onLoginClicked(true);
        }
        
    }
    public onLoginClicked (goToLogin) {
        this.goToLogin = goToLogin;
        this.closed = false;
    }
    closed:boolean=true;
    public closeSidebar (eve){
        this.goToLogin = false;
        this.closed = true;
    }
    onNavigate(event){
        if(event.target.innerText === "Privacy"){
            window.open('https://www.t-mobile.com/company/website/privacypolicy.aspx');                    
        } else if(event.target.innerText === "Docs"){
            window.open('https://docs.jazz.corporate.t-mobile.com');        
            
        }
    }
    public shiftLeft(){
        var visibleWindow = document.getElementById('scroll-me').offsetLeft;
        var width = document.getElementById('scrollable-cards').offsetWidth;
        var noOfChildren = document.getElementById('scroll-me').children.length;
        var innerwidth = document.getElementById("first-card").offsetWidth+3;
        this.min=false;
        if(noOfChildren>0){
            if(document.body.clientWidth>840 && noOfChildren>4){
                if(this.safeTransformX>=(-(noOfChildren-5)*innerwidth)){
                    this.safeTransformX = this.safeTransformX - innerwidth;
                    if(this.safeTransformX==(-(noOfChildren-4)*innerwidth)){
                        this.max=true;
                    }
                } 
            } else if(document.body.clientWidth<840){
                if(this.safeTransformX>(-(noOfChildren-1)*innerwidth)){
                    this.safeTransformX = this.safeTransformX - innerwidth;
                    if(this.safeTransformX==(-(noOfChildren-1)*innerwidth)){
                        this.max=true;
                    }
                }
            }
        }else{
            this.max=true;
        }
    }
     public shiftRight(){
        var visibleWindow = document.getElementById('scroll-me').offsetLeft;
        var width = document.getElementById('scrollable-cards').offsetWidth;
        var noOfChildren = document.getElementById('scroll-me').children.length;
        var innerwidth = document.getElementById("first-card").offsetWidth+3;
        this.max=false;
        if(noOfChildren>0){
            if(this.safeTransformX!=0){
                this.min=false;
                this.safeTransformX = this.safeTransformX + innerwidth;
                if(this.safeTransformX==0){
                    this.min=true;
                }
            }
        } else{
            this.min=true;
        }
    }

    loop(j){
        setTimeout(() => {
            // if(this.stat_arr[j].limit > 300)             this.stat_arr[j].i+=100;
            if(this.stat_arr[j].limit > 1000)             this.stat_arr[j].i+=50; 

            else if(this.stat_arr[j].limit > 50000)             this.stat_arr[j].i+=1000; 
            else if(this.stat_arr[j].limit > 500000)             this.stat_arr[j].i+=100000; 
            else if(this.stat_arr[j].limit > 700000)            this.stat_arr[j].i+=500000; 

            else this.stat_arr[j].i++;                    
            if (this.stat_arr[j].i <= this.stat_arr[j].limit) {  
                this.stat_arr[j].value=this.stat_arr[j].i;
                this.loop(j);            
            }      
          }, (2000/this.stat_arr[j].limit));
    }
    loop2(j){
        setTimeout(() => {
            // if(this.stat_arr2[j].limit > 300)             this.stat_arr2[j].i+=100;
            if(this.stat_arr2[j].limit > 1000)             this.stat_arr2[j].i+=50;

            else if(this.stat_arr2[j].limit > 50000)            this.stat_arr2[j].i+=1000; 
            else if(this.stat_arr2[j].limit > 500000)            this.stat_arr2[j].i+=100000; 
            else if(this.stat_arr2[j].limit > 700000)            this.stat_arr2[j].i+=500000; 

            else this.stat_arr2[j].i++;                        
            if (this.stat_arr2[j].i <= this.stat_arr2[j].limit) {  
                this.stat_arr2[j].value=this.stat_arr2[j].i;                
                this.loop2(j);          
            }      
          }, (2000/this.stat_arr2[j].limit));
    }
    stat_arr=[
        {
            j:0,
            limit:0,
            value:0,
            i:0
        },
        {
            j:0,
            limit:0,
            value:0,
            i:0
        },
        {
            j:0,
            limit:0,
            value:0,
            i:0
        },
        {
            j:0,
            limit:0,
            value:0,
            i:0
        }
    ];

    stat_arr2=[
        {
            j:0,
            limit:0,
            value:0,
            i:0
        },
        {
            j:0,
            limit:0,
            value:0,
            i:0
        },
        {
            j:0,
            limit:0,
            value:0,
            i:0
        },
        {
            j:0,
            limit:0,
            value:0,
            i:0
        },
        {
            j:0,
            limit:0,
            value:0,
            i:0
        },
        {
            j:0,
            limit:0,
            value:0,
            i:0
        }
    ];

    loadnumbers(){
        // var arr=[this.num_ser_cr,this.num_users,this.num_act_usr,this.num_act_ser]
        // var arr2=[20,45,21,81,120,32];
        // for(var j=0;j<4;j++){
        //     this.stat_arr[j].limit=arr[j];
        // }
       this.loopMulti();

        // for(var m=0;m<arr2.length;m++){
        //     this.stat_arr2[m].limit=arr2[m];
        // }      

    }

    loopMulti(){
        this.loop(0);this.loop(1);this.loop(2);this.loop(3);
        this.loop2(0);this.loop2(1);this.loop2(2);this.loop2(3);this.loop2(4);this.loop2(5);        



    }
    formatReleases(response){
        for(var i=0;i<response.releases.length;i++){
            this.releases[i].name=response.releases[i].name;
        }
    }
    selectRelease(i){
        this.selected_release=this.releases[i];
        this.dropShow=true;
        // this.selected_release.fixes=[]; 
        // this.selected_release.improvements=[];                
        
        // this.selected_release.fixes[0] = 'Bug fixes and general improvements';
        // this.selected_release.fixes[1] = 'Bug fixes and general improvements';
        // this.selected_release.improvements[0] = 'General improvements and bug fixes';
        // this.selected_release.improvements[1] = 'General improvements and bug fixes';

    }
    fetchData(){
        this.subscription = this.http.get('https://api.myjson.com/bins/198bcp').subscribe(
            (response) => {
                console.log('response => ',response);
                this.stat_arr2[1].limit=response.statistics[0].data.commits;
                this.stat_arr2[0].limit=response.statistics[0].data.forks;
                this.stat_arr2[2].limit=response.statistics[0].data.githubStars;
                this.stat_arr2[4].limit=response.statistics[0].data.issues;
                this.stat_arr2[5].limit=response.statistics[0].data.pullRequests;

                this.stat_arr[3].limit=response.statistics[1].data.applications;
                this.stat_arr[0].limit=parseInt(response.statistics[1].data.services.api)+parseInt(response.statistics[1].data.services.functions)+parseInt(response.statistics[1].data.services.websites);
                this.stat_arr2[3].limit=response.statistics[1].data.totalNumberOfRequestServed;
                this.stat_arr[1].limit=response.statistics[1].data.users;
                this.stat_arr[2].limit=response.statistics[1].data.users;
                this.releases = response.releases.slice(0, response.releases.length);

                for(var i=0;i<this.releases.length;i++)
                {
                var month = this.monthNames[new Date(this.releases[i].publishTimestamp.substring(0,10)).getMonth()];
                var day = new Date(this.releases[i].publishTimestamp.substring(0,10)).getDate();
               var year = new Date(this.releases[i].publishTimestamp.substring(0,10)).getFullYear();
                this.releases_time[i] = '' + month + ' ' + day +', ' + year;
                this.releases[i].publishTimestamp=this.releases_time[i]
                }
                 this.releases_selected=this.releases[0];
                 this.selected_release=this.releases[0];
                this.loadnumbers();

            },
            (error) => {
                console.log('error => ',error);
                
            });
      
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationservice:AuthenticationService,
        private toasterservice:ToasterService,
        private cache: DataCacheService,
        private request:RequestService,
    
    ) {
        this.http = request;

    };
    
    ngOnInit() {
        // this.loadnumbers();
        this.fetchData();
        if(this.authenticationservice.isLoggedIn()){
            this.buttonText ='GO TO SERVICES' ;
        } else{
            this.buttonText = "GET STARTED NOW";
        }
         if(this.authenticationservice.isLoggedIn() && this.router.url == "/"){
            this.router.navigateByUrl('/services');
        }
        
        var scroll_flag = this.cache.get('scroll_flag');
        var scroll_id = this.cache.get('scroll_id');

        var x = this.cache.get('json');
        this.json = JSON.stringify(x);
       
        if(scroll_flag == true)
        {
            var top = document.getElementById(scroll_id).offsetTop ;                
            scrollTo(top,600);
        }
        setTimeout(function(){
            try{
                document.getElementById("head-text").className += " no-padding";
            } catch(e){
                console.log(e)
            }
            
        },700)

         this.run(4000, 4); 
    };
    sendmail(){
        window.open('mailto:serverless@t-mobile.com?body='+this.json);
    }

    public run(interval, frames) {
        var int = 2;
        
        function func() {
            var el = document.getElementsByClassName("parallax-2");
            if (el[0] !== undefined) {
                el[0].id = "bg"+int;
                int++;
                if(int === frames) { int = 1; }
            }
        }
        
        var swap = window.setInterval(func, interval);
    }
}

export function scrollTo(to, duration) {    
    var el = document.getElementsByTagName("main")[0];
    if (el.scrollTop == to) return;
    let direction = true;
    if(el.scrollTop > to)
        direction = false;

  let start = el.scrollTop;
  let diff = to - start;
  let scrollStep = Math.PI / (duration / 10);
  let count = 0, currPos = start;


  let scrollInterval = setInterval(function(){

    if (el.scrollTop !== to) {
      let prevVal = diff * (0.5 - 0.5 * Math.cos(count * scrollStep));
      count = count + 1;
      let val = diff * (0.5 - 0.5 * Math.cos(count * scrollStep));
      if((direction && (val - prevVal) < 0) || (!direction && (val - prevVal) > 0))
      {
        el.scrollTop = to;
        clearInterval(scrollInterval);
      }
      else {
        currPos = start + diff * (0.5 - 0.5 * Math.cos(count * scrollStep));
        el.scrollTop = currPos;
      }

    } else{
      clearInterval(scrollInterval);
    }
  },10);
};
