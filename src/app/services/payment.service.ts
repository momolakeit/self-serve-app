import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BillDTO} from '../models/bill-dto'
import { map, catchError } from 'rxjs/operators';
import { StripeClientIdResponse} from '../models/stripe-client-id-response'
import { StripeSubscriptionProducts} from '../models/stripe-subscription-products'
import {CreateSubscriptionRequestDTO} from '../models/create-subscription-request-dto'
import {StripeSessionCustomerIdDTO} from '../models/stripe-session-customer-id-dto'
import {SubscriptionEntityDTO} from '../models/subscription-entity-dto'
import {StripeAccountIdDTO} from '../models/stripe-account-id-dto';
import {StripeCreateAccountUrlDTO} from '../models/stripe-create-account-url-dto'

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http:HttpClient,private router:Router) { }
  fetchPaymentIntent(billDTO :BillDTO,restaurentStripeAccount :String):Observable<StripeClientIdResponse>{
    return this.http.post<StripeClientIdResponse>(`${environment.paymentIntentUrl}`,{billDTO: JSON.stringify(billDTO),restaurentStripeAccount:restaurentStripeAccount});
  }
  /*on va chercher le owner du resto et son stripe account id */
  fetchAccountId(restaurantId:number):Observable<StripeAccountIdDTO>{
    return this.http.post<StripeAccountIdDTO>(`${environment.fetchStripeAccountId}`,{restaurantId:restaurantId});
  }

  createStripeAccount(username :string):Observable<StripeCreateAccountUrlDTO>{
    return this.http.post<StripeCreateAccountUrlDTO>(`${environment.registerOwnerWithStripeUrl}`,{username:username});
  }
  saveStripeAccount(accountId:string,username :string):Observable<StripeCreateAccountUrlDTO>{
    return this.http.post<StripeCreateAccountUrlDTO>(`${environment.saveStripeAccountId}`,{accountId:accountId,username:username});
  }

  retryPaymentSubscription(customerId:string,paymentMethodId:string):Observable<SubscriptionEntityDTO>{
    return this.http.post<SubscriptionEntityDTO>(`${environment.retrySubscriptionUrl}`,{customerId:customerId,paymentMethodId:paymentMethodId});
  }

  createPaymentSubscription(customerId:string,paymentMethodId:string,priceId:string):Observable<SubscriptionEntityDTO>{
    return this.http.post<SubscriptionEntityDTO>(`${environment.createSubscriptionUrl}`,{customerId:customerId,paymentMethodId:paymentMethodId,priceId:priceId});
  }
  cancelSubscription(ownerEmail:string):Observable<SubscriptionEntityDTO>{
    return this.http.post<SubscriptionEntityDTO>(`${environment.cancelSubscriptionUrl}`,{ownerEmail:ownerEmail});
  }
  fetchOwnerCustomerId(ownerEmail:string):Observable<StripeSessionCustomerIdDTO>{
    return this.http.post<StripeSessionCustomerIdDTO>(`${environment.fetchSubscriptionSessionUrl}`,{ownerEmail:ownerEmail});
  }

  fetchSubscriptionProduct():Observable<[StripeSubscriptionProducts]>{
    return this.http.get<[StripeSubscriptionProducts]>(`${environment.subscriptionProductUrl}`);
  }
  
  fetchSubscription(ownerEmail:string):Observable<SubscriptionEntityDTO>{
    return this.http.post<SubscriptionEntityDTO>(`${environment.fetchSubscription}`,{ownerEmail:ownerEmail});
  }

  fetchPaymentRequestPaymentIntent(billDTO :BillDTO,restaurentStripeAccount :String) : Observable<StripeClientIdResponse>{
     return this.http.post<StripeClientIdResponse>(`${environment.paymentRequestIntentUrl}`,{billDTO: JSON.stringify(billDTO),restaurentStripeAccount:restaurentStripeAccount});
  }
  getDomainFile():Observable<Blob>{
    return this.http.get<Blob>(`${environment.domainFiLE}`)
  }
  getPaymentIntent(restaurentStripeAccount:string) : Observable<String>{
    //const restaurentStripeAccount="acct_1HQe4hAEW5t84Hq2";
    localStorage.getItem("ongoingBill");
    console.log(JSON.parse(localStorage.getItem("ongoingBill")));
    return this.fetchPaymentIntent(JSON.parse(localStorage.getItem("ongoingBill")),restaurentStripeAccount).pipe(
      map(response => {
        console.log(response.value)
        return response.value;
      }));
  }

  getPaymentRequestPaymentIntent(restaurentStripeAccount:string,billDTO:BillDTO) : Observable<String>{
    //const restaurentStripeAccount="acct_1HQe4hAEW5t84Hq2";
    localStorage.getItem("ongoingBill");
    return this.fetchPaymentRequestPaymentIntent(billDTO,restaurentStripeAccount).pipe(
      map(response => {
        console.log(response.value)
        return response.value;
      }));
  }

  getSubscriptionProduct() : Observable<[StripeSubscriptionProducts]>{
    return this.fetchSubscriptionProduct().pipe(
      map(response => {
        return response;
      }));
  }


}
