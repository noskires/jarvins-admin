import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmployeesService {

  constructor(private http: HttpClient) {}

  list(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/employee/list', params);
  }

  save(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/employee/save', params);
  }

  update(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/employee/update', params);
  }

  delete(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/employee/delete', params);
  }

  export(params: any): Observable<any> {
    return this.http.get('https://jarvins.herokuapp.com/api/v1/employee/export', {responseType: 'blob'});
  }

  regions(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/geo/regions/select2', params);
  }

  provinces(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/geo/provinces/select2', params);
  }

  towns(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/geo/towns/select2', params);
  }

  brgy(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/geo/barangays/select2', params);
  }

  centers(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/organization/center/select2', params);
  }

  divisions(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/organization/division/select2', params);
  }

  sections(params: any): Observable<any> {
    return this.http.post('https://jarvins.herokuapp.com/api/v1/organization/section/select2', params);
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