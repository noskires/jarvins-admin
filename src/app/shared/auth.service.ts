import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

export class AuthService {
  constructor(private http: HttpClient) {}
  // User registration
  register(user: User): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/auth/register', user);
  }
  // Login
  signin(user: User): Observable<any> {
    return this.http.post<any>('http://localhost/laravel-jwt-auth/backend/api/auth/login', user);
  }

  //get me
  me(): Observable<any> {
    return this.http.get('http://localhost/laravel-jwt-auth/backend/api/auth/me');
  }

  // Access user profile
  profileUser(): Observable<any> {
    return this.http.get('http://localhost/laravel-jwt-auth/backend/api/auth/user-profile');
  }

  // Update User
  update(user: User): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/auth/update', user);
  }

  users(user: any): Observable<any> {
    return this.http.get('http://localhost/laravel-jwt-auth/backend/api/auth/users', user);
  }

  users2(params: any): Observable<any> {
    return this.http.post('http://localhost/laravel-jwt-auth/backend/api/auth/users2', params);
  }

  select2(): Observable<any> {
    return this.http.get('http://localhost/laravel-jwt-auth/backend/api/auth/select2');
  }
}