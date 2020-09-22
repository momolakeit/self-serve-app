import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RestaurantTableDTO} from '../models/restaurant-table-dto'

@Injectable({
  providedIn: 'root'
})
export class KitchenService {

  constructor(private http:HttpClient) { }

  fetchKitchenRestaurentTables(restaurentID:number):Observable<[RestaurantTableDTO]>{
    return this.http.post<[RestaurantTableDTO]>(`${environment.restaurantTables}/findAllTables`,{restaurentId :restaurentID});
  }

  
  getAllRestaurantTables() :Observable<[RestaurantTableDTO]>{
    const restaurantId =2;
    return this.fetchKitchenRestaurentTables(restaurantId).pipe(
      map(response =>{
        console.log(response);
        return response;
      }));
  }
}
