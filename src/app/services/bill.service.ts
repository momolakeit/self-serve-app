import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BillDTO} from '../models/bill-dto'
import { map, catchError } from 'rxjs/operators';
import { ProductDTO } from '../models/product-dto';
@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http:HttpClient) { }
  billDTO :BillDTO
  restaurantTableId : String
  postNewOrder(billDTO :BillDTO,restaurentTableId :String,product:ProductDTO,commentaire:String):Observable<BillDTO>{
     const returnValue  = this.http.post<BillDTO>(`${environment.billUrl}/makeOrder`,{billDTO: JSON.stringify(billDTO),restaurentTableId:restaurentTableId,productDTO:JSON.stringify(product),guestUsername:"client1@mail.com",commentaire:commentaire});
     return returnValue;
  }

  initBill(){
    return this.http.post<BillDTO>(`${environment.billUrl}/initBill`,{});
  }

  getBill(billDTO :BillDTO):Observable<BillDTO>{
    const returnValue  = this.http.post<BillDTO>(`${environment.billUrl}/getBill`,{billId: billDTO.id});
    return returnValue;
 }

  makeOrder(product :ProductDTO,commentaire :String) : Observable<BillDTO>{
    this.billDTO =JSON.parse(localStorage.getItem("ongoingBill"));
    this.restaurantTableId = localStorage.getItem("restaurantTableId");
    return this.postNewOrder(this.billDTO,this.restaurantTableId,product,commentaire).pipe(
      map(response => {
        return response;
      }));
  }

  

}
