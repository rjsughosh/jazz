import {Component, OnInit, ViewChild} from '@angular/core';
import {RequestService, DataCacheService, MessageService, AuthenticationService} from '../../core/services/index';
import {ToasterService} from 'angular2-toaster';
import {Router, ActivatedRoute} from '@angular/router';
import {EnvOverviewSectionComponent} from './../environment-overview/env-overview-section.component';
import {DataService} from "../data-service/data.service";
import { environmentDataService } from '../../core/services/environments.service';  
import {environment} from './../../../environments/environment';
//import {environment as env_internal} from './../../../environments/environment.internal';
import {environment as env_oss} from './../../../environments/environment.oss';
import {EnvDeploymentsSectionComponent} from './../environment-deployment/env-deployments-section.component';


@Component({
  selector: 'environment-detail',
  templateUrl: './environment-detail.component.html',
  providers: [RequestService, MessageService, DataService, environmentDataService],
  styleUrls: ['./environment-detail.component.scss']
})
export class EnvironmentDetailComponent implements OnInit {
  @ViewChild('envoverview') envoverview: EnvOverviewSectionComponent;
  @ViewChild('envdeployments') envdeployments: EnvDeploymentsSectionComponent;
  @ViewChild('selectedTabComponent') selectedTabComponent;

  isFunction: boolean = false;
  breadcrumbs = [];
  api_doc_name: string = '';
  selectedTab = 0;
  service: any = {};
  friendly_name: any;
  status_val: number;
  serviceId: any;
  envStatus: string;
  environment_obj: any;
  isLoadingService: boolean = true;
  status_inactive: boolean = false;
  swagger_error: boolean = false;

  tabData = ['overview', 'deployments', 'code quality', 'assets', 'logs', 'clearwater'];
  envSelected: string = '';
  endpoint_env: string = '';
  environment = {
    name: 'Dev'
  }
  baseUrl: string = '';
  swaggerUrl: string = '';
  errAssets:boolean = false;
  disablingWebsiteButton: boolean = true;
  disablingFunctionButton: boolean = false;
  disablingApiButton: boolean = true;
  nonClickable: boolean = false;
  message: string;
  public assets:any;
  public sidebar: string = '';
  private sub: any;
  private subscription: any;
  isENVavailable:boolean = false;

  constructor(
    private toasterService: ToasterService,
    private messageservice: MessageService,
    private route: ActivatedRoute,
    private http: RequestService,
    private cache: DataCacheService,
    private router: Router,
    private data: DataService,
    private environmentDataService: environmentDataService
  ) {}

  refreshTab() {
    this.selectedTabComponent.refresh();
  }

  onSelectedDr(selected) {
    this.selectedTab = selected;
  }

  EnvLoad(event) {
    this.environment_obj = event.environment[0];
    this.isENVavailable = true;
    this.status_val = parseInt(status[this.environment_obj.status]);
    if ((this.status_val < 2) || (this.status_val == 4)) {
      this.disablingApiButton = (false && this.errAssets);
    }

    this.status_inactive = true;
  }

  env(event) {
    this.endpoint_env = event;
    if (this.endpoint_env != undefined) {
    }
  }

  frndload(event) {
    this.friendly_name = event;
    if (!this.friendly_name){
      var env = this.environment_obj;
      if (env.logical_id.toLowerCase() == "prod" || env.logical_id.toLowerCase() == "stg"){
        this.friendly_name = env.logical_id;
      } else {
        this.friendly_name = env.physical_id || env.logical_id;
      }
    }
    
    this.breadcrumbs = [{
      'name': this.service['name'],
      'link': 'services/' + this.service['id']
    },
      {
        'name': this.friendly_name,
        'link': ''
      }];
  }

  processService(service) {
    if (service === undefined) {
      return {};
    } else {
      let _service = {
        id: service.id,
        name: service.service,
        serviceType: service.type,
        runtime: service.runtime,
        status: service.status,
        domain: service.domain,
        repository: service.repository,
        created_by: service.created_by
      };
      if (service.deployment_targets && service.deployment_targets[service.type]){
        _service["deployment_targets"] = service.deployment_targets[service.type];
      }
      return _service;     
    }
  };

