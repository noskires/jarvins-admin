import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElectricCompanyService {

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/electric-company/list', params);
  }

  save(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/electric-company/save', params);
  }

  update(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/electric-company/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/electric-company/delete', params);
  }
}