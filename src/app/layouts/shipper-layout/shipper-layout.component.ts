import {
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { DataService } from '../../shared/services/data.service';
import { UserService } from '../../core/services/user/user.service';
import { DriverService } from '../driver-layout/services/driver.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, pipe, Subscription, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../shared/components/form/form.component';
import { ShipperService } from '../../core/services/shipper/shipper.service';
import { LocalstorageService } from '../../core/services/localstorage.service';
import { ChatComponent } from '../../features/chat/chat/chat.component';
import { act } from '@ngrx/effects';
import { AdressModalComponent } from '../../shared/components/adress-modal/adress-modal.component';
import { Router } from '@angular/router';
import { DeleteModalComponent } from '../../shared/components/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { DashboardComponent } from '../../shared/components/dashboard/dashboard.component';
import { forkJoin } from 'rxjs';
import { SocketioService } from '../../core/services/socketio.service';
import { BidpriceSocketService } from '../../core/services/user/bidprice-socket.service';



interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
}
interface Bid {
  _id: string;
  loadId: string;
  dropCity: string;
  commodity: string;
  vehicleType: string;
  trailerType: string;
  basePrice: string;
  lowestBid: string;
  status: string;
}


@Component({
  selector: 'app-shipper-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    TableComponent,
    CommonModule,
    FormComponent,
    ChatComponent,
    AdressModalComponent,
    DeleteModalComponent,
    DashboardComponent,
  ],
  templateUrl: './shipper-layout.component.html',
  styleUrl: './shipper-layout.component.css',
})
export class ShipperLayoutComponent implements OnInit {
  constructor(
    @Inject(DataService) private dataService: DataService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}
  UserServices = inject(UserService);
  ShipperServices = inject(ShipperService);
  localStorageServices = inject(LocalstorageService);
  driverData = inject(DriverService);
  private fb = inject(FormBuilder);
  userStatus: string = 'Active';
  isDriver: boolean = false;
  role: string = 'shipperAdmin';
  shipperId: string = '';
  isChatActive: boolean = false;
  chatUser!: string;
  selectedComponent: string = 'Dashboard';
  currentAction: string = '';
  showForm: boolean = false;
  showModal: boolean = false;
  showClientModal: boolean = false;
  showPickupModal: boolean = false;
  showDeleteModal: boolean = false;
  modalHeading: string = '';
  targetId!: string;
  action!: string;
  lowestBid: number | null = null;
  dashBoardData: any;

  companyInformation: FormField[] = [
    {
      id: 'companyName',
      label: 'Company Name',
      type: 'text',
      placeholder: 'Enter First Company Name',
    },

    {
      id: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter Email',
      disabled: true,
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      placeholder: 'Enter Phone Number',
    },
    {
      id: 'companyRefId',
      label: 'Company Reference ID',
      type: 'text',
      placeholder: 'Enter Company Reference ID',
      disabled: true,
    },
  ];

  bankDetails: FormField[] = [
    {
      id: 'bankName',
      label: 'Bank Name',
      type: 'text',
      placeholder: 'Enter Bank Name',
    },
    {
      id: 'ifscCode',
      label: 'IFSC Code',
      type: 'text',
      placeholder: 'Enter IFSC Code',
    },
    {
      id: 'accountNumber',
      label: 'Account Number',
      type: 'text',
      placeholder: 'Enter Account Number',
    },
  ];

  documents: FormField[] = [
    {
      id: 'idFile',
      label: 'ID File Upload',
      type: 'file',
      placeholder: 'Upload ID',
    },
    {
      id: 'contractFile',
      label: 'Contract File Upload',
      type: 'file',
      placeholder: 'Upload Contract',
    },
  ];

  address: FormField[] = [
    {
      id: 'addressLine1',
      label: 'Address Line 1',
      type: 'text',
      placeholder: 'Enter Address Line 1',
    },
    {
      id: 'addressLine2',
      label: 'Address Line 2',
      type: 'text',
      placeholder: 'Enter Address Line 2',
    },
    { id: 'city', label: 'City', type: 'text', placeholder: 'Enter City' },
    { id: 'state', label: 'State', type: 'text', placeholder: 'Enter State' },
    {
      id: 'postalCode',
      label: 'Postal Code',
      type: 'text',
      placeholder: 'Enter Postal Code',
    },
  ];

