import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BillDTO} from '../models/bill-dto'
@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http:HttpClient) { }

  fetchPaymentIntent(billDTO :BillDTO,restaurentTableId :String):Observable<BillDTO>{
    return this.http.post<BillDTO>(`${environment.paymentIntentUrl}`,{billDTO: JSON.stringify(billDTO),restaurentTableId:restaurentTableId});
  }


}
