import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShipperService {
  // private baseUrl = 'http://localhost:4000/';
  private baseUrl =
    'https://ac385a1c747ba4795a44cab8e15e55d4-563323433.eu-north-1.elb.amazonaws.com/';
  http = inject(HttpClient);
  constructor() {}
  addClients(client: any): Observable<any> {
    return this.http.post(`${this.baseUrl}shipper/add-client`, client);
  }
  addLoad(load: any): Observable<any> {
    return this.http.post(`${this.baseUrl}shipper/add-load`, load);
  }
  addPickupAddress(ShipperAddress: any): Observable<any> {
    return this.http.post(`${this.baseUrl}shipper/add-pickup`, ShipperAddress);
  }

  getAllStaffs(): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/staffs`);
  }
  getAllPayments(): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/payments`);
  }
  getPayment(loadId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/payments/${loadId}`);
  }

  getAllCarriers(): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/carriers`);
  }
  getAllPickups(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/pick-ups/${userId}`);
  }
  getAllClients(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/clients/${userId}`);
  }

  getAllShipperBids(): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/bids`);
  }
  getAllShipments(): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/shipments`);
  }
  getShipperInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/get-shipper/${userId}`);
  }
  getLoadInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/load-info/${userId}`);
  }
  getClientInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/client-info/${userId}`);
  }
  getPickupInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/pickup-info/${userId}`);
  }

  fetchCarrierInfo(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}shipper/get-carrier/${userId}`);
  }
  updateLoadInfo(userId: string, bidId: any): Observable<any> {
    console.log(bidId);

    return this.http.post(
      `${this.baseUrl}shipper/update-load-info/${userId}`,
      bidId
    );
  }
  // updateLoadStatus(userId: string, status: string): Observable<any> {
  //   return this.http.post(
  //     `${this.baseUrl}shipper/update-load-status/${userId}`,
  //     status
  //   );
  // }
  // Create Razorpay Order on the backend
  createRazorpayOrder(
    amount: number,
    loadId: string,
    shipperId: string,
    carrierId: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}shipper/create-razorpay-order`, {
      amount,
      loadId,
      shipperId,
      carrierId,
    });
  }

  // Verify Payment (send details to the backend for verification)
  verifyPayment(paymentDetails: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}shipper/verify-payment`,
      paymentDetails
    );
  }
  deleteShipperResource(userId: string, target: string): Observable<any> {
    console.log(target);

    return this.http.post(`${this.baseUrl}shipper/delete-resource/${userId}`, {
      target: target,
    });
  }
}
