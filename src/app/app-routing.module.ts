import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StartComponent } from './components/start/start.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { PaymentComponent } from './components/payment/payment.component';
import { WaiterComponent } from './components/waiter/waiter.component';
import { TableDetailPageComponent } from './components/table-detail-page/table-detail-page.component';
import { RestaurentOrdersComponent } from './components/restaurent-orders/restaurent-orders.component';
import { DishDetailComponent } from './components/dish-detail/dish-detail.component';
import { AdminProductManagmentComponent } from './components/admin-product-managment/admin-product-managment.component';
import { PaymentChoiceComponent } from './components/payment-choice/payment-choice.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { ClientRequestListComponent } from './components/client-request-list/client-request-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { WaiterRequestListComponent } from './components/waiter-request-list/waiter-request-list.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoleGuardService } from './services/role-guard.service';
import { LoginGuardService } from './services/login-guard.service';

const routes: Routes = [
  {path: '', redirectTo: '/start', pathMatch: 'full'},
  //all about authentification
  {path: 'start',canActivate:[LoginGuardService] ,component: StartComponent},
  {path: 'login',canActivate:[LoginGuardService] , component: LoginComponent},
  {path: 'sign-up/:role',canActivate:[LoginGuardService] , component: SignupComponent},

  //all about clients
  {path: 'payment',canActivate:[AuthGuardService], component: PaymentComponent},
  {path: 'waiter',canActivate:[AuthGuardService], component: WaiterComponent},
  {path: 'clientRequestList', component: ClientRequestListComponent},
  {path: 'dishDetail',canActivate:[AuthGuardService], component: DishDetailComponent},
  {path: 'menu',canActivate:[AuthGuardService], component: MenuComponent},
  {path: 'paymentChoice',canActivate:[AuthGuardService], component: PaymentChoiceComponent},
  {path: 'paymentForm',canActivate:[AuthGuardService], component: PaymentFormComponent},

  //all about waiter
  {path: 'waiter-request',canActivate:[AuthGuardService], component: WaiterRequestListComponent},
  {path: 'tableDetail',canActivate:[AuthGuardService], component: TableDetailPageComponent},
  {path: 'restaurentOrders',canActivate:[AuthGuardService], component: RestaurentOrdersComponent},
  {path: 'contactForm',canActivate:[AuthGuardService], component: ContactFormComponent},
  {path: 'not-found',canActivate:[AuthGuardService], component: NotFoundComponent},
  
  //all about admin
  {path: 'adminProductManagment',canActivate:[AuthGuardService,RoleGuardService], component: AdminProductManagmentComponent},
  {path: '**', redirectTo: '/not-found'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
