import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {PaymentService} from '../../services/payment.service';
import {OwnerUsernameService} from '../../services/owner-username.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-stripe-account-create-prompt',
  templateUrl: './stripe-account-create-prompt.component.html',
  styleUrls: ['./stripe-account-create-prompt.component.css']
})
export class StripeAccountCreatePromptComponent implements OnInit {

  loading : boolean;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  ngOnInit(): void {
    this.confirmStripeAccountCreation();
    this.fetchOwner();

  }
  constructor(changeDetectorRef: ChangeDetectorRef,private paymentService:PaymentService, media: MediaMatcher,private ownerUsernameService: OwnerUsernameService, private activatedRoute: ActivatedRoute,private router:Router,private authentificationService:AuthentificationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  fetchOwner() {
    this.authentificationService.getOwner(this.ownerUsernameService.initUserName()).subscribe(data => {
      if (data.stripeAccountId != null && data.stripeEnable == true) {
        this.navToSubscription();
      }
    })
  }

  redirectToStripeRegister() {
    this.loading = true;
    this.paymentService.createStripeAccount(this.ownerUsernameService.initUserName()).subscribe(data => {
      window.location.href = data.value;
    })
  }
  confirmStripeAccountCreation() {
    this.activatedRoute.queryParams.subscribe(params => {
      let accountId = params['accountId'];
      if (accountId != null) {
        this.paymentService.saveStripeAccount(accountId, this.ownerUsernameService.initUserName()).subscribe(data => {
          this.navToSubscription();
        });
      }
    });
  }

  navToSubscription(){
    this.router.navigate(["/subscriptionDetail"]);
  }
}
