import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: any;

  constructor() {
    this.setupSocketConnection();
  }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      // secure: true,
      // rejectUnauthorized: false,
      path: '/chat/socket.io', // This should match the path in both API Gateway and backend
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    // Listen for broadcast messages
    this.socket.on('my broadcast', (data: string) => {
      console.log('Broadcast received:', data);
    });
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
