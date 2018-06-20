/**
 * @type Service
 * @desc Request Service - wrapper around angular2's Http service
 * @author Sunil Fernandes
 */

import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from '../../core/services/authentication.service';
import 'rxjs/add/operator/map';
import {ConfigService} from '../../app.config';
import {Router} from '@angular/router';
import {ServiceCostComponent} from '../../pages/service-cost/service-cost.component';
import {environment} from '../../../environments/environment';

@Injectable()
export class RequestService {
  public token: string;
  public baseurl: string;
  private _config: any;

  constructor(private http: Http, private authenticationService: AuthenticationService, private config: ConfigService, private router: Router) {
    // set token if saved in local storage
    let currentUser;
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.baseurl = localStorage.getItem('overridehost') ? localStorage.getItem('overridehost') : environment.baseurl;
    // console.log("baseurl = ", this.baseurl);
  }

  constructUrl(url: string): string {
    var urlPattern = /^https?:\/\//i;

    if (urlPattern.test(url)) {

      // if url provided is an absolute url, use it as is
      return url;
    } else {

      // if url is a relative url append basepath
      if (!url.startsWith('/')) {
        url = url + '/'
      }
      return this.baseurl + url;
    }
  }

  queryString(params) {
    return '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
  }

  get(url: string, params?): Observable<any> {
    url = this.constructUrl(url);
    this.token = this.authenticationService.getToken();

    let options = new RequestOptions({
      headers: new Headers({
        'Authorization': this.token,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      }),
      search: null
    });

    url = params ? (url + this.queryString(params)) : url;
    return this.http.get(url, options)
      .map((response: Response) => {
        let responseBody;
        responseBody = response.json();
        if (responseBody !== undefined) {
          // return responseBody to indicate successfull GET request

          return responseBody;
        } else {
          let err = {result: 'error', message: 'Unexpected error.'};

          // return error to indicate failed request
          return (responseBody.error || err);
        }
      })
      .catch((error: any) => {
        return this.handleError(error, this.router);
      })
  }

  post(url: string, body: any): Observable<any> {
    // Make a POST request to url

    // Construct url
    url = this.constructUrl(url);

    // Get Authentication token
    this.token = this.authenticationService.getToken();

    // Add Authentication token to headers
    let headerObj = {
      'Authorization': this.token,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    };
    let headers = new Headers(headerObj);
    let options = new RequestOptions({headers: headers});
    let router = this.router;

    return this.http.post(url, JSON.stringify(body), options)
      .map((response: Response) => {
        let responseBody;
        responseBody = response.json();
        if (responseBody) {

          return responseBody;
        } else {
          // return error responseBody
          return responseBody;
        }
      })
      // .catch(this.handleError)
      .catch((error: any) => {
        return this.handleError(error, router);
      })
    // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));;
  }

  put(url: string, body: any): Observable<any> {
    // Make a PUT request to url

    // Construct url
    url = this.constructUrl(url);

    // Get Authentication token
    this.token = this.authenticationService.getToken();

    // Add Authentication token to headers
    let headerObj = {
      'Authorization': this.token,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    };
    let headers = new Headers(headerObj);
    let options = new RequestOptions({headers: headers});
    let router = this.router;
    // console.log('opitons:', options);

    return this.http.put(url, JSON.stringify(body), options)
      .map((response: Response) => {
        // console.log('put response:', response);
        let responseBody;
        responseBody = response.json();
        if (responseBody) {

          return responseBody;
        } else {
          // return error responseBody
          return responseBody;
        }
      })
      .catch((error: any) => {
        // console.log('put error:', error);
        return this.handleError(error, router);
      })

  }

  private handleError(error: any, router: any) {
    console.log(error);
    if (error.status === 401 || error.status === 403) {
      if (router) {
        router.navigateByUrl('');//route to landing page
        this.authenticationService.logout();
      }
    }

    return Observable.throw(error);
  }
}

