import { Component, Inject, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { FormComponent } from '../../shared/components/form/form.component';
import { UserService } from '../../core/services/user/user.service';
import { tap } from 'rxjs';
import { DriverService } from '../driver-layout/services/driver.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrierService } from '../../features/carrier/services/carrier.service';
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

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    CommonModule,
    FormComponent,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit {
  constructor(@Inject(DataService) private dataService: DataService) {}
  UserServices = inject(UserService);

  private fb = inject(FormBuilder);
  userStatus!: string;
  vehicleStatus!: string;
  isDriver: boolean = false;
  role: string = 'appAdmin';
  dataToShow: string = 'Trucks';

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
      
    },
  ];

  personalInfoForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
    ],
    phoneNumber: ['', Validators.required],
    companyRefId: [{ value: '', disabled: true }, Validators.required],
    companyName: [{ value: '', disabled: true }, Validators.required],
    driversLicenseNumber: ['', Validators.required],
    driversLicenseExpiry: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    emergencyContactName: ['', Validators.required],
    emergencyNumber: ['', Validators.required],
    addressLine1: ['', Validators.required],
    addressLine2: ['', Validators.required],
    city: ['', Validators.required],
    status: ['', Validators.required],
    id: ['', Validators.required],
    state: ['', Validators.required],
    workStatus: [''],
    postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    aadharCardNumber: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{12}$')],
    ],
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

    // Insurance Information
    InsuranceProvider: ['', Validators.required],
    PolicyNumber: ['', Validators.required],
    ExpiryDate: ['', Validators.required],

    // System Metadata
    _id: [{ value: '', disabled: true }],
    __v: [{ value: '', disabled: true }],
  });

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
    ],
    tableData: [],
  };

  // UI Management
  buttonTexts: string[] = [
    'Dashboard',
    'Active Bids',
    'Shipments',
    'Shippers',
    'Carriers',
    'Drivers',
    'Trucks',
    'Payment',
    'Notifications',
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
      '  user ID',
      'Company Name',
      'companyRefId',
    ],
    tableData: [],
  };

  selectedComponent: string = 'Dashboard';
  currentAction: string = '';
  showForm: boolean = false;
  showVehicleForm: boolean = false;
  showModal: boolean = false;

  onSidebarButtonClick(component: string) {
    if (component === 'Drivers') {
      this.UserServices.getAllDrivers()
        .pipe(
          tap((data: any) => {
            console.log(data);
            
            const drivers = data.filter(
            
              
              (driver: any) => driver.isBoardingCompleted
            );
            // Populate driverTableData with the fetched drivers
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
                company: driver.companyDetails?.companyName || 'No Company', // Add company name if available
                companyRefId: driver?.companyRefId || 'No Company',
                workStatus: driver?.workStatus || 'No Status',
                id: driver._id,
              })),
            };
          })
        )
        .subscribe({
          next: () => {
            // Proceed only after driverTableData has been populated
            console.log(this.driverTableData);

            this.selectedComponent = component;
            this.showForm = false;
            this.showModal = false;
            this.showVehicleForm=false
          },
          error: (err) => {
            console.error('Failed to fetch drivers:', err);
          },
        });
    }
    if (component === 'Trucks') {
      this.UserServices.getAllVehicles()
        .pipe(
          tap((response: any) => {
            console.log('The trucks are: ', response);

            const trucks = response.vehicles;
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
          },
          error: (err) => {
            console.error('Failed to fetch trucks:', err);
          },
        });
    }
  }

  handleAction(action: { action: string; id: string; item: string }) {
    this.currentAction = action.action;

    if (
      (action.action === 'edit' || action.action === 'view') &&
      action.item !== 'Trucks'
    ) {
      const userId = action.id;
      if (userId) {
        this.UserServices.getDriver(userId).subscribe(
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
                status: user.status || 'Unknown',
                workStatus: user.workStatus || 'No Status',
                id: user._id,
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
    } else if (action.action === 'delete' && action.item !== 'Trucks') {
      this.showModal = true;
      this.showForm = false;
    } else if (
      (action.action === 'edit' || action.action === 'view') &&
      action.item === 'Trucks'
    ) {
      console.log('getting the truck details soon');

      const id = action.id;
      if (id) {
        this.UserServices.getTruckDetails(id).subscribe(
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
                id: truck._id,
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
      this.showVehicleForm = true;
      this.showModal = false;
      this.showForm = false;
    }
  }

  ngOnInit(): void {
    this.dataService.data$.subscribe((receivedData) => {
      console.log(receivedData);

      this.handleAction(receivedData);
    });
  }
}
