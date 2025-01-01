import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FormComponent } from '../../shared/components/form/form.component';
import { CommonModule } from '@angular/common';
import { DriverService } from './services/driver.service';
import { LocalstorageService } from '../../core/services/localstorage.service';
import { SuccessComponent } from '../../shared/components/success/success.component';
import { ageValidator, fileValidator } from '../../shared/customValidators';
import { DataService } from '../../shared/services/data.service';
import { CarrierService } from '../../core/services/shipper/carrier/carrier.service';
import { tap } from 'rxjs';
import { TableComponent } from '../../shared/components/table/table.component';
// import { ErrorComponent } from "../../shared/components/error/error.component";

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  disabled?: boolean;
}
export function noPastDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const today = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  };
}
export function ifscCodeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const ifscRegex = /^[A-Za-z]{4}\d{7}$/;
    if (!ifscRegex.test(control.value)) {
      return { invalidIFSC: true };
    }
    return null;
  };
}
export function accountNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const accountNumberRegex = /^\d{9,18}$/;
    if (!accountNumberRegex.test(control.value)) {
      return { invalidAccountNumber: true };
    }
    return null;
  };
}


@Component({
  selector: 'app-driver-layout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SidebarComponent,
    FormComponent,
    CommonModule,
    SuccessComponent,TableComponent
  ],
  templateUrl: './driver-layout.component.html',
  styleUrls: ['./driver-layout.component.css'],
})
export class DriverLayoutComponent implements OnInit {
  personalInfoForm: FormGroup;
  showForm: boolean = false;
  showModal: boolean = false;
  selectedFileName: string = '';
  buttonTexts: string[] = ['Driver On-Boarding'];
  activeButtonTexts: string[] = [
    'Dashboard',
    'My Loads',
    'My Details',
    'My Location',
    'Logout',
  ];

  driverData = inject(DriverService);
  localstorage = inject(LocalstorageService);
  formTitle = 'Driver Information';
  isBoardingActive: boolean = true;
  isBoardingSuccess: string = 'active';
  buttonText!: string;
  status!: string;

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
  shipmentTableData = {
    title: 'All Shipments',
    button: 'Add New Load',
    statuses: ['Assigned ', 'Dispatched', 'Delivered'],
    tableHeads: [
      'Load ID',
      'Drop City',
      'Commodity',
      'Shipper Name',
      'Pickup Date',

      'Base Price',
      'Bid Price',
    ],
    tableData: [],
  };

  // documents: FormField[] = [
  //   {
  //     id: 'idFile',
  //     label: 'ID File Upload',
  //     type: 'file',
  //     placeholder: 'Upload ID',
  //   },
  //   {
  //     id: 'contractFile',
  //     label: 'Contract File Upload',
  //     type: 'file',
  //     placeholder: 'Upload Contract',
  //   },
  // ];

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

