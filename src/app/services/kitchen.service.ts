import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RestaurantTableDTO} from '../models/restaurant-table-dto'
import { OrderItemDTO } from '../models/order-item-dto';
import { RestaurantFormDTO } from '../models/restaurant-form-dto';
import { RestaurantDTO } from '../models/restaurant-dto';
import { MenuDTO } from '../models/menu-dto';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {

  constructor(private http:HttpClient) { }

  fetchKitchenRestaurentTables(restaurentID:number):Observable<[RestaurantTableDTO]>{
    return this.http.post<[RestaurantTableDTO]>(`${environment.kitchenUrl}/findAllTables`,{restaurentId :restaurentID});
  }
  postOrderItemStatusReady(orderItemDTO:OrderItemDTO):Observable<OrderItemDTO>{
    return this.http.post<OrderItemDTO>(`${environment.kitchenUrl}/changeOrderItemStatus`,{orderItemDTO :JSON.stringify(orderItemDTO)});
  }
  updateOrderItem(orderItemDTO:OrderItemDTO):Observable<OrderItemDTO>{
    return this.http.put<OrderItemDTO>(`${environment.kitchenUrl}/editOrderItem`,orderItemDTO);
  }
  postMoreTimeForOrder(orderItemDTO :OrderItemDTO,tempsAjoute :number): Observable<OrderItemDTO>{
    return this.http.post<OrderItemDTO>(`${environment.kitchenUrl}/changeOrderItemTime`,{orderItemId:orderItemDTO.id,tempsAjoute:tempsAjoute});
  }
  fetchMenuByRestaurantTable (tableID :number) :Observable<RestaurantDTO> {
    return this.http.get<RestaurantDTO>(`${environment.kitchenUrl}/findRestaurantByRestaurantTableId/${tableID}`);
  }
  getAllRestaurantTables(restaurantId:number) :Observable<[RestaurantTableDTO]>{
    return this.fetchKitchenRestaurentTables(restaurantId).pipe(
      map(response =>{
        return response;
      }));
  } 
  setOrderItemReady(orderItemDTO :OrderItemDTO) :Observable<OrderItemDTO>{
    const restaurantId =2;
    return this.postOrderItemStatusReady(orderItemDTO).pipe(
      map(response =>{
        return response;
      }));
  }

  createRestaurant(restaurantFormDTO: RestaurantFormDTO) :Observable<RestaurantDTO>{
    return this.http.post<RestaurantDTO>(`${environment.kitchenUrl}/createRestaurant`,restaurantFormDTO);
  }
  saveRestaurantLogo(file: FormData, restaurantId: number): Observable<RestaurantDTO> {
    return this.http.post<RestaurantDTO>(`${environment.kitchenUrl}/logo/${restaurantId}`, file)
  }
  updateRestaurantName(restaurantName:string,restaurantId: number):Observable<RestaurantDTO>{
    return this.http.post<RestaurantDTO>(`${environment.kitchenUrl}/modifierNomTable`,{restaurantName,restaurantId});
  }

  deleteTable(restaurantTableId:number,restaurantId:number){
    return this.http.post(`${environment.kitchenUrl}/deleteTable`,{restaurantTableId,restaurantId});
  }

  addRestaurantTable(restaurantId:number,tableNumber:number):Observable<RestaurantDTO>{
    return this.http.post<RestaurantDTO>(`${environment.kitchenUrl}/addTable/${restaurantId}/${tableNumber}`,{});
  }

  deleteRestaurant(restaurantId: number){
    return this.http.post(`${environment.kitchenUrl}/deleteRestaurant`,{restaurantId:restaurantId});
  }

}
