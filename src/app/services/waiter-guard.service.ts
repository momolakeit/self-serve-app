import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import {roles} from '../../environments/environment';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class WaiterGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);
    
    if (!this.authService.isAuthenticated() || tokenPayload.role !== roles.waiter) {
      this.router.navigate(['not-found']);
      return false;
    }
    
    return true;
  }
}
