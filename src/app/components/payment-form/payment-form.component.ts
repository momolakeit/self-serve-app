import { Component, OnInit, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
import { stripeKey } from 'src/environments/environment';
import { BillService } from 'src/app/services/bill.service';
import { BillDTO } from 'src/app/models/bill-dto';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PaymentFormComponent>, private authentificationService: AuthentificationService, private billService: BillService, private http: HttpClient, private paymentService: PaymentService, private router: Router) { }

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement') cardElement: ElementRef;

  stripe; // : stripe.Stripe;
  card;
  cardErrors;
  clientSecret;
  isError: boolean;
  loading = false;
  confirmation;
  paymentSucceeded = false;


  ngOnInit() {
    this.paymentService.fetchAccountId(parseInt(localStorage.getItem("restaurantId"))).subscribe(data => {
      this.initStripe(data.value);
    })
  }

  initStripe(stripeAccountId: string) {
    this.isError = false;
    this.paymentService.getPaymentIntent(stripeAccountId).subscribe(data => {
      this.clientSecret = data
    });

    this.stripe = Stripe(stripeKey.value);
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

  showError(errorMsgTxt: string): void {
    this.showSpinner(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgTxt;
    /*setTimeout(function () {
      errorMsg.textContent = "";
    }, 4000);*/
  };

  showSuccess = function (): void {
    this.showSpinner(false);
    document.getElementById("submit").classList.add("btn-success");
  };

  changePage = function (): void {
    this.router.navigateByUrl("/start");
  }

  async handleForm(e) {
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
          // Show error to your customer
          this.isError = true;
          this.showError(result.error.message);

        } else {
          // The payment succeeded!
          this.showSuccess();
          this.paymentSucceeded = true;
          const billDTO: BillDTO = JSON.parse(localStorage.getItem('ongoingBill'));
          this.billService.makePayment(billDTO.id).subscribe();
          setTimeout(() => {
            this.authentificationService.logoutAction();
            this.dialogRef.close();
          }, 3000)
        }
      });
  }

}
