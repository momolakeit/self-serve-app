import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {ProductDTO} from '../models/product-dto';
import {RateDTO} from '../models/rate-dto';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(private http: HttpClient) { }

  find(rate:RateDTO,product:ProductDTO):Observable<RateDTO>{
      return this.http.post<RateDTO>(`${environment.rateUrl}/createRate`,{rate: rate,product:product});
  }
}
