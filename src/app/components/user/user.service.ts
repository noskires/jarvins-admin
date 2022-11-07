import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    return this.http.get(environment.API_URL+'api/auth/users', params);
  }

  save(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/auth/register', params);
  }

  update(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/auth/user/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/auth/user/delete', params);
  }

}
