import { HttpClient } from '@angular/common/http';

import { Invitation, LoginDetails, User } from '../../../shared/models/user';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarrierService {
  // private baseUrl = 'http://localhost:4000/';
  private baseUrl = 'http://a4624d01d367b4e51ae51cbe6f066c92-452922102.eu-north-1.elb.amazonaws.com:4000/';

  http = inject(HttpClient);
  constructor() {}
  inviteDriver(driver: Invitation): Observable<any> {
    return this.http.post(`${this.baseUrl}carrier/invite-driver`, driver);
  }
}
