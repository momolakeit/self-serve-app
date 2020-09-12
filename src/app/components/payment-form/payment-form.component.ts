import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { PaymentService } from '../../services/payment.service';
@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {

  constructor(private http: HttpClient, private paymentService: PaymentService) { }

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;

  stripe; // : stripe.Stripe;
  card;
  cardErrors;
  clientSecret;

  loading = false;
  confirmation;


  ngOnInit() {

    this.paymentService.getPaymentIntent().subscribe(data => {
      this.clientSecret = data
      console.log(this.clientSecret);
    });
    this.stripe = Stripe('pk_test_51HLwKgC5UoZOX4GRWegBa5FvbtsNbi5Cd7Z5WKYB73jelPNuhpzS69dXKe2V3OWTP4XHt5wjGGD3dzEdJw25duSn00Dlctj1NV');
    const elements = this.stripe.elements();
    this.card = elements.create("card");
    this.card.mount(".card-element");
  }
 
  showSpinner = function (doShow: boolean): void {
    if (doShow) {
      // Disable the button and show a spinner
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  };

  showError = function (): void {
    this.showSpinner(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = "Votre payment a echouer , veuillez reesayer";
    setTimeout(function () {
      errorMsg.textContent = "";
    }, 4000);
  };
  showSuccess = function (): void {
    this.showSpinner(false);
    document
      .querySelector(".result-message a")
      .setAttribute(
        "href",
        "https://dashboard.stripe.com/test/payments/" + "54545"
      );
    document.querySelector(".result-message").classList.remove("hidden");
    document.querySelector("button").disabled = true;
  };
  async handleForm(e) {
    console.log(this.card);
    e.preventDefault();
    this.showSpinner(true);
    this.stripe
      .confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card
        }
      })
      .then((result) => {
        if (result.error) {
          this.showError();
          // Show error to your customer
          console.log(result.error)
        } else {
          // The payment succeeded!
          this.showSuccess();
          console.log("bon")
        }
      });
  }

}
