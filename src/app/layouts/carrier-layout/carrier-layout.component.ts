import { Component, inject, Inject } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InvitationFormComponent } from '../../shared/components/invitation-form/invitation-form.component';
import { Invitation } from '../../shared/models/user';

import { DataService } from '../../shared/services/data.service';
import { UserService } from '../../core/services/user/user.service';
import { ShipperService } from '../../core/services/shipper/shipper.service';
import { LocalstorageService } from '../../core/services/localstorage.service';
import { DriverService } from '../driver-layout/services/driver.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, tap } from 'rxjs';
import { FormComponent } from '../../shared/components/form/form.component';
import { CarrierService } from '../../core/services/shipper/carrier/carrier.service';
import { BiddingComponent } from '../../features/bidding/bidding/bidding.component';
import { VehicleFormComponent } from '../../shared/components/vehicle-form/vehicle-form.component';
import { ChatComponent } from '../../features/chat/chat/chat.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../../shared/components/delete-modal/delete-modal.component';
import { CarrierDashboardComponent } from '../../shared/components/carrier-dashboard/carrier-dashboard.component';
interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
}
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
  const day = date.getDate().toString().padStart(2, '0'); // Add leading zero

  return `${year}-${month}-${day}`;
}
type BidAction = { type: 'Bid' |'BidAgain'; data: string  };
type EditViewAction = { type: 'edit' | 'view'; data: string };
type DeleteAction = { type: 'delete'; data?: string };
type LegacyAction = { action: string; id: string; item: string };

// Union type to accept both structures
type Action = BidAction | EditViewAction | DeleteAction | LegacyAction;

