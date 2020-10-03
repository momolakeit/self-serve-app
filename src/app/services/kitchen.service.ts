import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RestaurantTableDTO} from '../models/restaurant-table-dto'
import { OrderItemDTO } from '../models/order-item-dto';
import { RestaurantFormDTO } from '../models/restaurant-form-dto';

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
  postMoreTimeForOrder(orderItemDTO :OrderItemDTO,tempsAjoute :number): Observable<OrderItemDTO>{
    return this.http.post<OrderItemDTO>(`${environment.kitchenUrl}/changeOrderItemTime`,{orderItemId:orderItemDTO.id,tempsAjoute:tempsAjoute});
  }
  
  getAllRestaurantTables() :Observable<[RestaurantTableDTO]>{
    const restaurantId =2;
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

  createRestaurant(restaurantFormDTO: RestaurantFormDTO){
    return this.http.post(`${environment.kitchenUrl}/createRestaurant`,restaurantFormDTO);
  }

}
