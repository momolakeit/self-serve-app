import { Component, OnInit } from '@angular/core';
import {PaymentService} from '../../services/payment.service'
import {AuthentificationService} from '../../services/authentification.service';

@Component({
  selector: 'app-payment-choice',
  templateUrl: './payment-choice.component.html',
  styleUrls: ['./payment-choice.component.css']
})
export class PaymentChoiceComponent implements OnInit {

  constructor(private paymentService :PaymentService,private authentificationService :AuthentificationService) { }
  card;
  stripe; // : stripe.Stripe;
  clientSecret;

  ngOnInit(): void {
    this.paymentService.fetchAccountId(parseInt(localStorage.getItem("menuId"))).subscribe(data =>{
      this.initStripe(data.value);
    })
  }
  initStripe(stripeAccountId:string){
    this.stripe = Stripe('pk_test_51HLwKgC5UoZOX4GRWegBa5FvbtsNbi5Cd7Z5WKYB73jelPNuhpzS69dXKe2V3OWTP4XHt5wjGGD3dzEdJw25duSn00Dlctj1NV');
    this.paymentService.getPaymentRequestPaymentIntent(stripeAccountId).subscribe(data => {
      console.log(data  );
      this.clientSecret = data
    });
    const elements = this.stripe.elements();
    this.card = elements.create("card");
    var paymentRequest = this.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1099,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    this.card.mount(".card-element-apple-pay");
    var prButton = elements.create('paymentRequestButton', {
      paymentRequest: paymentRequest,
    });

    // Check the availability of the Payment Request API first.
    paymentRequest.canMakePayment().then(function (result) {
      if (result) {
        prButton.mount('#card-element-apple-pay');
      } else {
        document.getElementById('card-element-apple-pay').style.display = 'none';
      }
    });
    paymentRequest.on('paymentmethod', function(ev) {
      // Confirm the PaymentIntent without handling potential next actions (yet).
      this.stripe.confirmCardPayment(
        this.clientSecret,
        {payment_method: ev.paymentMethod.id},
        {handleActions: false}
      ).then(function(confirmResult) {
        if (confirmResult.error) {
          // Report to the browser that the payment failed, prompting it to
          // re-show the payment interface, or show an error message and close
          // the payment interface.
          ev.complete('fail');
        } else {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          ev.complete('success');
          // Check if the PaymentIntent requires any actions and if so let Stripe.js
          // handle the flow. If using an API version older than "2019-02-11" instead
          // instead check for: `paymentIntent.status === "requires_source_action"`.
          if (confirmResult.paymentIntent.status === "requires_action") {
            // Let Stripe.js handle the rest of the payment flow.
            this.stripe.confirmCardPayment(this.clientSecret).then(function(result) {
              if (result.error) {
                // The payment failed -- ask your customer for a new payment method.
              } else {
                // The payment has succeeded.
              }
            });
          } else {
            // The payment has succeeded.
          }
        }
      });
    });
  }

}
