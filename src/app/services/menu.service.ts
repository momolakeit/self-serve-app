import { Injectable } from '@angular/core';
import { MenuDTO } from '../models/menu-dto';
import { RestaurantSelectionDTO } from '../models/restaurant-selection-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConstanteService } from './constante-service.service';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private constanteService: ConstanteService) { }

  fetchMenuById(restaurantId: number): Observable<[MenuDTO]> {
    return this.http.post<[MenuDTO]>(`${environment.menuUrl}/getMenu`, { restaurantId: restaurantId });
  }

  getMenuById(menuId:number): Observable<[MenuDTO]> {
    return this.fetchMenuById(menuId).pipe(
      map(response => {
        return response;
      }));
  }

  getAllRestaurantName(username:string): Observable<[RestaurantSelectionDTO]> {
    return this.http.get<[RestaurantSelectionDTO]>(`${environment.menuUrl}/restaurantName/${username}`);
  }
}
