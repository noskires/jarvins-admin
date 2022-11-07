import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) {}

  // list(params: any): Observable<any> {
  //   return this.http.post(environment.API_URL+'api/auth/user/permission', params);
  // }

  list(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/permission/list', params);
  }

  save(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/permission/save', params);
  }

  update(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/permission/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/permission/delete', params);
  }
  
}
