import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket!: Socket;
  private connected = new BehaviorSubject<boolean>(false);
  connected$ = this.connected.asObservable();

  constructor() {
    this.setupSocketConnection();
  }

  // setupSocketConnection() {
  //   this.socket = io(environment.SOCKET_ENDPOINT, {
  //     secure: true,
  //     rejectUnauthorized: false,
  //   });

  //   // Listen for broadcast messages
  //   this.socket.on('my broadcast', (data: string) => {
  //     console.log('Broadcast received:', data);
  //   });
  // }

  setupSocketConnection() {
    try {
      // Match the ingress path configuration
      const socketUrl = 'https://metavite.ddns.net'; // Use HTTPS for initial connection

      this.socket = io(socketUrl, {
        path: '/socketiochat/socket.io', // Match your ingress path
        secure: true,
        rejectUnauthorized: false,
        transports: ['websocket', 'polling'], // Match server configuration
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        withCredentials: true, // Enable CORS credentials
      });

      this.socket.on('connect', () => {
        console.log('Socket connected successfully', this.socket.id);
        this.connected.next(true);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.connected.next(false);
      });
    } catch (error) {
      console.error('Error setting up socket connection:', error);
    }
  }

  onLowestBidUpdate(callback: (data: any) => void): void {
    this.socket.on('lowestBidUpdate', callback);
  }

  sendMessage(message: {
    senderId: string;
    recipientId: string;
    message: string;
  }) {
    console.log(message);

    if (this.socket) {
      this.socket.emit('my message', message);
    }
  }
  loginUser(userId: string) {
    console.log(userId);

    if (this.socket) {
      this.socket.emit('login', userId);
    }
  }

  // Listen for received messages
  onReceiveMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (data: any) => {
        observer.next(data);
      });
    });
  }
  // Fetch the list of messaged users
  onGetMessagedUsers(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('update_messaged_users', (data: any) => {
        console.log(data);

        observer.next(data);
      });
    });
  }
  // Emit to fetch previous messages
  fetchPreviousMessages(chatId: string) {
    this.socket.emit('fetch_messages', { chatId });
  }

  // Listen for previous messages
  onReceivePreviousMessages(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('previous_messages', (data: any) => {
        observer.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
