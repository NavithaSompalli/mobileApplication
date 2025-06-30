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
    const knownRoutes = ['home', 'form', 'child', 'video'];
    const isValid = knownRoutes.includes(route.routeConfig?.path || '');
    if (isValid) {
      if (this.authService.loggin()) {
        return true;
      } else {
        this.router.navigate(['']); // or your login route
        return false;
      }
    } else {
      if (this.authService.loggin() && !isValid) {
        this.router.navigate['home']
        return true
      } else {
        this.router.navigate(['']);
        return false
      }
    }
  }
}