@Component({
  selector: 'app-carrier-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    TableComponent,
    CommonModule,
    FormComponent,
    BiddingComponent,
    VehicleFormComponent,
    ChatComponent,
    DeleteModalComponent,
    CarrierDashboardComponent,
  ],
  templateUrl: './carrier-layout.component.html',
  styleUrl: './carrier-layout.component.css',
})
export class CarrierLayoutComponent {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    public carrierService: CarrierService,
    @Inject(DataService) private dataService: DataService
  ) {}
  buttonTexts = [
    { text: 'Dashboard', icon: 'dashboard' },
    { text: 'Search & Bid', icon: 'search' },
    { text: 'Active Bids', icon: 'gavel' },
    { text: 'Shipments', icon: 'local_shipping' },
    { text: 'Drivers', icon: 'person' },
    { text: 'Trucks', icon: 'local_shipping' },
    { text: 'Payments', icon: 'payment' },
    { text: 'Company Details', icon: 'payment' },
    { text: 'Log Out', icon: 'logout' },
  ];

  driverTableData = {
    title: 'Drivers',
    button: 'Add Driver',
    statuses: ['Active', 'Pending'],
    tableHeads: [
      'Name',
      'Email',
      'Phone',
      'Status',
      'UserID',
      'DOB',
      'Aadhar Number',
      'Actions',
    ],
    tableData: [],
  };
  selectedComponent: string = 'Dashboard';
  currentAction: string = '';
  showForm: boolean = false;
  showModal: boolean = false;
  showVehicleForm: boolean = false;
  showCompanyForm: boolean = false;

  UserServices = inject(UserService);
  ShipperServices = inject(ShipperService);
  localStorageServices = inject(LocalstorageService);
  driverData = inject(DriverService);
  isChatActive: boolean = false;
  private fb = inject(FormBuilder);
  userStatus: string = 'Active';
  isDriver: boolean = false;
  vehicleStatus!: string;
  role: string = 'carrierAdmin';
  dataToShow: string = 'Trucks';
  shipperId: string = '';
  carrierRefId: string = '';
  chatUser: string = '';
  formTitle!: string;
  action!: string;
  showDeleteModal: boolean = false;
  targetId!: string;
  target!: string;
  dashBoardData: any;
  personalInformation: FormField[] = [
    {
      id: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter First Name',
    },
    {
      id: 'lastName',
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter Last Name',
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
    {
      id: 'companyName',
      label: 'Company Name',
      type: 'text',
      placeholder: 'Enter Company Name',
      disabled: true,
    },
  ];
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
  additionalInformation: FormField[] = [
    {
      id: 'emergencyContactName',
      label: 'Emergency Contact Name',
      type: 'text',
      placeholder: 'Enter Emergency Contact Name',
    },
    {
      id: 'emergencyNumber',
      label: 'Emergency Contact Number',
      type: 'text',
      placeholder: 'Enter Emergency Contact Number',
    },
    {
      id: 'driversLicenseNumber',
      label: "Driver's License Number",
      type: 'text',
      placeholder: "Enter Driver's License Number",
    },
    {
      id: 'driversLicenseExpiry',
      label: 'License Expiry Date',
      type: 'date',
      placeholder: 'Enter License Expiry Date',
    },
    {
      id: 'aadharCardNumber',
      label: 'Aadhar Card Number',
      type: 'text',
      placeholder: 'Enter Aadhar Card Number',
    },
    {
      id: 'dateOfBirth',
      label: 'DOB',
      type: 'date',
      placeholder: 'Enter Your DOB ',
    },
  ];
  vehicleDetails: FormField[] = [
    {
      id: 'VehicleType',
      label: 'Vehicle Type',
      type: 'text',
      placeholder: 'Enter Vehicle Type',
    },
    {
      id: 'VehicleRegistrationNumber',
      label: 'Vehicle Registration Number',
      type: 'text',
      placeholder: 'Enter Vehicle Registration Number',
    },
    {
      id: 'VehicleColor',
      label: 'Vehicle Color',
      type: 'text',
      placeholder: 'Enter Vehicle Color',
    },
    {
      id: 'YearOfManufacture',
      label: 'Year of Manufacture',
      type: 'number',
      placeholder: 'Enter Year of Manufacture',
    },
  ];
  vehicleSpecifications: FormField[] = [
    {
      id: 'VehicleWeight',
      label: 'Vehicle Weight',
      type: 'number',
      placeholder: 'Enter Vehicle Weight (kg)',
    },
    {
      id: 'NumberOfAxles',
      label: 'Number of Axles',
      type: 'number',
      placeholder: 'Enter Number of Axles',
    },
    {
      id: 'VehicleCapacity',
      label: 'Vehicle Capacity',
      type: 'number',
      placeholder: 'Enter Vehicle Capacity (kg)',
    },
    {
      id: 'FuelType',
      label: 'Fuel Type',
      type: 'text',
      placeholder: 'Enter Fuel Type',
    },
  ];
  registrationAndLicensing: FormField[] = [
    {
      id: 'LicensePlateNumber',
      label: 'License Plate Number',
      type: 'text',
      placeholder: 'Enter License Plate Number',
    },
    {
      id: 'VehicleInspectionStatus',
      label: 'Vehicle Inspection Status',
      type: 'text',
      placeholder: 'Enter Inspection Status',
    },
    {
      id: 'RCOwnerName',
      label: 'RC Owner Name',
      type: 'text',
      placeholder: 'Enter RC Owner Name',
    },
  ];
  insuranceDetails: FormField[] = [
    {
      id: 'InsuranceProvider',
      label: 'Insurance Provider',
      type: 'text',
      placeholder: 'Enter Insurance Provider Name',
    },
    {
      id: 'PolicyNumber',
      label: 'Policy Number',
      type: 'text',
      placeholder: 'Enter Insurance Policy Number',
    },
    {
      id: 'ExpiryDate',
      label: 'Insurance Expiry Date',
      type: 'date',
      placeholder: 'Enter Insurance Expiry Date',
    },
  ];
  statusAndMetadata: FormField[] = [
    {
      id: 'Status',
      label: 'Vehicle Status',
      type: 'text',
      placeholder: 'Enter Vehicle Status (e.g., Active/Inactive)',
    },
    {
      id: 'MakeAndModel',
      label: 'Make and Model',
      type: 'text',
      placeholder: 'Enter Make and Model',
    },
    {
      id: 'companyRefId',
      label: 'Company Reference ID',
      type: 'text',
      placeholder: 'Enter Company Reference ID',
      disabled: true,
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
    licenseExpiry: ['', Validators.required],
    status: ['', Validators.required],
    workStatus: ['', Validators.required],
    _id: [''],

    notes: [''],
  });
  vehicleForm: FormGroup = this.fb.group({
    // Vehicle Details
    VehicleType: ['', Validators.required],
    VehicleRegistrationNumber: ['', Validators.required],
    VehicleColor: ['', Validators.required],
    MakeAndModel: ['', Validators.required],
    LicensePlateNumber: ['', Validators.required],
    YearOfManufacture: [
      '',
      [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear()),
      ],
    ],

    // Technical Specifications
    VehicleWeight: ['', [Validators.required, Validators.min(1)]],
    NumberOfAxles: ['', [Validators.required, Validators.min(1)]],
    VehicleCapacity: ['', [Validators.required, Validators.min(1)]],
    FuelType: ['', Validators.required],

    // Ownership and Registration
    RCOwnerName: ['', Validators.required],
    companyRefId: ['', Validators.required],

    // Inspection and Status
    VehicleInspectionStatus: ['', Validators.required],
    Status: ['', Validators.required],
    workStatus: ['', Validators.required],

    // Insurance Information
    InsuranceProvider: ['', Validators.required],
    PolicyNumber: ['', Validators.required],
    ExpiryDate: ['', Validators.required],
    isActive: [true, Validators.requiredTrue],

    // System Metadata
    _id: [''],
    __v: [{ value: '', disabled: true }],
  });
  companyInfoForm: FormGroup = this.fb.group({
    companyName: ['', Validators.required], // Company name from `companyDetails.companyName`
    companyEmail: [
      { value: '', disabled: true }, // Company email from `companyDetails.companyEmail`
      [Validators.required, Validators.email],
    ],
    companyPhone: [
      '',
      [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')], // Company phone with validation
    ],
    taxId: ['', Validators.required], // Tax ID from `companyDetails.taxId`
    addressLine1: ['', Validators.required], // Address line 1 from `companyDetails.address.addressLine1`
    addressLine2: ['', Validators.required], // Address line 2 from `companyDetails.address.addressLine2`
    city: ['', Validators.required], // City from `companyDetails.address.city`
    state: ['', Validators.required], // State from `companyDetails.address.state`
    postalCode: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{6}$')], // Postal code from `companyDetails.address.postalCode`
    ],
    companyRefId: [
      { value: '', disabled: true },
      Validators.required, // Company reference ID from `companyRefId`
    ],
    _id: [''], // MongoDB `_id` field
    // Bank Details
    bankName: ['', Validators.required], // Bank name
    accountNumber: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{9,18}$')], // Account number (9–18 digits)
    ],
    ifscCode: [
      '',
      [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')], // IFSC code validation
    ],
  });

  // UI Management
  truckTableData = {
    title: 'All Trucks',
    button: 'Add New Truck',
    statuses: ['Active', 'Pending'],
    tableHeads: [
      'Vehicle Body',
      'Truck Model', // New Heading 2
      'Truck Type', // New Heading 3
      'Status', // New Heading 4
      'License Plate', // New Heading 5
      'Owner Name', // New Heading 6
      'Fuel Type',
      'Actions',
    ],
    tableData: [],
  };
  bidTableData = {
    title: 'All Loads',
    button: '',
    statuses: [],
    tableHeads: [
      'Load ID',
      'Pickup City',
      'Drop City',

      'Commodity',

      'Trailer Type',

      'Base Price',
      'Lowest Bid',
      'Bid',
    ],
    tableData: [],
  };
  activeBidTableData = {
    title: 'Active Bids',
    button: '',
    statuses: [],
    tableHeads: [
      'Load ID',
      'Pickup City',
      'Drop City',

      'Commodity',

      'Trailer Type',

      'Base Price',
      'Lowest Bid',
      'Bid',
    ],
    tableData: [],
  };
  shipmentTableData = {
    title: 'All Shipments',
    button: 'Add New Load',
    statuses: ['Assigned ', 'Dispatched', 'Delivered'],
    tableHeads: [
      'Load ID',
      'Drop City',
      'Pick City',

      'Pickup Date',

      'Base Price',
      'Bid Price',
      'Status',
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
      'Destination City',
      'Shipper Name',
      'Shipper Ref_id',
      'Amount',
      'payment Status',
      'Action',
    ],
    tableData: [],
  };

  onSidebarButtonClick(component: string) {
    if (component === 'Search & Bid') {
      let user = this.localStorageServices.getCarrierAdminData();
      this.carrierService
        .getAllBids(user.companyRefId)
        .pipe(
          tap((bids: any) => {
            // Populate driverTableData with the fetched drivers
            console.log(bids.loads);
            const data = bids.loads;
            this.bidTableData = {
              ...this.bidTableData,
              tableData: data.map((bid: any) => ({
                loadId: bid.loadId || '',
                pickupCity: bid.pickupLocation?.address?.city || '',
                dropCity: bid.dropoff1?.address?.city || '',
                commodity: bid.material || 'Unknown', // Add logic for status if not in data
                vehicleType: bid.vehicleBody || '',

                basePrice: bid.basePrice || '',
                lowestBid: bid.lowestPrice || '--',
                _id: bid._id,
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
            this.showVehicleForm = false;
            this.showCompanyForm = false;
          },
          error: (err) => {},
        });
    }
    if (component === 'Active Bids') {
      let user = this.localStorageServices.getCarrierAdminData();
      this.carrierService
        .getActiveBids(user.companyRefId)
        .pipe(
          tap((bids: any) => {
            // Populate driverTableData with the fetched drivers
            console.log(bids.loads);
            const data = bids.loads;
            const filteredData = data.filter(
              (bid: any) =>
                bid.status !== 'Assigned' &&
                bid.status !== 'Dispatched' &&
                bid.status !== 'Delivered' &&
                bid.status !== 'Cancelled'
            );
            this.activeBidTableData = {
              ...this.activeBidTableData,
              tableData: filteredData.map((bid: any) => ({
                loadId: bid.loadId || '',
                dropCity: bid.dropoff1?.address?.city || '',
                commodity: bid.material || 'Unknown', // Add logic for status if not in data
                vehicleType: bid.vehicleBody || '',
                trailerType: bid.vehicleType || '',
                basePrice: bid.basePrice || '',
                lowestBid: bid.lowestPrice || '--',
                _id: bid._id,
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
            this.showVehicleForm = false;
            this.showCompanyForm = false;
          },
          error: (err) => {},
        });
    }
    if (component === 'Shipments') {
      const user: any = this.localStorageServices.getCarrierAdminData();
      console.log(user);

      this.carrierService
        .getAllCarrierLoads(user.companyRefId)
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
                pickCity: bid.pickupLocation?.address?.city || '',

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
            // Proceed only after driverTableData has been populated

            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
            this.showVehicleForm = false;
            this.showCompanyForm = false;
          },
          error: (err) => {},
        });
    }
    if (component === 'Payments') {
      this.carrierService
        .getAllPayments()
        .pipe(
          tap((payments: any) => {
            // Populate driverTableData with the fetched drivers

            // Filter payments by shipperId
            const filteredPayments = payments.payments.filter(
              (payment: any) => payment.carrierId === this.carrierRefId
            );
            console.log(filteredPayments);

            this.paymentTableData = {
              ...this.paymentTableData,
              tableData: filteredPayments.map((payment: any) => ({
                loadId: payment?.loadDetails?.loadId || '',
                destinationCity:
                  payment.loadDetails.dropoff1.address.city || '',
                carrierName:
                  payment.shipperDetails?.companyDetails?.companyName || '',
                carrierRefId: payment.shipperDetails?.companyRefId || '',
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
            this.showCompanyForm = false;
          },
          error: (err) => {
            console.error('Failed to fetch customers:', err);
          },
        });
    }
    if (component === 'Company Details') {
      this.carrierService.getShipperInfo(this.carrierRefId).subscribe({
        next: (data) => {
          console.log(data);

          if (data.success) {
            const user = data.user;

            this.companyInfoForm.patchValue({
              firstName: user.name?.firstName || '',
              lastName: user.name?.lastName || '',
              email: user.companyDetails?.companyEmail || '',
              phoneNumber: user.companyDetails?.companyPhone || '',
              companyEmail: user.companyDetails?.companyEmail || '',
              companyPhone: user.companyDetails?.companyPhone || '',

              companyRefId: user.companyRefId || '',
              companyName: user.companyDetails?.companyName || '',
              addressLine1: user.companyDetails?.address?.addressLine1 || '',
              addressLine2: user.companyDetails?.address?.addressLine2 || '',
              city: user.companyDetails?.address?.city || '',
              state: user.companyDetails?.address?.state || '',
              postalCode: user.companyDetails?.address?.postalCode || '',
              bankName: user.bankDetails?.bankName || '',
              ifscCode: user.bankDetails?.ifscCode || '',
              accountNumber: user.bankDetails?.accountNumber || '',
              _id: user._id || '',
            });

            // Set showForm to true and showModal to false after populating the data
            this.formTitle = 'Carrier Company Details';
            this.isDriver = false;
            this.action = 'edit';
            this.showForm = false;
            this.showModal = false;
            this.showCompanyForm = true;

            this.selectedComponent = component;
          }
        },
        error: (err) => {
          console.error('Failed to fetch driver data', err);
        },
      });
    }

    if (component === 'Drivers') {
      let user = this.localStorageServices.getCarrierAdminData();
      this.carrierService
        .getAllDrivers(user.companyRefId)
        .pipe(
          tap((user: any) => {
            // Populate driverTableData with the fetched drivers
            console.log('the clients are ', user);
            const drivers = user.drivers;
            this.driverTableData = {
              ...this.driverTableData,
              tableData: drivers.map((driver: any) => ({
                name:
                  driver.name?.firstName + ' ' + driver.name?.lastName || '',

                email: driver.email || '',
                phoneNumber:
                  driver.personalDetails?.emergencyContact?.phoneNumber || '',
                status: driver.status || 'Unknown', // Add logic for status if not in data
                username: driver.username || '',
                dateOfBirth: driver.dateOfBirth
                  ? new Date(driver.dateOfBirth).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '',

                aadharCardNumber: driver.aadharCardNumber || 'Not Available',
                id: driver._id,
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
            this.showVehicleForm = false;
            this.showCompanyForm = false;
          },
          error: (err) => {
            console.error('Failed to fetch customers:', err);
          },
        });
    }
    if (component === 'Trucks') {
      let user = this.localStorageServices.getCarrierAdminData();

      this.carrierService
        .getAllTrucks(user.companyRefId)
        .pipe(
          tap((response: any) => {
            console.log('The trucks are: ', response.trucks);

            const trucks = response.trucks;
            this.truckTableData = {
              ...this.truckTableData,
              tableData: trucks.map((truck: any) => ({
                vehicleBody: truck.VehicleColor || '',
                truckModel: truck.MakeAndModel || '',
                truckType: truck.VehicleType || '',
                capacity: truck.Status || '',
                licensePlate: truck.LicensePlateNumber || '',
                ownerName: truck.RCOwnerName || '',

                fuelType: truck.FuelType || '',

                id: truck._id,
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
            this.showVehicleForm = false;
            this.showCompanyForm = false;
          },
          error: (err) => {
            console.error('Failed to fetch trucks:', err);
          },
        });
    }
    if (component === 'Dashboard') {
      // Fetching multiple API calls in parallel using forkJoin
      forkJoin({
        payments: this.carrierService.getAllPayments(),
      })
        .pipe(
          tap(({ payments }) => {
            if (payments) {
              console.log(payments);
              const data = payments.payments;
              this.dashBoardData = data.filter(
                (payment: any) => payment.carrierId === this.carrierRefId
              );
            }

            // Set selected component and hide modal/form
            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
            this.showCompanyForm = false;
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

    if (component === 'Log Out') {
      localStorage.removeItem('carrierAdminToken');
      localStorage.removeItem('carrierAdminData');
      this.router.navigate(['/carrier']);
    }
  }
  driverInvitation(data: Invitation) {
    this.carrierService.inviteDriver(data).subscribe((res) => {
      console.log(res);
    });
  }
  handleAction(action: Action) {
    let item;
    if ('item' in action) {
      item = action.item;
    }
    if ('type' in action) {
      // This handles the case when `action` is of type { type: string; data: string }
      if (action.type === 'Bid') {
        this.carrierService
          .getShipperInfo(this.carrierRefId)
          .subscribe((data) => {
            if (data.success) {
              const bankInfo = data.user.bankDetails;

              // Check if all required bank details are present
              if (
                bankInfo &&
                bankInfo.accountNumber &&
                bankInfo.ifscCode &&
                bankInfo.bankName
              ) {
                // Proceed to get load information and open the bid modal
                this.carrierService
                  .getLoadInfo(action.data)
                  .subscribe((loadData) => {
                    this.openBidModal(loadData);
                  });
              } else {
                // Show toast if bank details are incomplete
                this.toastr.error(
                  'Please add your bank details before making a bid.',
                  'Error'
                );
              }
            } else {
              // Handle the case where the shipper info is not found or error occurs
              this.toastr.error('Failed to fetch shipper info.', 'Error');
            }
          });
      }
      if (action.type === 'BidAgain') {
        this.carrierService
          .getShipperInfo(this.carrierRefId)
          .subscribe((data) => {
            if (data.success) {
              const bankInfo = data.user.bankDetails;

              // Check if all required bank details are present
              if (
                bankInfo &&
                bankInfo.accountNumber &&
                bankInfo.ifscCode &&
                bankInfo.bankName
              ) {
                // Proceed to get load information and open the bid modal
                this.carrierService
                  .getLoadInfo(action.data)
                  .subscribe((loadData) => {
                    this.openBidModal(loadData);
                  });
              } else {
                // Show toast if bank details are incomplete
                this.toastr.error(
                  'Please add your bank details before making a bid.',
                  'Error'
                );
              }
            } else {
              // Handle the case where the shipper info is not found or error occurs
              this.toastr.error('Failed to fetch shipper info.', 'Error');
            }
          });
      }

      if (
        (action.type === 'edit' || action.type === 'view') &&
        item !== 'Trucks'
      ) {
        const userId = action.data;
        if (userId) {
          this.driverData.getDriver(userId).subscribe(
            (data) => {
              if (data.success) {
                const user = data.user;
                console.log(user.status);

                this.userStatus = user.status;

                console.log(user);

                this.personalInfoForm.patchValue({
                  firstName: user.name.firstName,
                  lastName: user.name.lastName,
                  email: user.email,
                  phoneNumber: user.phoneNumber || '',
                  companyRefId: user.companyRefId,
                  companyName: user.companyDetails
                    ? user.companyDetails.companyDetails?.companyName
                    : '',
                  emergencyContactName:
                    user.personalDetails.emergencyContact.name,
                  emergencyNumber:
                    user.personalDetails.emergencyContact.phoneNumber,
                  addressLine1: user.personalDetails.address.addressLine1,
                  addressLine2: user.personalDetails.address.addressLine2,
                  city: user.personalDetails.address.city,
                  state: user.personalDetails.address.state,
                  postalCode: user.personalDetails.address.postalCode,
                  driversLicenseNumber: user.driversLicenseNumber || '',
                  driversLicenseExpiry: formatDate(
                    user.driversLicenseExpiry || ''
                  ),
                  aadharCardNumber: user.aadharCardNumber || '',
                  dateOfBirth: formatDate(user.dateOfBirth || ''),
                  ifscCode: user.ifscCode || '',
                  accountNumber: user.accountNumber || '',
                  bankName: user.bankName || 'Bank',
                });
              }
            },
            (error) => {
              console.error('Failed to fetch driver data', error);
            }
          );
        } else {
          console.error('No user ID found in localStorage');
        }
        this.showForm = true;
        this.showModal = false;
      } else if (action.type === 'delete' && item !== 'Trucks') {
        this.showModal = true;
        this.showForm = false;
        this.showVehicleForm = false;
      }
    } else if ('action' in action) {
      // This handles the case when `action` is of type { action: string; id: string }
      const actionType = action.action;
      const id = action.id;
      const item = action.item;
      this.action = actionType;
      if (
        (actionType === 'edit' || actionType === 'view') &&
        item !== 'Trucks'
      ) {
        if (id) {
          this.driverData.getDriver(id).subscribe(
            (data) => {
              if (data.success) {
                const user = data.user;
                console.log(user.status);

                this.userStatus = user.status;

                console.log(user);

                this.personalInfoForm.patchValue({
                  firstName: user.name.firstName,
                  lastName: user.name.lastName,
                  email: user.email,
                  phoneNumber: user.phoneNumber || '',
                  companyRefId: user.companyRefId,
                  companyName: user.companyDetails
                    ? user.companyDetails.companyDetails?.companyName
                    : '',
                  emergencyContactName:
                    user.personalDetails.emergencyContact.name,
                  emergencyNumber:
                    user.personalDetails.emergencyContact.phoneNumber,
                  addressLine1: user.personalDetails.address.addressLine1,
                  addressLine2: user.personalDetails.address.addressLine2,
                  city: user.personalDetails.address.city,
                  state: user.personalDetails.address.state,
                  postalCode: user.personalDetails.address.postalCode,
                  driversLicenseNumber: user.driversLicenseNumber || '',
                  driversLicenseExpiry: formatDate(
                    user.driversLicenseExpiry || ''
                  ),
                  aadharCardNumber: user.aadharCardNumber || 'Not Available',
                  dateOfBirth: formatDate(user.dateOfBirth || 'Not Available'),
                  ifscCode: user.ifscCode || '',
                  accountNumber: user.accountNumber || '',
                  bankName: user.bankName || 'Bank',
                  status: user.status,
                  workStatus: user.workStatus,
                  _id: user._id,
                });
              }
            },
            (error) => {
              console.error('Failed to fetch driver data', error);
            }
          );
        }
        this.formTitle = 'Driver Details';
        this.showForm = true;
        this.showModal = false;
      } else if (actionType === 'delete') {
        this.showModal = true;
        this.showForm = false;
        this.showVehicleForm = false;
      } else if (
        (actionType === 'edit' || actionType === 'view') &&
        item === 'Trucks'
      ) {
        console.log('getting the truck details soon');

        const id = action.id;
        if (id) {
          this.carrierService.getTruckInfo(id).subscribe(
            (data) => {
              if (data.success) {
                const truck = data.truck;
                console.log(truck);

                this.vehicleStatus = truck.Status;
                console.log(this.vehicleStatus);

                this.vehicleForm.patchValue({
                  VehicleType: truck.VehicleType || '',
                  VehicleRegistrationNumber:
                    truck.VehicleRegistrationNumber || '',
                  VehicleColor: truck.VehicleColor || '',
                  VehicleWeight: truck.VehicleWeight || '',
                  Status: truck.Status || 'Inactive',
                  YearOfManufacture: truck.YearOfManufacture || '',
                  NumberOfAxles: truck.NumberOfAxles || '',
                  LicensePlateNumber: truck.LicensePlateNumber || '',
                  VehicleInspectionStatus:
                    truck.VehicleInspectionStatus || 'Pending',
                  MakeAndModel: truck.MakeAndModel || '',
                  FuelType: truck.FuelType || '',
                  VehicleCapacity: truck.VehicleCapacity || '',
                  RCOwnerName: truck.RCOwnerName || '',
                  ExpiryDate: formatDate(truck.ExpiryDate || ''),
                  InsuranceProvider: truck.InsuranceProvider || '',
                  PolicyNumber: truck.PolicyNumber || '',
                  companyRefId: truck.companyRefId || '',
                  workStatus: truck.workStatus,
                  isActive: truck.isActive,
                  _id: truck._id,
                });
              }
            },
            (error) => {
              console.error('Failed to fetch driver data', error);
            }
          );
        } else {
          console.error('No user ID found in localStorage');
        }
        this.formTitle = 'Truck Details';
        this.showVehicleForm = true;
        this.showModal = false;
        this.showForm = false;
      }
    }
  }

  openBidModal(data: any) {
    const dialogRef = this.dialog.open(BiddingComponent, {
      width: '600px',
      height: '80vh',
      data: {
        ...data,
        loadRefId: data.load._id, // Add _id as loadRefId
      },
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      let user = this.localStorageServices.getCarrierAdminData();
      this.carrierService
        .getShipperInfo(user.companyRefId)
        .subscribe((data) => {
          console.log(data);

          if (data && data.success) {
            const companyName = data.user.companyDetails.companyName;
            const companyPhone = data.user.companyDetails.companyPhone;
            const firstName = data.user.name.firstName;
            const lastName = data.user.name.lastName;
            const companyRefId = data.user.companyRefId;

            // Add the extracted data to the result object
            result = {
              ...result,
              companyName: companyName,
              companyPhone: companyPhone,
              firstName: firstName,
              lastName: lastName,
              companyRefId,
            };

            console.log(result); // Log the updated result
            this.carrierService.postBid(result).subscribe((data) => {
              console.log(data);
            });
          } else {
            console.error('Failed to fetch shipper info');
          }
        });
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('carrierAdminData');

    if (userData) {
      // Parse the JSON data
      const parsedData = JSON.parse(userData);

      // Extract the user ID
      const userId = parsedData._id;

      this.carrierRefId = parsedData.companyRefId;
      this.shipperId = userId;
    }

    this.dataService.data$.subscribe((receivedData) => {
      console.log(receivedData);

      if (receivedData === 'Customers') {
        this.onSidebarButtonClick(receivedData);
        console.log(receivedData);
      }
      if (receivedData === 'Shipments') {
        this.onSidebarButtonClick(receivedData);
        console.log(receivedData);
      }
      if (receivedData === 'Drivers' || receivedData === 'Trucks') {
        this.onSidebarButtonClick(receivedData);
        this.showVehicleForm = false;
        this.showForm = false;
        console.log(receivedData);
      } else {
        if (receivedData.action === 'delete') {
          this.targetId = receivedData.id;
          if (receivedData.item === 'Drivers') {
            this.target = 'Drivers';
            this.onSidebarButtonClick('Drivers');
            this.showDeleteModal = true;
          }
          if (receivedData.item === 'Trucks') {
            this.onSidebarButtonClick('Trucks');
            this.target = 'Trucks';
            this.showDeleteModal = true;
          }
        }

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
    console.log(id, target);
    if (target === 'Trucks') {
      this.driverData.updateTruckInfo({ isActive: false }, id).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.toastr.success('Truck deleted successfully!', 'Success');
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (err) => {
          console.error('Error deleting truck:', err);
          this.toastr.error(
            'Failed to delete truck. Please try again.',
            'Error'
          );
        },
      });
      this.onSidebarButtonClick('Trucks');
    }
    if (target === 'Drivers') {
      this.driverData.updateDriverInfo({ isActive: false }, id).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.toastr.success('Driver deleted successfully!', 'Success');
          } else {
            this.toastr.error(data.message, 'Error');
          }
          this.onSidebarButtonClick('Drivers');
        },
        error: (err) => {
          console.error('Error deleting driver:', err);
          this.toastr.error(
            'Failed to delete driver. Please try again.',
            'Error'
          );
        },
      });
      this.onSidebarButtonClick('Drivers');
    }
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
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
