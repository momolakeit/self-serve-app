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

const routes: Routes = [
  {path: '', redirectTo: '/acceuil', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'waiter', component: WaiterComponent},
  {path: 'sign-up', component: SignupComponent},
  {path: 'dishDetail', component: DishDetailComponent},
  {path: 'tableDetail', component: TableDetailPageComponent},
  {path: 'restaurentOrders', component: RestaurentOrdersComponent},
  {path: 'acceuil', component: StartComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'menu', component: MenuComponent},
  {path: '**', redirectTo: '/not-found'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
