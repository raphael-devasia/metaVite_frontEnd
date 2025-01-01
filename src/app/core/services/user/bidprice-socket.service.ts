import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BidpriceSocketService {
  socket: any;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private lowestBidSubject = new BehaviorSubject<number | null>(null);
  public lowestBid$ = this.lowestBidSubject.asObservable();

  constructor() {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    try {
      if (this.socket) {
        this.socket.disconnect();
      }

      this.socket = io(environment.SOCKET_ENDPOINT2, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        withCredentials: true,
        extraHeaders: {
          'Content-Type': 'application/json',
        },
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully');
        this.connectionStatus.next(true);
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('Socket connection error:', error);
        this.connectionStatus.next(false);
      });

      // Listening to the 'lowestBidUpdate' event
     this.socket.on('lowestBidUpdate', (data: any) => {
       console.log('Lowest bid updated:', data);
       // Update the lowest bid in your application
       this.lowestBidSubject.next(data);
     });

      this.socket.on('disconnect', (reason: string) => {
        console.log('Socket disconnected:', reason);
        this.connectionStatus.next(false);
      });
    } catch (error) {
      console.error('Error setting up socket connection:', error);
      this.connectionStatus.next(false);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connectionStatus.next(false);
    }
  }
}
