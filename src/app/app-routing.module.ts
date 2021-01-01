import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StartComponent } from './components/start/start.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { RestaurentOrdersComponent } from './components/restaurent-orders/restaurent-orders.component';
import { AdminProductManagmentComponent } from './components/admin-product-managment/admin-product-managment.component';
import { PaymentChoiceComponent } from './components/payment-choice/payment-choice.component';
import { ClientRequestListComponent } from './components/client-request-list/client-request-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { AuthGuardService } from './services/auth-guard.service';
import { OwnerRoleGuardService } from './services/role-guard.service';
import { ClientGuardService } from './services/client-guard.service';
import { CookAndWaiterGuardService } from './services/cook-waiter-guard.service';
import { LoginGuardService } from './services/login-guard.service';
import { OwnerSubscriptionComponent } from './components/owner-subscription/owner-subscription.component';
import { SubscriptionDetailsComponent } from './components/subscription-details/subscription-details.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { AdminGuardService } from './services/admin-guard.service';
import { AdminOwnerGuardService } from './services/admin-owner-guard.service';
import { StripeAccountCreatePromptComponent } from './components/stripe-account-create-prompt/stripe-account-create-prompt.component';
import {PaymentChoiceGuardService} from './services/payment-choice-guard.service';
import {RequestTerminalGuardService} from './services/request-terminal-guard.service';
import { OwnerBillsPageComponent } from './components/owner-bills-page/owner-bills-page.component';
const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'not-found', canActivate: [AuthGuardService], component: NotFoundComponent },
  
  //all about admin
  { path: 'admin',canActivate:[AdminGuardService] ,component: AdminPageComponent },

  //all about authentification
  { path: 'start', component: StartComponent },
  { path: 'login', canActivate: [LoginGuardService], component: LoginComponent },
  { path: 'sign-up/:role', canActivate: [LoginGuardService], component: SignupComponent },
  
  //all about clients
  { path: 'waiter', canActivate: [ClientGuardService,RequestTerminalGuardService], component: WaiterComponent },
  { path: 'clientRequestList', canActivate: [ClientGuardService,RequestTerminalGuardService], component: ClientRequestListComponent },
  { path: 'menu', canActivate: [ClientGuardService,RequestTerminalGuardService], component: MenuComponent },
  { path: 'paymentChoice', canActivate: [ClientGuardService,PaymentChoiceGuardService], component: PaymentChoiceComponent },
  
  //all about waiter
  { path: 'restaurentOrders',canActivate:[CookAndWaiterGuardService], component: RestaurentOrdersComponent },
  
  //all about admin
  { path: 'contactForm', canActivate: [OwnerRoleGuardService], component: ContactFormComponent },

  {path: 'adminProductManagment',canActivate:[AdminOwnerGuardService], component: AdminProductManagmentComponent},
  {path: 'ownerBills',canActivate:[OwnerRoleGuardService], component: OwnerBillsPageComponent},
  {path: 'isStripeEnabled',canActivate:[OwnerRoleGuardService], component: StripeAccountCreatePromptComponent},
  // {path: 'subscription',canActivate:[OwnerRoleGuardService], component: OwnerSubscriptionComponent},
  //{path: 'subscriptionDetail',canActivate:[OwnerRoleGuardService], component: SubscriptionDetailsComponent},
  //not found needs to be at the end or else buggs
  { path: '**', redirectTo: '/not-found' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
