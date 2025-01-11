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
    'https://ac385a1c747ba4795a44cab8e15e55d4-563323433.eu-north-1.elb.amazonaws.com/';
  http = inject(HttpClient);
  constructor() {}
  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/register`, user);
  }
  loginUser(user: LoginDetails): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/login`, user);
  }
}
