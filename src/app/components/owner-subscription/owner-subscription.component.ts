import { Component, OnInit } from '@angular/core';
import { StripeSubscriptionProducts } from '../../models/stripe-subscription-products'
import { PaymentService } from '../../services/payment.service'
import { Router } from '@angular/router';
import { stripeKey } from 'src/environments/environment';

@Component({
  selector: 'app-owner-subscription',
  templateUrl: './owner-subscription.component.html',
  styleUrls: ['./owner-subscription.component.css']
})
export class OwnerSubscriptionComponent implements OnInit {
  stripe; // : stripe.Stripe;
  card;
  cardErrors;
  clientSecret;
  isError: boolean;
  errorMsg: string;
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

  constructor(private paymentService: PaymentService, private router: Router) { }

  ngOnInit() {
    this.initPaymentRetry();
    this.showLoader(true);
    this.fetchCustomerId();
    this.getSubscriptionProducts();
  }

  initPaymentRetry() {
    const latestInvoicePaymentIntentStatus = localStorage.getItem('latestInvoicePaymentIntentStatus');
    if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
      this.isPaymentRetry = true;
      this.priceId = "valeurBidon";
    }
  }

  initStripe() {
    this.isError = false;
    this.stripe = Stripe(stripeKey.value);
    const elements = this.stripe.elements();
    this.card = elements.create("card", { style: this.style });
    this.card.mount("#card-element");
  }

  fetchCustomerId() {
    this.paymentService.fetchOwnerCustomerId(localStorage.getItem("username")).subscribe(data => this.customerId = data.customerId);
  }

  getSubscriptionProducts() {
    this.paymentService.fetchSubscriptionProduct().subscribe(data => {
      this.showLoader(false);
      this.subscriptionProducts = data;
      this.initStripe();
    });
  }

  findSubscriptionProductDescription(product: StripeSubscriptionProducts): string[] {
    return product.productDescription.split(",");
  }

  showLoader(isShown: boolean) {
    this.loader = isShown;
  }

  submitForm() {
    this.showLoader(true);
    if (this.priceId == null && !this.isPaymentRetry) {
      this.showLoader(false);
      var element = document.getElementById("subscriptionErrorTxt");
      element.classList.remove("d-none");
    }
    else {
      var form = document.getElementById('subscription-form');
      if (this.isPaymentRetry) {
        // create new payment method & retry payment on invoice with new payment method
        this.createPaymentMethod(this.isPaymentRetry);
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
          this.showLoader(false);
          this.handleError(result.error.message);
        } else {
          if (isPaymentRetry) {
            // Update the payment method and retry invoice payment
            this.retryInvoiceWithNewPaymentMethod(
              this.customerId,
              result.paymentMethod.id,
            );
          } else {
            // Create the subscription
            this.paymentService.createPaymentSubscription(this.customerId, result.paymentMethod.id, this.priceId).subscribe(result => {

              this.showLoader(false);
              this.handleSubscriptionCreateRetryResponse(result);
            },
              error => {
                this.showLoader(false);
                this.handleError("There was an error during your payment,please try again later");
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

  handleError(errorTxtValue: string) {
    var element = document.getElementById("paymentErrorTxt");
    element.classList.remove("d-none");
    element.innerText = errorTxtValue;
  }

  handleSubscriptionCreateRetryResponse(result) {
    this.showLoader(false);
    if (result.status != "active") {
      this.showLoader(false);
      this.handleError("There was an error during your payment,please try again later");
    }
    else 
      this.router.navigateByUrl("subscriptionDetail");
    
  }
}
