import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Invitation } from '../../../shared/models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private baseUrl = 'http://localhost:4000/';
  private baseUrl = 'http://a4624d01d367b4e51ae51cbe6f066c92-452922102.eu-north-1.elb.amazonaws.com:4000/';
  http = inject(HttpClient);
  constructor() {}
  getAllDrivers(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/drivers`);
  }
  getAllStaffs(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/staffs`);
  }
  getAllVehicles(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/vehicles`);
  }

  getAllCarriers(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/carriers`);
  }
  getAllShippers(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/shippers`);
  }
  // getAllBids(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}admin/bids`);
  // }
  getAllBids(refId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/bids/${refId}`);
  }
  getAllShipperBids(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/bids/${id}`);
  }
  // getAllShipments(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}admin/shipments`);
  // }
  getAllShipments(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/shipments/${id}`);
  }
  getTruckDetails(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/truck/${id}`);
  }
  getDriver(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/staff-driver/${userId}`);
  }
  driverOnboardingInfo(driver: any, id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}admin/staff-driver/add-info/${id}`,
      driver
    );
  }
  updateDriverInfo(driver: any, id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}admin/staff-driver/update-info/${id}`,
      driver
    );
  }
  updateTruckInfo(truck: any, id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}admin/truck/update-info/${id}`,
      truck
    );
  }
  getLoadInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/load-info/${userId}`);
  }
  getAllPayments(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/payments`);
  }
  getPayment(loadId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/payments/${loadId}`);
  }
}
