import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PssOwnerService {

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/pss-owner/list', params);
  }

  save(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/pss-owner/save', params);
  }

  update(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/pss-owner/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/pss-owner/delete', params);
  }
}