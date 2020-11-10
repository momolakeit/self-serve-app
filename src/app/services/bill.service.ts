import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BillDTO } from '../models/bill-dto'
import { map, catchError } from 'rxjs/operators';
import { ProductDTO } from '../models/product-dto';
@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient) { }
  billDTO: BillDTO

  postNewOrder(billDTO: BillDTO, restaurentTableId: String, product: ProductDTO, commentaire: String): Observable<BillDTO> {
    return this.http.post<BillDTO>(`${environment.billUrl}/makeOrder`, { billDTO: JSON.stringify(billDTO), restaurentTableId: restaurentTableId, productDTO: JSON.stringify(product), guestUsername: localStorage.getItem("username"), commentaire: commentaire });
  }

  getBill(billDTO: BillDTO): Observable<BillDTO> {
    return this.http.post<BillDTO>(`${environment.billUrl}/getBill`, { billId: billDTO.id });
  }

  makeOrder(product: ProductDTO, commentaire: String): Observable<BillDTO> {

    this.billDTO = JSON.parse(localStorage.getItem("ongoingBill"));

    console.log('my bill');
    console.log(this.billDTO);
    
    return this.postNewOrder(this.billDTO, "1", product, commentaire).pipe(
      map(response => {
        return response;
      }));
  }

}
