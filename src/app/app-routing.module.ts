import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StartComponent } from './components/start/start.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { RestaurentOrdersComponent } from './components/restaurent-orders/restaurent-orders.component';
import { DishDetailComponent } from './components/dish-detail/dish-detail.component';
import { AdminProductManagmentComponent } from './components/admin-product-managment/admin-product-managment.component';
import { PaymentChoiceComponent } from './components/payment-choice/payment-choice.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { ClientRequestListComponent } from './components/client-request-list/client-request-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { WaiterRequestListComponent } from './components/waiter-request-list/waiter-request-list.component';
import { AuthGuardService } from './services/auth-guard.service';
import { OwnerRoleGuardService } from './services/role-guard.service';
import { ClientGuardService } from './services/client-guard.service';
import { WaiterGuardService } from './services/waiter-guard.service';
import { CookGuardService } from './services/cook-guard.service';
import { LoginGuardService } from './services/login-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'not-found', canActivate: [AuthGuardService], component: NotFoundComponent },
  
  //all about authentification
  { path: 'start', canActivate: [LoginGuardService], component: StartComponent },
  { path: 'login', canActivate: [LoginGuardService], component: LoginComponent },
  { path: 'sign-up/:role', canActivate: [LoginGuardService], component: SignupComponent },
  
  //all about clients
  { path: 'waiter', canActivate: [ClientGuardService], component: WaiterComponent },
  { path: 'clientRequestList', canActivate: [ClientGuardService], component: ClientRequestListComponent },
  { path: 'menu', canActivate: [ClientGuardService], component: MenuComponent },
  { path: 'paymentChoice', canActivate: [ClientGuardService], component: PaymentChoiceComponent },
  //{path: 'dishDetail',canActivate:[AuthGuardService], component: DishDetailComponent},
  
  //all about waiter
  { path: 'waiter-request', canActivate: [WaiterGuardService], component: WaiterRequestListComponent },
  { path: 'restaurentOrders', canActivate: [WaiterGuardService,CookGuardService], component: RestaurentOrdersComponent },
  
  //all about admin
  { path: 'adminProductManagment', canActivate: [OwnerRoleGuardService], component: AdminProductManagmentComponent },
  { path: 'contactForm', canActivate: [OwnerRoleGuardService], component: ContactFormComponent },

  //not found needs to be at the end or else buggs
  { path: '**', redirectTo: '/not-found' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
