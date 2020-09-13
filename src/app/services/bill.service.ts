import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {BillDTO} from '../models/bill-dto';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http:HttpClient) { }

  makeOrder(billDTO:BillDTO,restaurentTableId:number):Observable<BillDTO>{
    return this.http.post<BillDTO>(`${environment.billUrl}/order/makeOrder`,{billDTO:JSON.stringify(billDTO),restaurentTableId});
  }
}
