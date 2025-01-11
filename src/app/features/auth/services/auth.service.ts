import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginDetails, User } from '../../../shared/models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private baseUrl = 'http://localhost:4000/';
  private baseUrl =
    'https://a4624d01d367b4e51ae51cbe6f066c92-452922102.eu-north-1.elb.amazonaws.com/';
  http = inject(HttpClient);
  constructor() {}
  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/register`, user);
  }
  loginUser(user: LoginDetails): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/login`, user);
  }
}
