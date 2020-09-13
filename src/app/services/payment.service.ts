import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BillDTO} from '../models/bill-dto'
import { map, catchError } from 'rxjs/operators';
import { StripeClientIdResponse} from '../models/stripe-client-id-response'

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient,private router:Router) { }
  fetchPaymentIntent(billDTO :BillDTO,restaurentStripeAccount :String):Observable<StripeClientIdResponse>{
    return this.http.post<StripeClientIdResponse>(`${environment.paymentIntentUrl}`,{billDTO: JSON.stringify(billDTO),restaurentStripeAccount:restaurentStripeAccount});
  }

  getPaymentIntent() : Observable<String>{
    const restaurentStripeAccount="acct_1HQe4hAEW5t84Hq2";
    const billDTO : BillDTO ={prixTotal :50,id :0 ,date :null,billStatus: null,orderCustomer:null,orderItems :null, restaurant :null}
    return this.fetchPaymentIntent(billDTO,restaurentStripeAccount).pipe(
      map(response => {
        console.log(response.value)
        return response.value;
      }));
  }
  
}
