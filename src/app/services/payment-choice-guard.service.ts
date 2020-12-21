import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillDTO } from '../models/bill-dto'
import { OrderStatus } from '../models/order-status.enum';
import { BillService } from '../services/bill.service'

@Injectable({
  providedIn: 'root'
})
export class PaymentChoiceGuardService {

  constructor(private router: Router, private billService: BillService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    var billDTO: BillDTO = JSON.parse(localStorage.getItem("ongoingBill"));

    return this.billService.getBill(billDTO).pipe(
      map(data => {
        if(data.orderItems.some(orderItem => orderItem.orderStatus != OrderStatus.COMPLETED)){
          this.router.navigate(['/clientRequestList'])
          return false;
        }else return true;
      }));
  }
}
