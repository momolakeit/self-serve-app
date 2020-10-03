import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole ="ROLE_OWNER";

    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);
    
    if (!this.authService.isAuthenticated() || tokenPayload.role !== expectedRole) {
      this.router.navigate(['not-found']);
      return false;
    }
    
    return true;
  }
}
