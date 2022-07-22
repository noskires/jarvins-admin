import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// User interface
export class User {
  name!: String;
  email!: String;
  password!: String;
  password_confirmation!: String;
}

@Injectable({
  providedIn: 'root',
})

// const url = "http://localhost/laravel-jwt-auth/backend/";
// const url = "https://jarvins.herokuapp.com/";

export class AuthService {
  constructor(private http: HttpClient) {}
  // User registration
   
  register(user: User): Observable<any> {
    return this.http.post(environment.API_URL+'api/auth/register', user);
  }
  // Login
  signin(user: User): Observable<any> {
    return this.http.post<any>(environment.API_URL+'api/auth/login', user);
  }

  //get me
  me(): Observable<any> {
    return this.http.get(environment.API_URL+'api/auth/me');
  }

  // Access user profile
  profileUser(): Observable<any> {
    return this.http.get(environment.API_URL+'api/auth/user-profile');
  }

  // Update User
  update(user: User): Observable<any> {
    return this.http.post(environment.API_URL+'api/auth/update', user);
  }

  users(user: any): Observable<any> {
    return this.http.get(environment.API_URL+'api/auth/users', user);
  }

  users2(params: any): Observable<any> {
    return this.http.post(environment.API_URL+'api/auth/users2', params);
  }

  select2(): Observable<any> {
    return this.http.get(environment.API_URL+'api/auth/select2');
  }
}