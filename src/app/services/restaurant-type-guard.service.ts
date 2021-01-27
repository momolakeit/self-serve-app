import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {RestaurantType} from '..services/RestaurantType';

@Injectable({
  providedIn: 'root'
})
export class RestaurantTypeGuardService {

  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(localStorage.getItem("restaurantTableId")!=RestaurantType.DINEIN.toString())
    {
      this.router.navigate(['/paymentChoice']);
      return false;
    }
    return true;
  }
}
