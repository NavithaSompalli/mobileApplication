import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ServiceService } from './service.service';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: ServiceService, private router: Router) { }

 canActivate(route: ActivatedRouteSnapshot): boolean {
  const isLoggedIn = this.authService.loggin();
  const userType = localStorage.getItem('userType');
  const requestedRoute = route.routeConfig?.path;
  if (!isLoggedIn) {
    this.router.navigate(['']);
    return false;
  }

  // If the user is a child, block access to "home" and "form"
  if (isLoggedIn && userType === 'child' && (requestedRoute === 'home' || requestedRoute === 'form')) {
    this.router.navigate(['child']); // redirect child user to their allowed route
    return false;
  }

  if (isLoggedIn && userType === 'parent' && (requestedRoute === 'video' || requestedRoute === 'child')) {
    this.router.navigate(['home']); // redirect child user to their allowed route
    return false;
  }

  // Allow all other valid routes
  return true;
}

}
