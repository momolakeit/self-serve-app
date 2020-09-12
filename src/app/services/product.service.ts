import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProductDTO } from '../models/product-dto';
import { MenuDTO } from '../models/menu-dto';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  find(id:number):Observable<ProductDTO>{
    return this.http.get<ProductDTO>(`${environment.productUrl}/${id}`);
  }

  findAllProductFromMenu(menuId:number):Observable<[ProductDTO]>{
    return this.http.get<[ProductDTO]>(`${environment.productUrl}/menu/${menuId}`);
  }

  create(productDTO:ProductDTO,id:number):Observable<any>{
    return this.http.post(`${environment.productUrl}/${id}`,productDTO);
  }

  update(productDTO:ProductDTO):Observable<any>{
    return this.http.put(`${environment.productUrl}`,productDTO);
  }

  delete(id:number):Observable<any>{
    return this.http.delete(`${environment.productUrl}/${id}`);
  }

  findMenuSpecial(menuDTO:MenuDTO):Observable<[ProductDTO]>{
    return this.http.post<[ProductDTO]>(`${environment.productUrl}/findMenuSpecial`,menuDTO);
  }

  findChoixDuChef(menuDTO:MenuDTO):Observable<[ProductDTO]>{
    return this.http.post<[ProductDTO]>(`${environment.productUrl}/findChoixDuChef`,menuDTO);
  }

  setProductSpecial(productDTO:ProductDTO):Observable<ProductDTO>{
    return this.http.post<ProductDTO>(`${environment.productUrl}/setProductSpecial`,productDTO);
  }

  removeProductType(productDTO:ProductDTO):Observable<ProductDTO>{
    return this.http.post<ProductDTO>(`${environment.productUrl}/deleteProductType`,productDTO);
  }

  setProductChefChoice(productDTO:ProductDTO):Observable<ProductDTO>{
    return this.http.post<ProductDTO>(`${environment.productUrl}/setMenuChefChoice`,productDTO);
  }








  
}
