import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service'
import { AuthentificationService } from '../../services/authentification.service';
import { PaymentFormComponent } from "src/app/components/payment-form/payment-form.component";
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { stripeKey } from 'src/environments/environment';
import { BillDTO } from 'src/app/models/bill-dto';
import { ProductService } from '../../services/product.service'
import { MenuType } from 'src/app/models/menu-type.enum';
import { ProductDTO } from 'src/app/models/product-dto';
import {BillService} from 'src/app/services/bill.service';
import { timer } from 'rxjs';
import { BillStatus } from 'src/app/models/bill-status.enum';

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
  applePaymentInError = false;
  requestTerminalProduct :ProductDTO;
  private _mobileQueryListener: () => void;
  durationInSeconds = 5;
  btnDisabled =false;

  constructor(private translate: TranslateService, private _snackBar: MatSnackBar, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog, private productService: ProductService,private billService:BillService ,private paymentService: PaymentService, private authentificationService: AuthentificationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.fetchOwnerAccountId();
    this.findAllWaiterRequest();
  }

  openSnackBar() {
    this.translate.get('paymentChoice.requestTerminalSnackBar').subscribe(res => {
      this._snackBar.open(res, 'close', {
        duration: this.durationInSeconds * 1000,
      });
    });

    this._snackBar._openedSnackBarRef.onAction().subscribe(() => this._snackBar.dismiss());
  }
  fetchOwnerAccountId(){
    this.paymentService.fetchAccountId(parseInt(localStorage.getItem("restaurantId"))).subscribe(data => {
      this.initStripe(data.value);
    });
  }
  findAllWaiterRequest() {
    this.productService.findAllWaiterRequestProduct(JSON.parse(localStorage.getItem('restaurantId'))).subscribe(data => {

      this.requestTerminalProduct = data.products.find(product => product.menuType == MenuType.TERMINALREQUEST);

    });
  }

  requestTerminal(){
    this.billService.makeOrder(this.requestTerminalProduct, "").subscribe(data=>{
      this.btnDisabled = true;
      this.openSnackBar();
      this.checkBillStatus();
    });
  }
  checkBillStatus(){
    var billDTO = JSON.parse(localStorage.getItem('ongoingBill'))
    timer(1000, 50000).subscribe(() => {
      this.billService.getBillStatus(billDTO.id).subscribe(data =>{
        if(data == BillStatus.PAYED){
            this.authentificationService.logoutAction();
        }
      })
    })
  }
  initStripe(stripeAccountId: string) {
    this.stripe = Stripe(stripeKey.value);
    var billDTO = JSON.parse(localStorage.getItem("ongoingBill"));
    this.paymentService.getPaymentRequestPaymentIntent(stripeAccountId, billDTO).subscribe(data => {
      this.clientSecret = data
      const elements = this.stripe.elements();
      var paymentRequest = this.initPaymentRequest(billDTO)
      var prButton = elements.create('paymentRequestButton', {
        paymentRequest: paymentRequest,
      });
      this.mountPaymentRequestBtn(paymentRequest, prButton);
      this.onPaymentRequestBtn(paymentRequest);
    });
  }
  openDialog(): void {
    this.dialog.open(PaymentFormComponent, {
      width: this.mobileQuery.matches ? '90%' : '50%',
      height: '35%',
      panelClass: 'payment-form-dialog',
    });
  }
  initPaymentRequest(billDTO: BillDTO): any {
    return this.stripe.paymentRequest({
      country: 'CA',
      currency: 'cad',
      total: {
        label: 'Self Serve',
        amount: billDTO.prixTotal * 100,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
  }
  mountPaymentRequestBtn(paymentRequest: any, prButton: any): void {
    // Check the availability of the Payment Request API first.
    paymentRequest.canMakePayment().then(function (result) {
      if (result) {
        prButton.mount('#card-element-apple-pay');
      } else {
        document.getElementById('card-element-apple-pay').style.display = 'none';
      }
    });
  }
  onPaymentRequestBtn(paymentRequest: any): void {
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
          this.changeApplePaymentInError(true);
          this.changeErrorTxtField(confirmResult.error.message)
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
                this.changeApplePaymentInError(true);
                this.changeErrorTxtField(confirmResult.error.message)
              } else {
                // The payment has succeeded.
                this.changeApplePaymentInError(false);
              }
            });
          } else {
            // The payment has succeeded.
            this.changeApplePaymentInError(false);
          }
        }
      });
    });
  }
  changeApplePaymentInError(state: boolean): void {
    this.applePaymentInError = state;
  }
  changeErrorTxtField(errorTxt: string): void {
    var txtField = document.getElementById("applePaymentInError");
    txtField.innerText = errorTxt;
  }

}
