import { Component, OnInit } from '@angular/core';
import { StripeSubscriptionProducts } from '../../models/stripe-subscription-products'
import { PaymentService } from '../../services/payment.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-subscription',
  templateUrl: './owner-subscription.component.html',
  styleUrls: ['./owner-subscription.component.css']
})
export class OwnerSubscriptionComponent implements OnInit {

  constructor(private paymentService: PaymentService, private router: Router) { }
  stripe; // : stripe.Stripe;
  card;
  cardErrors;
  clientSecret;
  isError: boolean;
  errorMsg: string;
  loading = false;
  isPaymentRetry = false;
  customerId: string;
  priceId: string;
  subscriptionProducts: [StripeSubscriptionProducts];
  loader: boolean;
  confirmation;
  style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };


  ngOnInit() {
    this.initPaymentRetry();
    this.hideComponent(document.getElementById("subscriptionContainer"));
    this.showComponent(document.getElementById("spinner"));
    this.fetchCustomerId();
    this.getSubscriptionProducts();
  }

  initPaymentRetry(){
    const latestInvoicePaymentIntentStatus = localStorage.getItem('latestInvoicePaymentIntentStatus');
    if (latestInvoicePaymentIntentStatus === 'requires_payment_method'){
      this.isPaymentRetry=true;
      this.priceId="valeurBidon";
    }
  }

  initStripe() {
    this.isError = false;
    /*this.paymentService.getPaymentIntent().subscribe(data => {
      this.clientSecret = data
    });*/


    this.stripe = Stripe('pk_test_51HLwKgC5UoZOX4GRWegBa5FvbtsNbi5Cd7Z5WKYB73jelPNuhpzS69dXKe2V3OWTP4XHt5wjGGD3dzEdJw25duSn00Dlctj1NV');
    const elements = this.stripe.elements();
    this.card = elements.create("card", { style: this.style });
    this.card.mount("#card-element");

  }
  fetchCustomerId() {
    this.paymentService.fetchOwnerCustomerId(localStorage.getItem("username")).subscribe(data => this.customerId = data.customerId);
  }
  getSubscriptionProducts() {
    this.paymentService.fetchSubscriptionProduct().subscribe(data => {
      this.hideComponent(document.getElementById("spinner"));
      this.showComponent(document.getElementById("subscriptionContainer"));
      this.subscriptionProducts = data;
      this.initStripe();
    });
  }
  showLoader(isShown: boolean) {
    this.loader = isShown;
  }
  hideContentContainer() {
    document.getElementById("subscriptionContainer").classList.add("d-none");
  }
  hideSpinner() {
    document.getElementById("spinner").classList.remove("d-none");
  }
  hideComponent(element) {
    element.classList.add("d-none")
  }
  showComponent(element) {
    element.classList.remove("d-none")
  }
  submitForm() {
    this.hideComponent(document.getElementById("subscriptionContainer"));
    this.showComponent(document.getElementById("spinner"));
    if (this.priceId == null) {
      this.hideComponent(document.getElementById("spinner"));
      this.showComponent(document.getElementById("subscriptionContainer"));
      if(!this.isPaymentRetry){
        var element = document.getElementById("subscriptionErrorTxt");
        element.classList.remove("d-none");
      }
    }
    else {
      var form = document.getElementById('subscription-form');

      if (this.isPaymentRetry) {
        // create new payment method & retry payment on invoice with new payment method
        this.createPaymentMethod(
          this.isPaymentRetry,
        );
      } else {
        // create new payment method & create subscription
        this.createPaymentMethod(false);
      }
    }
  }

  changeSubscriptionProduct(stripeSubscriptionProducts: StripeSubscriptionProducts, x: number) {
    var i;
    for (i = 0; i < document.getElementsByClassName("example-card").length; i++) {
      document.getElementsByClassName("example-card").item(i).classList.remove("border");
      document.getElementsByClassName("example-card").item(i).classList.remove("border-warning");
    }
    var div = document.getElementsByClassName("example-card").item(x);
    div.classList.add("border");
    div.classList.add("border-warning");

    this.priceId = stripeSubscriptionProducts.priceId;
  }
  createPaymentMethod(isPaymentRetry) {
    // Set up payment method for recurring usage
    let billingName = "I-SERVE ABONNEMENT";

    this.stripe
      .createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: billingName,
        },
      })
      .then((result) => {
        if (result.error) {
          //displayError(result);
        } else {
          if (isPaymentRetry) {
            // Update the payment method and retry invoice payment
            this.retryInvoiceWithNewPaymentMethod(
              this.customerId,
              result.paymentMethod.id,
            );
          } else {
            // Create the subscription
            this.paymentService
            this.paymentService.createPaymentSubscription(this.customerId, result.paymentMethod.id, this.priceId).subscribe(result => {

              this.showLoader(false);
              this.handleSubscriptionCreateRetryResponse(result);
              console.log(result)
            },
              error => {
                var element = document.getElementById("errorTxt");
                element.classList.remove("d-none");
                console.log(error);
              },
              () => {
                // 'onCompleted' callback.
                // No errors, route to new page here
              });
          }
        }
      });
  }
  retryInvoiceWithNewPaymentMethod(customerId, paymentMethodId) {
    this.paymentService.retryPaymentSubscription(customerId, paymentMethodId).subscribe(result => {
      this.handleSubscriptionCreateRetryResponse(result);
    })
  }
  handleError() {
    var element = document.getElementById("paymentErrorTxt");
    element.classList.remove("d-none");
  }
  handleSubscriptionCreateRetryResponse(result) {
    this.showLoader(false);
    if (result.status != "active") {
      this.hideComponent(document.getElementById("spinner"));
      this.showComponent(document.getElementById("subscriptionContainer"));
      this.handleError();
    }
    else {
      this.router.navigateByUrl("subscriptionDetail");
    }
  }
}
