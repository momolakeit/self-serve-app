import { Injectable } from '@angular/core';
import { MenuDTO} from '../models/menu-dto';
import { RestaurantSelectionDTO} from '../models/restaurant-selection-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http:HttpClient) { }

  fetchMenuById(menuID:number):Observable<MenuDTO>{
    return this.http.post<MenuDTO>(`${environment.menuUrl}/getMenu`,{menuId :menuID});
  }

  getMenuById() : Observable<MenuDTO>{
    const menuId  =1;
    return this.fetchMenuById(menuId).pipe(
      map(response => {
        return response;
      }));
  }

  getAllRestaurantName():Observable<[RestaurantSelectionDTO]>{
      const ownerUsername = localStorage.getItem('username');
      return this.http.get<[RestaurantSelectionDTO]>(`${environment.menuUrl}/restaurantName/${ownerUsername}`);
  }
}
