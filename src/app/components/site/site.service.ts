import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/site/list', params);
  }

  save(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/site/save', params);
  }

  update(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/site/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/v1/site/delete', params);
  }

  select2data(theme:string, multiple:boolean, closeOnSelect:boolean, width:string, url:string, token:any, value:any, placeholder:string ) {

    return {
      theme: theme,
      multiple: multiple,
      closeOnSelect: closeOnSelect,
      width: width,
      ajax: {
        headers: {
          "Authorization" : "Bearer "+token,
          "Content-Type" : "application/json",
        },
        url: url,
        data: function (params:any) {

          console.log(params)
          var query = {
            search: params.term,
          }
          // Query parameters will be ?search=[term]&type=public
          console.log(query)
          return query;
        },
        type: "get",
        dataType: 'json',
        delay: 100,
        cache: true
      },
      value: value,
      placeholder: placeholder,
      language: {
          noResults: function () {
              return "No records found!";
          }
      },
    };

  }
}