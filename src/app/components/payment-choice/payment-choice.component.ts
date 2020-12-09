import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service'
import { AuthentificationService } from '../../services/authentification.service';
import { PaymentFormComponent } from "src/app/components/payment-form/payment-form.component";
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { stripeKey } from 'src/environments/environment';

@Component({
  selector: 'app-payment-choice',
  templateUrl: './payment-choice.component.html',
  styleUrls: ['./payment-choice.component.css']
})
export class PaymentChoiceComponent implements OnInit {

  card;
  stripe; // : stripe.Stripe;
  clientSecret;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  durationInSeconds = 5;

  constructor(private translate: TranslateService, private _snackBar: MatSnackBar, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog, private paymentService: PaymentService, private authentificationService: AuthentificationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.paymentService.fetchAccountId(parseInt(localStorage.getItem("restaurantId"))).subscribe(data => {
      this.initStripe(data.value);
    })
  }

  openSnackBar() {
    this.translate.get('paymentChoice.requestTerminalSnackBar').subscribe(res => {
      this._snackBar.open(res, 'close', {
        duration: this.durationInSeconds * 1000,
      });
    });

    this._snackBar._openedSnackBarRef.onAction().subscribe(() => this._snackBar.dismiss());
  }


  initStripe(stripeAccountId: string) {
    this.stripe = Stripe(stripeKey.value);
    this.paymentService.getPaymentRequestPaymentIntent(stripeAccountId).subscribe(data => {
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
    paymentRequest.on('paymentmethod', function (ev) {
      // Confirm the PaymentIntent without handling potential next actions (yet).
      this.stripe.confirmCardPayment(
        this.clientSecret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false }
      ).then(function (confirmResult) {
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
            this.stripe.confirmCardPayment(this.clientSecret).then(function (result) {
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
  openDialog(): void {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: this.mobileQuery.matches ? '90%' : '50%',
      height: '35%',
      panelClass: 'payment-form-dialog',
    });
  }

}
