import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {OwnerDTO} from '../models/owner-dto'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  fetchAllOwners():Observable<[OwnerDTO]>{
    return this.http.get<[OwnerDTO]>(`${environment.adminUrl}`);
  }

}
