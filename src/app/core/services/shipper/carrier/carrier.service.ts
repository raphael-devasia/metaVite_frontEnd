import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invitation } from '../../../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class CarrierService {
  // private baseUrl = 'http://localhost:4000/';
  private baseUrl = 'http://metavite.ddns.net/';

  http = inject(HttpClient);
  constructor() {}
  addClients(client: any): Observable<any> {
    return this.http.post(`${this.baseUrl}carrier/add-client`, client);
  }
  addLoad(load: any): Observable<any> {
    return this.http.post(`${this.baseUrl}carrier/add-load`, load);
  }
  addPickupAddress(ShipperAddress: any): Observable<any> {
    return this.http.post(`${this.baseUrl}carrier/add-pickup`, ShipperAddress);
  }

  getAllStaffs(): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/staffs`);
  }

  getAllCarriers(): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/carriers`);
  }
  getAllPickups(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/pick-ups/${userId}`);
  }
  getAllClients(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/clients/${userId}`);
  }

  getAllBids(refId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/bids/${refId}`);
  }
  getActiveBids(refId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/active-bids/${refId}`);
  }
  getAllShipments(): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/shipments`);
  }
  getShipperInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/get-carrier/${userId}`);
  }
  getLoadInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/load-info/${userId}`);
  }
  inviteDriver(driver: Invitation): Observable<any> {
    return this.http.post(`${this.baseUrl}carrier/invite-driver`, driver);
  }
  getAllDrivers(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/get-drivers/${userId}`);
  }
  getAllTrucks(refId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/trucks/${refId}`);
  }

  addNewTruck(truck: any): Observable<any> {
    return this.http.post(`${this.baseUrl}carrier/add-truck`, truck);
  }
  fetchShipperInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/get-shipper/${userId}`);
  }
  postBid(bid: any): Observable<any> {
    return this.http.post(`${this.baseUrl}carrier/post-bid`, bid);
  }
  getAllCarrierLoads(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/shipments/${id}`);
  }
  getTruckInfo(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/truck/${id}`);
  }
  getAllPayments(): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/payments`);
  }
  getPayment(loadId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}carrier/payments/${loadId}`);
  }
  updateLoadInfo(userId: string, bidId: any): Observable<any> {
    console.log(bidId);

    return this.http.post(
      `${this.baseUrl}carrier/update-load-info/${userId}`,
      bidId
    );
  }
  updateCompanyInfo(userId: string, data: any): Observable<any> {
    console.log(data);

    return this.http.post(
      `${this.baseUrl}carrier/update-carrier-info/${userId}`,
      data
    );
  }
}
