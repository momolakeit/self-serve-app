import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RestaurantTableDTO } from '../models/restaurant-table-dto'
import { OrderItemDTO } from '../models/order-item-dto';
import { RestaurantFormDTO } from '../models/restaurant-form-dto';
import { RestaurantDTO } from '../models/restaurant-dto';
import { MenuDTO } from '../models/menu-dto';
import { RestaurantEmployerDto } from '../models/restaurant-employer-dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {

  constructor(private http: HttpClient) { }

  // Get

  fetchMenuByRestaurantTable(tableID: number): Observable<RestaurantDTO> {
    return this.http.get<RestaurantDTO>(`${environment.kitchenUrl}/findRestaurantByRestaurantTableId/${tableID}`);
  }

  getAllRestaurantTables(): Observable<[RestaurantTableDTO]> {
    const restaurantId = JSON.parse(localStorage.getItem('restaurantId'));
    return this.fetchKitchenRestaurentTables(restaurantId).pipe(
      map(response => {
        return response;
      }));
  }

  findEmployerRestaurantId(username:string){
    return this.http.get<number>(`${environment.kitchenUrl}/employerRestaurant/${username}`);
  }

  setEmployerRestaurantIdAndOwner(username:string,router:Router){
    this.findRestaurantEmployer(username).subscribe(data =>{
      console.log('my employer');
      console.log(data);
      localStorage.setItem('restaurantId',JSON.stringify(data.restaurantId));
      localStorage.setItem('ownerUsername',JSON.stringify(data.ownerUsername));
      router.navigate(['/restaurentOrders'])
    })
  }

  findAllRestaurantEmployers(restaurantId:number): Observable<RestaurantEmployerDto[]> {
    return this.http.get<RestaurantEmployerDto[]>(`${environment.kitchenUrl}/restaurantEmployers/${restaurantId}`);
  }
  
  findRestaurantEmployer(username:string): Observable<RestaurantEmployerDto> {
    return this.http.get<RestaurantEmployerDto>(`${environment.kitchenUrl}/restaurantEmployer/${username}`);
  }

  updateOrderItem(orderItemDTO:OrderItemDTO):Observable<OrderItemDTO>{
    return this.http.put<OrderItemDTO>(`${environment.kitchenUrl}/editOrderItem`,orderItemDTO);
  }

  // Post

  addUserToRestaurant(restaurantUserDTO:RestaurantEmployerDto){
    return this.http.post(`${environment.kitchenUrl}/addUserToRestaurant`,restaurantUserDTO);
  }

  fetchKitchenRestaurentTables(restaurentID: number): Observable<[RestaurantTableDTO]> {
    return this.http.post<[RestaurantTableDTO]>(`${environment.kitchenUrl}/findAllTables`, { restaurentId: restaurentID });
  }
  postOrderItemStatusReady(orderItemDTO: OrderItemDTO): Observable<OrderItemDTO> {
    return this.http.post<OrderItemDTO>(`${environment.kitchenUrl}/changeOrderItemStatus`, { orderItemDTO: JSON.stringify(orderItemDTO) });
  }
  postMoreTimeForOrder(orderItemDTO: OrderItemDTO, tempsAjoute: number): Observable<OrderItemDTO> {
    return this.http.post<OrderItemDTO>(`${environment.kitchenUrl}/changeOrderItemTime`, { orderItemId: orderItemDTO.id, tempsAjoute: tempsAjoute });
  }

  setOrderItemReady(orderItemDTO: OrderItemDTO): Observable<OrderItemDTO> {
    return this.postOrderItemStatusReady(orderItemDTO).pipe(
      map(response => {
        return response;
      }));
  }

  createRestaurant(restaurantFormDTO: RestaurantFormDTO): Observable<RestaurantDTO> {
    return this.http.post<RestaurantDTO>(`${environment.kitchenUrl}/createRestaurant`, restaurantFormDTO);
  }
  saveRestaurantLogo(file: FormData, restaurantId: number): Observable<RestaurantDTO> {
    return this.http.post<RestaurantDTO>(`${environment.kitchenUrl}/logo/${restaurantId}`, file)
  }
  updateRestaurantName(restaurantName: string, restaurantId: number): Observable<RestaurantDTO> {
    return this.http.post<RestaurantDTO>(`${environment.kitchenUrl}/modifierNomTable`, { restaurantName, restaurantId });
  }

  deleteTable(restaurantTableId: number, restaurantId: number) {
    return this.http.post(`${environment.kitchenUrl}/deleteTable`, { restaurantTableId, restaurantId });
  }

  addRestaurantTable(restaurantId: number, tableNumber: number): Observable<RestaurantDTO> {
    return this.http.post<RestaurantDTO>(`${environment.kitchenUrl}/addTable/${restaurantId}/${tableNumber}`, {});
  }

  deleteRestaurant(restaurantId: number) {
    return this.http.post(`${environment.kitchenUrl}/deleteRestaurant`, { restaurantId: restaurantId });
  }

  // Put

  updateRestaurantEmployee(restaurantUserDTO:RestaurantEmployerDto){
    return this.http.put(`${environment.kitchenUrl}/updateRestaurantUser`,restaurantUserDTO);
  }

}
