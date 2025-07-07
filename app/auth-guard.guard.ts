import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: ServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggin(); // Check if user is authenticated
    const userType = localStorage.getItem('userType'); // 'child' or 'parent'
    const requestedRoute = route.routeConfig?.path; // e.g., 'home', 'video/:id', etc.
    console.log(requestedRoute);

    if (!isLoggedIn) {
      this.router.navigate(['']); // Redirect to login
      return false;
    }

    // Define allowed routes for each user type
    const childRoutes = ['child','video/:id', 'graph'];
    const parentRoutes = ['home', 'form'];

    if (userType === 'child' && !childRoutes.includes(requestedRoute || '')) {
      this.router.navigate(['child']);
      return false;
    }

    if (userType === 'parent' && !parentRoutes.includes(requestedRoute || '')) {
      this.router.navigate(['home']);
      return false;
    }

    return true; // Allow access
  }
}
