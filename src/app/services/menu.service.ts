import { Injectable,EventEmitter } from '@angular/core';
import { MenuDTO } from '../models/menu-dto';
import { RestaurantSelectionDTO } from '../models/restaurant-selection-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConstanteService } from './constante-service.service';
import { MenuType } from '../models/menu-type.enum';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  onMenuSelectedEvent = new EventEmitter<any>();
  onMenuCreatedEvent = new EventEmitter<any>();
  constructor(private http: HttpClient, private constanteService: ConstanteService) { }

  fetchAllMenuByRestaurantId(restaurantId: number): Observable<[MenuDTO]> {
    return this.http.post<[MenuDTO]>(`${environment.menuUrl}/getMenu`, { restaurantId: restaurantId });
  }
  updateMenu(menuId:number,menuName:string,menuType:MenuType):Observable<[MenuDTO]> {  
    return this.http.put<[MenuDTO]>(`${environment.menuUrl}/updateMenu`, { menuId: menuId,menuName:menuName,menuType:menuType });
  }

  deleteMenu(restaurantId: number,menuId:number): Observable<any> {
    return this.http.delete(`${environment.menuUrl}/deleteMenu/${restaurantId}/${menuId}`);
  }

  getMenuById(menuId:number): Observable<[MenuDTO]> {
    return this.fetchAllMenuByRestaurantId(menuId).pipe(
      map(response => {
        return response;
      }));
  }
  createMenu(menuName:string,restaurantId:number,menuType:MenuType):Observable<MenuDTO>{
    return this.http.post<MenuDTO>(`${environment.menuUrl}/createMenu`, { menuName:menuName,restaurantId: restaurantId,menuType:menuType});
  }

  getAllRestaurantName(username:string): Observable<[RestaurantSelectionDTO]> {
    return this.http.get<[RestaurantSelectionDTO]>(`${environment.menuUrl}/restaurantName/${username}`);
  }
}
