import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { ToasterService} from 'angular2-toaster';



@Injectable()
export class RouteGuard implements CanActivate {

  constructor(
  	private authService: AuthenticationService, 
    private router: Router,
  	private toasterService: ToasterService) {
    
    	// this.toasterService = toasterService;

  }

  canActivate() {
		let allow = this.authService.isLoggedIn();
  	if (allow === false) {
			let currentUrl = this.router.url;
  		// if (currentUrl !== '/landing') {
  			alert("Please Login to continue");
  		// }
      this.router.navigate(['']);
      // this.toasterService.pop('error', 'Unauthorised', 'Please login to continue');
  	}
    return allow;
  }
}