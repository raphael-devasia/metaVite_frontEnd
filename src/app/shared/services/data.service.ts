import { inject, Injectable } from '@angular/core';
import { map, Observable, of, Subject } from 'rxjs';
import { ShipperService } from '../../core/services/shipper/shipper.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  ShipperServices = inject(ShipperService);
  private dataSubject = new Subject<any>(); // For general data
  private driverDataSubject = new Subject<any>(); // For driver-specific data
  private clientDataSubject = new Subject<any>(); // For driver-specific data
  private chatSubject = new Subject<any>(); // For chat-specific data

  data$ = this.dataSubject.asObservable();
  driverData$ = this.driverDataSubject.asObservable();
  clientData$ = this.clientDataSubject.asObservable();
  chatData$ = this.chatSubject.asObservable();

  // Method to send general data
  sendChat(data: any) {
    
    
    this.chatSubject.next(data);
  }

  // Method to send general data
  sendData(data: any) {
    this.dataSubject.next(data);
  }

  // Method to send driver data
  sendDriverData(data: any) {
    this.driverDataSubject.next(data);
  }
  // Simulate sending client data (e.g., to a server)
  // sendClientData(data: any): Observable<any> {
  //     this.clientDataSubject.next(data);
  //   console.log('Sending client data:', data);

  //   return of({ success: true, message: 'Client data saved successfully' }); // Replace with HTTP API call if needed
  // }

  sendClientData(data: any): Observable<any> {
    this.clientDataSubject.next(data); // Emit the client data
    console.log('Received data for processing:', data);

    if (!data || !data.identifier) {
      console.error('Invalid data format. Missing identifier.');
      return new Observable((observer) => {
        observer.error(new Error('Invalid data format. Missing identifier.'));
      });
    }

    switch (data.identifier) {
      case 'Add a Pick-up Location':
        return this.ShipperServices.addPickupAddress(data.data).pipe(
          map((response: any) => {
            if (response.success) {
              console.log('Pick-Up added successfully:', response);
              return response;
            } else {
              console.error('Failed to add pick-up:', response.message);
              throw new Error(response.message);
            }
          })
        );
      case 'Pickup Details':
        return this.ShipperServices.addPickupAddress(data.data).pipe(
          map((response: any) => {
            if (response.success) {
              console.log('Pick-Up added successfully:', response);
              return response;
            } else {
              console.error('Failed to add pick-up:', response.message);
              throw new Error(response.message);
            }
          })
        );

      case 'Add a Client':
        console.log('Sending client data:', data.data);
        return this.ShipperServices.addClients(data.data).pipe(
          map((response: any) => {
            if (response.success) {
              console.log('Client added successfully:', response);
              return response;
            } else {
              console.error('Failed to add client:', response.message);
              throw new Error(response.message);
            }
          })
        );
      case 'Client Details':
        console.log('Sending client data:', data.data);
        return this.ShipperServices.addClients(data.data).pipe(
          map((response: any) => {
            if (response.success) {
              console.log('Client added successfully:', response);
              return response;
            } else {
              console.error('Failed to add client:', response.message);
              throw new Error(response.message);
            }
          })
        );

      default:
        console.error(`Unknown identifier: ${data.identifier}`);
        return new Observable((observer) => {
          observer.error(
            new Error(`Unsupported identifier: ${data.identifier}`)
          );
        });
    }
  }
}


