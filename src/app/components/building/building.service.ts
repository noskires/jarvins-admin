import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/building/list', params);
  }

  save(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/building/save', params);
  }

  update(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/building/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/building/delete', params);
  }
}