  personalInfoForm: FormGroup = this.fb.group({
    companyName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],
    phoneNumber: ['', Validators.required],
    companyRefId: [{ value: '', disabled: true }, Validators.required],

    emergencyContactName: ['', Validators.required],
    emergencyNumber: ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],

    notes: [''],
  });
  FetchedInfoForm = this.fb.group({
    companyName: ['', Validators.required],
    address: this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
    }),
    contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    contactPerson: ['', Validators.required],
    _id: [''],
    companyRefId: [this.shipperId, Validators.required],
  });

  // UI Management
  buttonTexts = [
    { text: 'Dashboard', icon: 'dashboard' },
    { text: 'All Bids', icon: 'gavel' },
    { text: 'Shipments', icon: 'local_shipping' },
    { text: 'Customers', icon: 'people' },
    { text: 'Pick-up Locations', icon: 'location_on' },
    { text: 'Payments', icon: 'payment' },
    { text: 'Log Out', icon: 'logout' },
  ];

  bidTableData = {
    title: 'All Bids',
    button: 'Add New Load',
    statuses: ['Open ', 'Closed'],
    tableHeads: [
      'Load ID',
      'Drop City',
      'Commodity',
      'Vehicle Body',
      'Trailer Type',

      'Base Price',
      'Lowest Bid',
      'Status',
      'Actions',
    ],
    tableData: [] as Bid[],
  };
  bidTableData1 = {
    title: 'All Bids',
    button: 'Add New Load',
    statuses: ['Open ', 'Closed'],
    tableHeads: [
      'Load ID',
      'Drop City',
      'Commodity',
      'Vehicle Body',
      'Trailer Type',

      'Base Price',
      'Lowest Bid',
      'Status',
      'Actions',
    ],
    tableData: [] as Bid[],
  };
  shipmentTableData = {
    title: 'All Shipments',
    button: 'Add New Load',
    statuses: ['Assigned ', 'Dispatched', 'Delivered'],
    tableHeads: [
      'Load ID',
      'Drop City',
      'Commodity',
      'Carrier ID',
      'Pickup Date',

      'Base Price',
      'Bid Price',
      'Status',
      'Actions',
    ],
    tableData: [],
  };
  shipmentTableData1 = {
    title: 'All Shipments',
    button: 'Add New Load',
    statuses: ['Assigned ', 'Dispatched', 'Delivered'],
    tableHeads: [
      'Load ID',
      'Drop City',
      'Commodity',
      'Carrier Name',
      'Pickup Date',

      'Base Price',
      'Bid Price',
      'Status',
      'Actions',
    ],
    tableData: [],
  };
  clientTableData = {
    title: 'All Clients',
    button: 'Add New Client',
    statuses: [],
    tableHeads: [
      'Client Name',
      'Client City',
      'Address',
      'Contact Person',
      'Contact Number',
      '',
      'Actions',
    ],
    tableData: [],
  };
  clientTableData1 = {
    title: 'All Clients',
    button: 'Add New Client',
    statuses: [],
    tableHeads: [
      'Client Name',
      'Client City',
      'Address',
      'Contact Person',
      'Contact Number',
      '',
      'Actions',
    ],
    tableData: [],
  };
  pickupTableData = {
    title: 'All Pickups',
    button: 'Add New Pick-up',
    statuses: [],
    tableHeads: [
      'Client Name',
      'Client City',
      'Address',
      'Contact Person',
      'Contact Number',
      '',
      'Actions',
    ],
    tableData: [],
  };
  pickupTableData1 = {
    title: 'All Pickups',
    button: 'Add New Pick-up',
    statuses: [],
    tableHeads: [
      'Client Name',
      'Client City',
      'Address',
      'Contact Person',
      'Contact Number',
      '',
      'Actions',
    ],
    tableData: [],
  };
  paymentTableData = {
    title: 'All Payments',
    button: '',
    statuses: [],
    tableHeads: [
      'Load Id',
      'Pick-Up City',
      'Carrier Name',
      'Carrier Ref_id',
      'Amount',
      'payment Status',
      'Action',
    ],
    tableData: [],
  };

  onSidebarButtonClick(component: string) {
    if (component === 'All Bids') {
      this.UserServices.getAllShipperBids(this.shipperId)
        .pipe(
          tap((bids: any) => {
            // Populate driverTableData with the fetched drivers
            console.log(bids.bids);
            const data = bids.bids;

            // Filter bids where status is not "Open" or "Closed"
            const filteredData = data.filter(
              (bid: any) => bid.status === 'Open' || bid.status === 'Closed'
            );
            this.bidTableData = {
              ...this.bidTableData,
              tableData: filteredData.map((bid: any) => ({
                loadId: bid.loadId || '',
                dropCity: bid.dropoff1?.address?.city || '',
                commodity: bid.material || 'Unknown', // Add logic for status if not in data
                vehicleType: bid.vehicleBody || '',
                trailerType: bid.vehicleType || '',
                basePrice: bid.basePrice || '',
                lowestBid: bid.lowestPrice || '--',
                _id: bid._id,
                status: bid.status,
              })),
            };
          })
        )
        .subscribe({
          next: () => {
            console.log(this.bidTableData);
            // Only update these after data is received
            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
          },
          error: (err) => {
            console.error('Error fetching bids', err);
          },
        });
    }

    if (component === 'Shipments') {
      this.selectedComponent = component;
      this.UserServices.getAllShipperBids(this.shipperId)
        .pipe(
          tap((bids: any) => {
            // Populate driverTableData with the fetched drivers
            console.log(bids.bids);
            const data = bids.bids;

            // Filter bids where status is not "Open" or "Closed"
            const filteredData = data.filter(
              (bid: any) =>
                bid.status === 'Assigned' ||
                bid.status === 'Dispatched' ||
                bid.status === 'Delivered' ||
                bid.status === 'Picked' ||
                bid.status === 'Delivered1' ||
                bid.status === 'Delivered2' ||
                bid.status === 'Delivered3' ||
                bid.status === 'Delivered' ||
                bid.status === 'Delivered1-Partial' ||
                bid.status === 'Delivered2-Partial' ||
                bid.status === 'Delivered3-Partial' ||
                bid.status === 'Delivered' ||
                bid.status === 'Completed'
            );
            this.shipmentTableData = {
              ...this.shipmentTableData,
              tableData: filteredData.map((bid: any) => ({
                loadId: bid.loadId || '',
                dropCity: bid.dropoff1?.address?.city || '',
                commodity: bid.material || 'Unknown', // Add logic for status if not in data
                carrierId: bid.bidCarrier || '',
                pickUpdate: this.getReadableDate(bid.dispatchDateTime) || '',
                basePrice: bid.basePrice || '',
                lowestBid: bid.lowestPrice || '--',
                status: bid.status,
                _id: bid._id,
              })),
            };
          })
        )
        .subscribe({
          next: () => {
            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
          },
          error: (err) => {},
        });
    }
    if (component === 'Customers') {
      this.selectedComponent = component;
      this.ShipperServices.getAllClients(this.shipperId)
        .pipe(
          tap((clients: any) => {
            // Populate driverTableData with the fetched drivers
            console.log('the clients are ', clients);

            this.clientTableData = {
              ...this.clientTableData,
              tableData: clients.map((client: any) => ({
                clientName: client.companyName || '',
                clientCity: client.address.city || '',

                clientAddress: client.address.addressLine1 || '',
                contactPerson: client.contactPerson || '',
                contactNumber: client.contactNumber || '',
                id: client._id,

                // status: client.status || 'Unknown',
              })),
            };
          })
        )
        .subscribe({
          next: () => {
            // Proceed only after driverTableData has been populated

            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
          },
          error: (err) => {
            console.error('Failed to fetch customers:', err);
          },
        });
    }
    if (component === 'Pick-up Locations') {
      this.selectedComponent = component;
      this.ShipperServices.getAllPickups(this.shipperId)
        .pipe(
          tap((clients: any) => {
            // Populate driverTableData with the fetched drivers
            console.log('the pickups are ', clients);

            this.pickupTableData = {
              ...this.pickupTableData,
              tableData: clients.map((client: any) => ({
                clientName: client.companyName || '',
                clientCity: client.address.city || '',

                clientAddress: client.address.addressLine1 || '',
                contactPerson: client.contactPerson || '',
                contactNumber: client.contactNumber || '',
                id: client._id,

                // status: client.status || 'Unknown',
              })),
            };
          })
        )
        .subscribe({
          next: () => {
            // Proceed only after driverTableData has been populated

            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
          },
          error: (err) => {
            console.error('Failed to fetch customers:', err);
          },
        });
    }
    if (component === 'Payments') {
      this.ShipperServices.getAllPayments()
        .pipe(
          tap((payments: any) => {
            // Populate driverTableData with the fetched drivers

            // Filter payments by shipperId
            const filteredPayments = payments.payments.filter(
              (payment: any) => payment.shipperId === this.shipperId
            );
            console.log(filteredPayments[0]);

            this.paymentTableData = {
              ...this.paymentTableData,
              tableData: filteredPayments.map((payment: any) => ({
                loadId: payment?.loadDetails?.loadId || '',
                destinationCity:
                  payment?.loadDetails?.pickupLocation?.address?.city || '',
                carrierName: payment?.loadDetails?.bidCarrier || '',
                carrierRefId: payment.carrierId || '',
                amount: payment.amount || '',
                paymentStatus: payment.status || 'Unknown',
                id: payment.loadId,

                // status: client.status || 'Unknown',
              })),
            };
          })
        )
        .subscribe({
          next: () => {
            // Proceed only after driverTableData has been populated

            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
          },
          error: (err) => {
            console.error('Failed to fetch customers:', err);
          },
        });
    }
    if (component === 'Company Details') {
      this.selectedComponent = component;
      this.ShipperServices.getShipperInfo(this.shipperId).subscribe(
        (data) => {
          if (data.success) {
            const user = data.user;
            console.log(user);

            this.userStatus = user.status;

            this.personalInfoForm.patchValue({
              email: user.companyDetails.companyEmail,
              phoneNumber: user.companyDetails.companyPhone || '',
              companyRefId: user.companyRefId,
              companyName: user.companyDetails
                ? user.companyDetails.companyName
                : '',
              emergencyContactName: user.personalDetails.emergencyContact.name,
              emergencyNumber:
                user.personalDetails.emergencyContact.phoneNumber,
              addressLine1: user.companyDetails.address.addressLine1,
              addressLine2: user.companyDetails.address.addressLine2,
              city: user.companyDetails.address.city,
              state: user.companyDetails.address.state,
              postalCode: user.companyDetails.address.postalCode,
            });
          }
          this.showForm = true;
        },
        (error) => {
          console.error('Failed to fetch driver data', error);
        }
      );
    }
    if (component === 'Log Out') {
      localStorage.removeItem('shipperAdminToken');
      localStorage.removeItem('shipperAdminData');
      this.router.navigate(['/shipper']);
    }

    if (component === 'Dashboard') {
      // Fetching multiple API calls in parallel using forkJoin
      forkJoin({
        bids: this.UserServices.getAllShipperBids(this.shipperId),
        clients: this.ShipperServices.getAllClients(this.shipperId),
        pickups: this.ShipperServices.getAllPickups(this.shipperId),
        payments: this.ShipperServices.getAllPayments(),
      })
        .pipe(
          tap(({ bids, clients, pickups, payments }) => {
            // Handle Bids Data (Open and Closed Bids)
            if (bids && bids.bids) {
              const data = bids.bids;

              // Closed Bids
              const closedBids = data
                .filter((bid: any) => bid.status === 'Closed')
                .slice(0, 5);
              this.bidTableData1 = {
                title: 'Closed Bids',
                button: 'See All Bids',
                statuses: ['Closed'],
                tableHeads: [
                  'Load ID',
                  'Drop City',
                  'Commodity',
                  'Vehicle Body',
                  'Trailer Type',
                  'Base Price',
                  'Lowest Bid',
                ],
                tableData: closedBids.map((bid: any) => ({
                  loadId: bid.loadId || '',
                  dropCity: bid.dropoff1?.address?.city || '',
                  commodity: bid.material || 'Unknown',
                  vehicleType: bid.vehicleBody || '',
                  trailerType: bid.vehicleType || '',
                  basePrice: bid.basePrice || '',
                  lowestBid: bid.basePrice || '',
                })),
              };

              // Shipments on Transport
              const shipmentBids = data
                .filter(
                  (bid: any) =>
                    bid.status === 'Assigned' ||
                    bid.status === 'Dispatched' ||
                    bid.status === 'Delivered'
                )
                .slice(0, 5);
              this.shipmentTableData1 = {
                title: 'Shipments on Transport',
                button: 'See All Shipments',
                statuses: ['Closed'],
                tableHeads: [
                  'Load ID',
                  'Drop City',
                  'Commodity',
                  'Vehicle Body',
                  'Trailer Type',
                  'Base Price',
                  'Lowest Bid',
                ],
                tableData: shipmentBids.map((bid: any) => ({
                  loadId: bid.loadId || '',
                  dropCity: bid.dropoff1?.address?.city || '',
                  commodity: bid.material || 'Unknown',
                  vehicleType: bid.vehicleBody || '',
                  trailerType: bid.vehicleType || '',
                  basePrice: bid.basePrice || '',
                  lowestBid: bid.basePrice || '',
                })),
              };
            }

            // Handle Clients Data (Recently Added Clients)
            if (clients) {
              const recentClients = clients.slice(0, 5);
              this.clientTableData1 = {
                title: 'Recently Added Clients',
                button: 'See All Clients',
                statuses: [],
                tableHeads: [
                  'Client Name',
                  'City',

                  'Contact Person',
                  'Contact Number',
                ],
                tableData: recentClients.map((client: any) => ({
                  clientName: client.companyName || '',
                  clientCity: client.address.city || '',

                  contactPerson: client.contactPerson || '',
                  contactNumber: client.contactNumber || '',
                })),
              };
            }

            // Handle Pickups Data (Recently Added Pickups)
            if (pickups) {
              const recentPickups = pickups.slice(0, 5);
              this.pickupTableData1 = {
                title: 'Recently Added Pickups',
                button: 'See All Pickups',
                statuses: [],
                tableHeads: [
                  'Client Name',
                  'City',

                  'Contact Person',
                  'Contact Number',
                ],
                tableData: recentPickups.map((pickup: any) => ({
                  clientName: pickup.companyName || '',
                  clientCity: pickup.address.city || '',

                  contactPerson: pickup.contactPerson || '',
                  contactNumber: pickup.contactNumber || '',
                })),
              };
            }
            if (payments) {
              console.log(payments);
              const data = payments.payments;
              this.dashBoardData = data.filter(
                (payment: any) => payment.shipperId === this.shipperId
              );
            }

            // Set selected component and hide modal/form
            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
          })
        )
        .subscribe({
          next: () => {
            console.log('Data fetched and processed successfully');
          },
          error: (err) => {
            console.error('Error fetching data', err);
          },
        });
    }
  }
  closeAddressModal() {
    this.showClientModal = false;
    this.showPickupModal = false;
    this.showDeleteModal = false;
    this.cdr.detectChanges();
  }
  saveClient(event: any) {}
  savePickup(event: any) {}
  handleAction(action: { action: string; id: string; item: string }) {
    this.currentAction = action.action;

    if (action.action === 'edit' || action.action === 'view') {
      const userId = action.id;
      if (userId) {
        console.log(action.item);
        if (action.item === 'All Clients') {
          this.ShipperServices.getClientInfo(userId).subscribe(
            (data) => {
              if (data.success) {
                console.log(data);

                const user = data.addresses;
                this.modalHeading = 'Client Details';

                // Patch the form with the fetched data
                this.FetchedInfoForm.patchValue({
                  companyName: user.companyName,
                  address: {
                    addressLine1: user.address.addressLine1,
                    addressLine2: user.address.addressLine2,
                    city: user.address.city,
                    state: user.address.state,
                    postalCode: user.address.postalCode,
                  },
                  contactNumber: user.contactNumber, // Ensure this maps correctly
                  contactPerson: user.contactPerson, // Ensure this maps correctly
                  companyRefId: user.companyRefId, // Ensure this maps correctly
                  _id: user._id,
                });
              }

              this.showForm = false;
              this.showModal = false;
              this.showClientModal = true;
            },
            (error) => {
              console.error('Failed to fetch driver data', error);
            }
          );
        }
        if (action.item === 'All Pickups') {
          this.ShipperServices.getPickupInfo(userId).subscribe(
            (data) => {
              if (data.success) {
                console.log(data);

                const user = data.addresses;
                this.modalHeading = 'Pickup Details';

                // Patch the form with the fetched data
                this.FetchedInfoForm.patchValue({
                  companyName: user.companyName,
                  address: {
                    addressLine1: user.address.addressLine1,
                    addressLine2: user.address.addressLine2,
                    city: user.address.city,
                    state: user.address.state,
                    postalCode: user.address.postalCode,
                  },
                  contactNumber: user.contactNumber, // Ensure this maps correctly
                  contactPerson: user.contactPerson, // Ensure this maps correctly
                  companyRefId: user.companyRefId, // Ensure this maps correctly
                  _id: user._id,
                });
              }

              this.showForm = false;
              this.showModal = false;
              this.showClientModal = true;
            },
            (error) => {
              console.error('Failed to fetch driver data', error);
            }
          );
        }
      } else {
        console.error('No user ID found in localStorage');
      }
      this.showForm = false;
      this.showModal = false;
      this.showClientModal = true;
    } else if (action.action === 'delete') {
      this.action = action.item;
      this.targetId = action.id;
      this.showModal = false;
      this.showForm = false;
      this.showDeleteModal = true;
    }
  }

  ngOnInit(): void {
    const user = this.localStorageServices.getShipperAdminData();
    this.shipperId = user._id;

    this.dataService.data$.subscribe((receivedData) => {
      if (receivedData === 'Customers') {
        this.onSidebarButtonClick(receivedData);
        console.log(receivedData);
      }
      if (receivedData === 'Dashboard') {
        this.onSidebarButtonClick(receivedData);
      }
      if (receivedData === 'All Bids') {
        this.onSidebarButtonClick(receivedData);
      }
      if (receivedData === 'Pick-up Locations') {
        this.onSidebarButtonClick(receivedData);
      }
      if (receivedData === 'Shipments') {
        this.onSidebarButtonClick(receivedData);
      } else {
        // this.handleAction(receivedData);
        console.log(receivedData);
        this.handleAction(receivedData);
      }
    });
    this.dataService.chatData$.subscribe((id) => {
      this.chatUser = id;
      this.isChatActive = true;
    });
    this.onSidebarButtonClick('Dashboard');
  }
  chatBoxToggle() {
    this.isChatActive = !this.isChatActive;
  }
  deleteResource(id: string, target: string) {
    this.ShipperServices.deleteShipperResource(id, target).subscribe({
      next: (data) => {
        console.log('Delete response:', data);

        if (data.success) {
          if (target === 'All Clients') {
            this.onSidebarButtonClick('Customers');
            this.toastr.success('Client deleted successfully.');
          } else if (target === 'All Pickups') {
            this.onSidebarButtonClick('Pick-up Locations');
            this.toastr.success('Pickup deleted successfully.');
          }
          this.showDeleteModal = false;
        } else {
          this.toastr.error(
            `Failed to delete the ${target.toLowerCase()}. ${data.message}`
          );
        }
      },
      error: (error) => {
        console.error('Error deleting resource:', error);
        this.toastr.error(
          `An error occurred while deleting the ${target.toLowerCase()}. Please try again later.`
        );
        this.showDeleteModal = false;
      },
    });
  }
  updateResource(target: string) {
    console.log(target);

    if (target === 'Client Details') {
      this.onSidebarButtonClick('Customers');
    } else if (target === 'Pickup Details') {
      console.log(target);

      console.log('the target is ', target === 'Pickup Details');
      this.onSidebarButtonClick('Pick-up Locations');
    }
  }
  getReadableDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }
}
