import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginDetails, User } from '../../../shared/models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  // private baseUrl = 'http://localhost:4000/';
  private baseUrl =
    'https://a4624d01d367b4e51ae51cbe6f066c92-452922102.eu-north-1.elb.amazonaws.com:4000/';
  http = inject(HttpClient);
  constructor() {}
  getDriver(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/staff-driver/${userId}`);
  }
  driverOnboardingInfo(driver: any, id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}carrier/staff-driver/add-info/${id}`,
      driver
    );
  }
  updateDriverInfo(driver: any, id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}carrier/staff-driver/update-info/${id}`,
      driver
    );
  }
  updateTruckInfo(truck: any, id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}carrier/truck/update-info/${id}`,
      truck
    );
  }
  getAllDriverLoads(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/staff-driver/shipments/${id}`);
  }
  getLoadInfo(userId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}carrier/staff-driver/load-info/${userId}`
    );
  }
  updateLoadInfo(userId: string, bidId: any): Observable<any> {
    console.log(bidId);

    return this.http.post(
      `${this.baseUrl}carrier/staff-driver/update-load-info/${userId}`,
      bidId
    );
  }
}
