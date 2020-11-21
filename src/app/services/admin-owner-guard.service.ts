import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import decode from 'jwt-decode';
import { roles } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AdminOwnerGuardService {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated() || (!this.authService.isAdmin() && !this.authService.isOwner())) {
      this.router.navigate(['not-found']);
      return false;
    }
    
    return true;
  }
}
