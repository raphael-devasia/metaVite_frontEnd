import { HttpClient } from '@angular/common/http';

import { Invitation, LoginDetails, User,  } from '../../../shared/models/user';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarrierService {
  private baseUrl = 'http://localhost:4000/';
  http = inject(HttpClient);
  constructor() {}
  inviteDriver(driver: Invitation): Observable<any> {
    return this.http.post(`${this.baseUrl}carrier/invite-driver`, driver);
  }
}
