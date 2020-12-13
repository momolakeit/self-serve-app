import { Component, OnInit } from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {StripeSubscriptionProducts} from '../../models/stripe-subscription-products';
import {SubscriptionEntityDTO} from '../../models/subscription-entity-dto'
import {Router} from '@angular/router'
@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.css']
})
export class SubscriptionDetailsComponent implements OnInit {

  constructor(private paymentService:PaymentService,private router:Router) { }
  loading : boolean;
  isLatestInvoicePaid = true;
  ngOnInit(): void {
    this.fetchSubscription();
  }
  subscriptionEntity : SubscriptionEntityDTO;
  fetchSubscription(){
    this.paymentService.fetchSubscription(localStorage.getItem("username")).subscribe(data =>{
      this.subscriptionEntity = data;
      localStorage.setItem('latestInvoicePaymentIntentStatus',this.subscriptionEntity.latestInvoiceStatus);
      if(this.subscriptionEntity.latestInvoiceStatus =="requires_payment_method"){
          this.router.navigate(['/subscription'])
      }
    })
  }
  cancelSubscription(){
    this.loading = true;
    this.paymentService.cancelSubscription(localStorage.getItem("username")).subscribe(data =>{
      this.subscriptionEntity = data;
      this.loading = false;
    })
  }
  setUpDates(time:number){
    var date = new Date(time*1000);
    var month =date.getMonth()+1;
    var day =date.getDay()+1;
    var year = date.getFullYear();
    var returnString =  month +"-"+day+"-"+year;
    return returnString;
  }
}
