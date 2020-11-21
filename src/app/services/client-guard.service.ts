import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import {roles} from '../../environments/environment';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ClientGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated() || (this.authService.isClient() && this.authService.isGuest())) {
      this.router.navigate(['not-found']);
      return false;
    }
    
    return true;
  }
}
