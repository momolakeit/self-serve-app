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

  find(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${environment.productUrl}/${id}`);
  }

  findAllProductFromMenu(menuId: number): Observable<[ProductDTO]> {
    return this.http.get<[ProductDTO]>(`${environment.productUrl}/menu/${menuId}`);
  }
  findAllWaiterRequestProduct(menuId: number): Observable<[ProductDTO]> {
    return this.http.get<[ProductDTO]>(`${environment.productUrl}/findWaiterRequestProducts/${menuId}`)
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

  findMenuSpecial(menuDTO: MenuDTO): Observable<[ProductDTO]> {
    return this.http.post<[ProductDTO]>(`${environment.productUrl}/findMenuSpecial`, { menuDTO: JSON.stringify(menuDTO) });
  }

  findChoixDuChef(menuDTO: MenuDTO): Observable<[ProductDTO]> {
    return this.http.post<[ProductDTO]>(`${environment.productUrl}/findChoixDuChef`, { menuDTO: JSON.stringify(menuDTO) });
  }

  setProductSpecial(productDTO: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${environment.productUrl}/setProductSpecial`, { productDTO: JSON.stringify(productDTO) });
  }

  removeProductType(productDTO: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${environment.productUrl}/deleteProductType`, { productDTO: JSON.stringify(productDTO) });
  }

  setProductChefChoice(productDTO: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${environment.productUrl}/setMenuChefChoice`, { productDTO: JSON.stringify(productDTO) });
  }

  saveProductImage(file: FormData, productId: number): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${environment.productUrl}/image/${productId}`, file)
  }

}