  constructor(
    private fb: FormBuilder,
    @Inject(DataService) private dataService: DataService
  ) {
    this.personalInfoForm = this.fb.group({
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
      driversLicenseExpiry: ['', [Validators.required, noPastDateValidator()]],
      dateOfBirth: ['', [Validators.required, ageValidator()]],
      emergencyContactName: ['', Validators.required],
      emergencyNumber: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      aadharCardNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{12}$')],
      ],
      ifscCode: ['', [Validators.required, ifscCodeValidator()]],
      accountNumber: ['', [Validators.required, accountNumberValidator()]],
      // idFile: [null, [Validators.required, fileValidator()]],
      // contractFile: [null, [Validators.required, fileValidator()]],
    });
  }

  selectedComponent: string = 'Driver On-Boarding';

  ngOnInit(): void {
    let userId;
    const userData = localStorage.getItem('driverData');

    if (userData) {
      // Parse the JSON data
      const parsedData = JSON.parse(userData);

      // Extract the user ID
      userId = parsedData._id;
    }

    if (userId) {
      this.driverData.getDriver(userId).subscribe(
        (data) => {
          if (data.success) {
            this.status = data.user.status;
            console.log(data);
            if (data.user.driversLicenseNumber) {
              this.isBoardingSuccess = 'success';
            }

            const user = data.user;
            console.log(user.personalDetails.address.addressLine1);
            this.personalInfoForm.patchValue({
              firstName: user.name.firstName,
              lastName: user.name.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber || '',
              companyRefId: user.companyRefId,
              companyName: user.companyDetails
                ? user.companyDetails.companyDetails?.companyName
                : '',
              emergencyContactName: user.personalDetails.emergencyContact.name,
              emergencyNumber:
                user.personalDetails.emergencyContact.phoneNumber,
              addressLine1: user.personalDetails.address.addressLine1,
              addressLine2: user.personalDetails.address.addressLine2,
              city: user.personalDetails.address.city,
              state: user.personalDetails.address.state,
              postalCode: user.personalDetails.address.postalCode,
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
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.selectedFileName = file ? file.name : '';
  }

  onSidebarButtonClick(component: string): void {
    this.selectedComponent = component;
    console.log(component);
    

    if (component === 'My Loads') {
      const user: any = this.localstorage.getDriverData();
      console.log(user);

      this.driverData
        .getAllDriverLoads(`DRIVER-${user._id}`)
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
                bid.status === 'Delivered'
            );
            this.shipmentTableData = {
              ...this.shipmentTableData,
              tableData: filteredData.map((bid: any) => ({
                loadId: bid.email || '',
                dropCity: bid.dropoff1?.address?.city || '',
                commodity: bid.material || 'Unknown', // Add logic for status if not in data
                vehicleType: bid.vehicleBody || '',
                trailerType: bid.vehicleType || '',
                basePrice: bid.basePrice || '',
                lowestBid: bid.basePrice || '',
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
          },
          error: (err) => {},
        });
    }
     if (component === 'My Details') {
       const user: any = this.localstorage.getDriverData();
       console.log(user);

       this.driverData.getDriver(user._id).subscribe(
         (data) => {
           if (data.success) {
             this.status = data.user.status;
             console.log(data);
             if (data.user.driversLicenseNumber) {
               this.isBoardingSuccess = 'success';
             }

             const user = data.user;
             console.log(user.personalDetails.address.addressLine1);
             this.personalInfoForm.patchValue({
               firstName: user.name.firstName,
               lastName: user.name.lastName,
               email: user.email,
               phoneNumber: user.phoneNumber || '',
               companyRefId: user.companyRefId,
               companyName: user.companyDetails
                 ? user.companyDetails.companyDetails?.companyName
                 : '',
               emergencyContactName: user.personalDetails.emergencyContact.name,
               emergencyNumber:
                 user.personalDetails.emergencyContact.phoneNumber,
               addressLine1: user.personalDetails.address.addressLine1,
               addressLine2: user.personalDetails.address.addressLine2,
               city: user.personalDetails.address.city,
               state: user.personalDetails.address.state,
               postalCode: user.personalDetails.address.postalCode,
             });
           }
         },
         (error) => {
           console.error('Failed to fetch driver data', error);
         }
       );
     }
    



    
  }

  // toggleBoarding(): void {
  //   this.isBoardingActive = !this.isBoardingActive;
  //   if (this.isBoardingActive) {
  //     this.personalInfoForm.addControl(
  //       'emergencyContactName',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'emergencyNumber',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'licenseNumber',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'licenseExpiry',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'bankName',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'ifscCode',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'accountNumber',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'addressLine1',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'addressLine2',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'city',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'state',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.personalInfoForm.addControl(
  //       'postalCode',
  //       this.fb.control('', Validators.required)
  //     );
  //     this.buttonText = 'Submit';
  //   }
  // }
  isOn_BoardingSuccess($event: string) {
    console.log($event);
    this.isBoardingSuccess = $event;
  }
}
