import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/building/list', params);
  }

  save(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/building/save', params);
  }

  update(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/building/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/building/delete', params);
  }
}