import {
  Component,
  inject,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SocketioService } from '../../../core/services/socketio.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../../../shared/services/data.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { Router } from '@angular/router';
import { CarrierService } from '../../../core/services/shipper/carrier/carrier.service';
import { ShipperService } from '../../../core/services/shipper/shipper.service';
interface Message {
  senderId: string;
  recipientId: string;
  message: string;
  isMine: boolean;
  timestamp: string;
  chatId: string;
}


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnDestroy {
  localStorageServices = inject(LocalstorageService);
  carrierServices = inject(CarrierService);
  shipperServices = inject(ShipperService);
  title = 'socketio-angular';
  messagedUsers: any[] = []; // List of users you’ve messaged
  @Input() chatUser!: string;
  messages: Message[] = []; // Chat messages
  newMessage: string = ''; // User input message
  user: any;
  selectedUserDetails: any = null; // Details of the selected user
  selectedContact: any; // Currently selected user
  selectedContactName:string='No User Selected'
  currentUserId!: string; // Replace with the actual user ID

  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private socketService: SocketioService,
    @Inject(DataService) private dataService: DataService
  ) {}

  ngOnInit() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/carrier/admin/dashboard')) {
      this.user = this.localStorageServices.getCarrierAdminData();
    } else if (currentUrl.includes('/carrier/driver/dashboard')) {
      this.user = this.localStorageServices.getDriverData();
    } else if (currentUrl.includes('/shipper/admin/dashboard')) {
      this.user = this.localStorageServices.getShipperAdminData();
    } else if (currentUrl.includes('/admin/dashboard')) {
      this.user = this.localStorageServices.getAppAdminData();
    }
    this.currentUserId = this.user._id;
    console.log('the current user id is ',this.currentUserId);

    console.log('Initializing socket connection...');
    this.socketService.connected$.subscribe((isConnected) =>
      console.log('Socket connection status:', isConnected)
    );
    this.socketService.setupSocketConnection();
    
    // Initialize the socket connection
    // this.socketService.setupSocketConnection();
    this.socketService.loginUser(this.currentUserId);
    // Subscribe to incoming messages
   


    // Fetch the list of messaged users
    this.fetchMessagedUsers();
     this.listenForMessages();
   
    
  }
  ngOnChanges(changes: SimpleChanges) {
    // Detect changes in chatUser and respond
    if (changes['chatUser'] && changes['chatUser'].currentValue) {
      this.loadSelectedUserDetails();
      this.loadPreviousMessages();
    }
  }
  // Fetch the selected user's details from the database
  loadSelectedUserDetails() {
    
    
    if (this.chatUser) {
      const currentUrl = this.router.url;

      if (currentUrl.includes('/carrier/admin/dashboard')) {
        // Use DataService or SocketioService to fetch user details
        this.carrierServices.fetchShipperInfo(this.chatUser).subscribe(
          (userDetails) => {
            this.selectedUserDetails = userDetails.user;
            console.log(this.selectedUserDetails);
            this.selectedContactName = ` ${userDetails.user.name.firstName} ${userDetails.user.name.lastName}`;
           
          },
          (error) => {
            console.error('Error fetching user details:', error);
          }
        );
      } else if (currentUrl.includes('/shipper/admin/dashboard')) {
        // Use DataService or SocketioService to fetch user details
        this.shipperServices.fetchCarrierInfo(this.chatUser).subscribe(
          (userDetails) => {
            this.selectedUserDetails = userDetails.user;
            console.log('Selected User Details:', this.selectedUserDetails);
          },
          (error) => {
            console.error('Error fetching user details:', error);
          }
        );
      } else if (currentUrl.includes('/admin/dashboard')) {
        console.log('for later');
      }
    }
  }
  // Fetch previous messages between the logged-in user and the selected user
  loadPreviousMessages() {
    this.messages = []; 
    this.socketService.fetchPreviousMessages(this.chatUser);

    const chatSubscription = this.socketService
      .onReceivePreviousMessages()
      .subscribe((data) => {
       
        
        this.messages = data.messages.map((msg: any) => ({
          ...msg,
          isMine: msg.senderId === this.currentUserId,
        }));
         console.log('the previous messages are ', this.messages);
      });
      

    this.subscriptions.add(chatSubscription);
  }

  // Send a message to the selected user
  sendMessage() {
    
    if (this.newMessage.trim() && this.selectedUserDetails._id) {
     const messageData = {
       senderId: this.currentUserId,
       recipientId: this.selectedUserDetails._id,
       message: this.newMessage,
       senderDetails: this.user,
       receiverDetails: this.selectedUserDetails,
       timestamp: new Date().toISOString(), // Add the current timestamp
       chatId: `${this.currentUserId}_${this.selectedUserDetails._id}`, // Generate the chatId
     };

      console.log(messageData);

      // Emit the message to the server
      this.socketService.sendMessage(messageData);
      

    const { senderDetails, receiverDetails, ...messageToSend } = messageData;
      // Add the message to the local list as a sent message
      this.messages.push({ ...messageToSend, isMine: true });
      console.log(this.messages);
      


      // Clear the input field
      this.newMessage = '';
    }
  }

  // Listen for incoming messages
  listenForMessages() {
    const messageSubscription = this.socketService
      .onReceiveMessage()
      .subscribe((data) => {
       

      
     

        if (data.recipientId === this.currentUserId) {
          

          this.messages.push({ ...data, isMine: false });
        } else {
          // Optionally handle notifications for messages from other users
          console.log('New message from another user:', data);
        }
      });

    this.subscriptions.add(messageSubscription);
  }

  // Load chat with a selected user
  selectContact(contact: any) {
    console.log(contact);
    this.selectedContactName= contact.name
    // this.selectedContact = contact;
    this.selectedUserDetails = contact;
    this.chatUser = contact._id
    this.messages = []; // Clear current messages

    // Fetch the previous messages for the selected contact
    this.socketService.fetchPreviousMessages(contact._id);
    const chatSubscription = this.socketService
      .onReceivePreviousMessages()
      .subscribe((data) => {
        this.messages = data.messages.map((msg: any) => ({
          ...msg,
          isMine: msg.senderId === this.currentUserId,
        }));
      });

    this.subscriptions.add(chatSubscription);
  }

  // Fetch the list of users you’ve messaged
  fetchMessagedUsers() {
    const usersSubscription = this.socketService
      .onGetMessagedUsers()
      .subscribe((users) => {
        console.log('this function is fetch users the result', users.users);
        
        this.messagedUsers = users.users;
      });

    this.subscriptions.add(usersSubscription);
  }

  ngOnDestroy() {
    // Disconnect the socket connection and unsubscribe from all observables
    this.socketService.disconnect();
    this.subscriptions.unsubscribe();
  }
}
