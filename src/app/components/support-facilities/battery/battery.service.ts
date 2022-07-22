import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BatteryService {

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/battery/list', params);
  }

  save(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/battery/save', params);
  }

  update(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/battery/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/v1/battery/delete', params);
  }

}
