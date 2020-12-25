import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillDTO } from '../models/bill-dto'
import { BillStatus } from '../models/bill-status.enum';
import { OrderStatus } from '../models/order-status.enum';
import { BillService } from '../services/bill.service'

@Injectable({
  providedIn: 'root'
})
export class RequestTerminalGuardService {

  constructor(private router: Router, private billService: BillService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    var billDTO: BillDTO = JSON.parse(localStorage.getItem("ongoingBill"));

    if (billDTO) {
      this.billService.getBill(billDTO).subscribe(data => {
        console.log(data)
        if (data.billStatus == BillStatus.TERMINALREQUESTWATING) {
          console.log('yeee')
          this.router.navigate(['/paymentChoice'])
          return false;
        } else return true;
      });
    }
    return true;
  }
}
