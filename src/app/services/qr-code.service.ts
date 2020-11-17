import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor(private http:HttpClient) { }

  download(tableNumber:number){
    return this.http.get(`${environment.qrCodeUrl}/download/${tableNumber}`,{responseType: 'blob'});
  }
}
