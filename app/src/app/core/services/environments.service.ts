import { 
    Injectable 
 } from '@angular/core';  
 import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
 import { RequestService, DataCacheService } from '../../core/services/index';
 import { ReplaySubject } from 'rxjs';

 @Injectable()
 export class environmentDataService {  
    private http:any;
    public environments:ReplaySubject<any> = new ReplaySubject(1);
    public environment:ReplaySubject<any> = new ReplaySubject(1);

    constructor(
        private request: RequestService,
        private cache: DataCacheService
    ) {
        this.http = request;
    }

    clearEnvironmentCache(serviceDomain, serviceName, environment) {
        this.cache.clear(serviceDomain + '/' + serviceName + '/' + environment);
    }

    clearEnvironmentsCache(serviceDomain, serviceName) {
        this.cache.clear(serviceDomain + '/' + serviceName);
    }

    getEnvironments(serviceDomain, serviceName) { 
        // get env list from cache
        var envs = this.cache.get(serviceDomain + '/' + serviceName);
        if (envs && envs.enviroment.length > 0){return envs};
        // if env list is not in cache, fetch from server
        this.http.get('/jazz/environments?domain='+ serviceDomain +'&service=' + serviceName).subscribe(
            response => {
                this.environments.next(response)
                // store env list in cache
                this.cache.set(serviceDomain + '/' + serviceName, response);
                return this.environments;                  
              },
              err => {
                //this.environments.next(response)
                console.log(err)
                // return err
            }
        )
    } 

    getEnvironment(serviceDomain, serviceName, environment) {
        // get env from cache
        var env = this.cache.get(serviceDomain + '/' + serviceName + '/' + environment);
        if (env){
            return env;
        }
        // if env is not in cache, fetch from server
        this.http.get('/jazz/environments/'+ environment +'?domain=' + serviceDomain + '&service=' + serviceName).subscribe(
            response => {
                // store env list in cache
                this.environment.next(response);
                this.cache.set(serviceDomain + '/' + serviceName + '/' + environment, response);
                return this.environment;                  
              },
              err => {
                console.log(err);
                // return err
            }
        )
    }
 } 