  onDataFetched(service) {
    if (service !== undefined && service !== "") {
      this.service = this.processService(service);
      if (this.service.serviceType == "function") this.isFunction = true;
      if (this.friendly_name != undefined) {
      }
      this.breadcrumbs = [{
        'name': this.service['name'],
        'link': 'services/' + this.service['id']
      },
        {
          'name': this.friendly_name,
          'link': ''
        }]
      this.isLoadingService = false;
    } else {
      this.isLoadingService = false;
      let errorMessage = this.messageservice.successMessage(service, "serviceDetail");
      this.toast_pop('error', 'Error', errorMessage)
    }
  }

  tabChanged(i) {
    this.selectedTab = i;
  };

  getEnvironment(res){
    if (res.data && res.data.environment && res.data.environment[0]){
      var env = res.data.environment[0];
      this.environment_obj = env;
      if (env.logical_id.toLowerCase() == "prod" || env.logical_id.toLowerCase() == "stg"){
        this.friendly_name = env.logical_id;
      } else {
        this.friendly_name = env.physical_id || env.logical_id;
      }
    }   
  }

  fetchService(id: string) {
    this.isLoadingService = true;
    this.subscription = this.http.get('/jazz/services/' + id).subscribe(
      response => {
        this.service = response.data.data;
        if (environment.envName == 'oss') this.service = response.data;
        this.isFunction = this.service.type === "function";
        this.setTabs();
        // if(this.service.serviceType === 'api' || this.service.type === 'api' && this.selectedTab == 6)
          this.getAssets();

        this.cache.set(id, this.service);
        this.onDataFetched(this.service);
        this.envoverview.notify(this.service);
        this.environmentDataService.getEnvironment(this.service.domain, this.service.name, this.envSelected);
      },
      err => {
        this.isLoadingService = false;
        let errorMessage = this.messageservice.errorMessage(err, "serviceDetail");
        this.toast_pop('error', 'Oops!', errorMessage);

      }
    )
  };

  setTabs() {
    if (this.service.serviceType === 'api' || this.service.type === 'api') {
      this.tabData = ['overview', 'deployments', 'assets', 'metrics', 'code quality', 'logs', 'clearwater'];
    } else if (this.service.serviceType === 'function' || this.service.type === 'function') {
      this.tabData = ['overview', 'deployments', 'assets', 'metrics', 'code quality', 'logs'];
    } else if (this.service.serviceType === 'website' || this.service.type === 'website') {
      this.tabData = ['overview', 'deployments', 'assets', 'metrics'];
    }
  }

  getAssets() {
    this.http.get('/jazz/assets', {
      service: this.service.service || this.service.name,
      domain: this.service.domain,
      environment: this.envSelected,
      limit:undefined
    }).subscribe((assetsResponse) => {
      this.assets = assetsResponse.data.assets;
      this.service.assets = this.assets;
      this.disablingApiButton = false;
      if(this.assets.count == 0){
        this.disablingApiButton = true;
        this.errAssets = true;
      }
    }, (err) => {
      this.toast_pop('error', 'Oops!', 'Failed to load Assets');
      this.disablingApiButton = true;
      this.errAssets = true;
    });
  }

  testService(type) {
    switch (type) {
      case 'api':
        let swaggerAsset = this.assets.find((asset) => {
          return asset.type === 'swagger_url';
        });
        if (swaggerAsset) {
          return window.open(environment.urls['swagger_editor'] + swaggerAsset.provider_id);
        } else {
          return window.open('/404');
        }
      case 'website' :
        if(this.endpoint_env != (undefined || '')) {
          window.open(this.endpoint_env);
        }
        break;
      case 'function' :
      case 'lambda' :
        this.setSidebar('try-service');
        break;
    }
  }

  setSidebar(sidebar) {
    this.sidebar = sidebar;
  }

  toast_pop(error, oops, errorMessage) {
    var tst = document.getElementById('toast-container');
    tst.classList.add('toaster-anim');
    this.toasterService.pop(error, oops, errorMessage);
    setTimeout(() => {
      tst.classList.remove('toaster-anim');
    }, 3000);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.serviceId = id;
      this.envSelected = params['env'];
      this.fetchService(id);
      this.environmentDataService.environment.subscribe((res) => {this.getEnvironment(res)});
    });
    this.breadcrumbs = [
      {
        'name': this.service['name'],
        'link': 'services/' + this.service['id']
      },
      {
        'name': this.friendly_name,
        'link': ''
      }
    ];
  }

  ngOnChanges(x: any) {
    this.fetchService(this.serviceId);
  }
}

export enum status {
  "deployment_completed" = 0,
  "active",
  "deployment_started",
  "pending_approval",
  "deployment_failed",
  "inactive",
  "deletion_started",
  "deletion_failed",
  "archived"
}
