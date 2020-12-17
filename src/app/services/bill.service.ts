import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BillDTO } from '../models/bill-dto'
import { map, catchError } from 'rxjs/operators';
import { ProductDTO } from '../models/product-dto';
import { BillStatus } from '../models/bill-status.enum';
import { error } from '@angular/compiler/src/util';
@Injectable({
  providedIn: 'root'
})
export class BillService {
  billDTO: BillDTO;
  restaurantTableId: String;

  constructor(private http: HttpClient) { }

  postNewOrder(billDTO: BillDTO, restaurentTableId: String, product: ProductDTO, commentaire: String): Observable<BillDTO> {
    return this.http.post<BillDTO>(`${environment.billUrl}/makeOrder`, { billDTO: JSON.stringify(billDTO), restaurentTableId: restaurentTableId, productDTO: JSON.stringify(product), guestUsername: localStorage.getItem("username"), commentaire: commentaire });
  }

  initBill() {
    return this.http.post<BillDTO>(`${environment.billUrl}/initBill`, {});
  }

  getBillStatus(billId: number): Observable<BillStatus> {
    return this.http.get<BillStatus>(`${environment.billUrl}/billStatus/${billId}`);
  }

  isBillExisting(): boolean {
    return JSON.parse(localStorage.getItem('ongoingBill'));
  }

  hasUserPaid(): Observable<boolean> {
    const billDTO: BillDTO = JSON.parse(localStorage.getItem('ongoingBill'));

    return this.getBillStatus(billDTO.id).pipe(
      map(data => data == BillStatus.PAYED, catchError => false));
  }

  getBill(billDTO: BillDTO): Observable<BillDTO> {
    return this.http.post<BillDTO>(`${environment.billUrl}/getBill`, { billId: billDTO.id });
  }

  makeOrder(product: ProductDTO, commentaire: String): Observable<BillDTO> {
    this.billDTO = JSON.parse(localStorage.getItem("ongoingBill"));
    this.restaurantTableId = localStorage.getItem("restaurantTableId");

    return this.postNewOrder(this.billDTO, this.restaurantTableId, product, commentaire).pipe(
      map(response => {
        return response;
      }));
  }

  makePayment(billId: number) {
    return this.http.post(`${environment.billUrl}/makePayment`, { billId: billId });
  }

}
