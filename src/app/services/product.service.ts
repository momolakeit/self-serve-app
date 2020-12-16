import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDTO } from '../models/product-dto';
import { MenuDTO } from '../models/menu-dto';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  findAllProductFromMenu(restaurantId: number): Observable<[ProductDTO]> {
    return this.http.get<[ProductDTO]>(`${environment.productUrl}/menu/${restaurantId}`);
  }
  findAllWaiterRequestProduct(restaurantId: number): Observable<MenuDTO> {
    return this.http.get<MenuDTO>(`${environment.productUrl}/findWaiterRequestProducts/${restaurantId}`)
  }

  create(productDTO: ProductDTO, id: number): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${environment.productUrl}/${id}`, productDTO);
  }

  update(productDTO: ProductDTO): Observable<any> {
    return this.http.put(`${environment.productUrl}`, productDTO);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.productUrl}/${id}`);
  }

  saveProductImage(file: FormData, productId: number): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${environment.productUrl}/image/${productId}`, file)
  }

}
