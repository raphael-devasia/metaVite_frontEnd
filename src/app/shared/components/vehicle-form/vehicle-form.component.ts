import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateValidator } from '../../customValidators';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { CarrierService } from '../../../core/services/shipper/carrier/carrier.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.css',
})
export class VehicleFormComponent implements OnInit {
  vehicleForm!: FormGroup;
  formTitle = 'Upload Vehicle Information';
  localStorageServices = inject(LocalstorageService);
  carrierServices = inject(CarrierService);

  vehicleInformation = [
    {
      id: 'companyRefId',
      label: 'Carrier ID',
      type: 'text',
      placeholder: 'Enter Carrier ID',
      disabled: false,
    },
    {
      id: 'VehicleType',
      label: 'Vehicle Type',
      type: 'text',
      placeholder: 'Enter Vehicle Type',
      disabled: false,
    },
    {
      id: 'VehicleRegistrationNumber',
      label: 'Vehicle Registration Number',
      type: 'text',
      placeholder: 'Enter Vehicle Registration Number',
      disabled: false,
    },
    {
      id: 'VehicleColor',
      label: 'Vehicle Color',
      type: 'text',
      placeholder: 'Enter Vehicle Color',
      disabled: false,
    },
    {
      id: 'VehicleWeight',
      label: 'Vehicle Weight',
      type: 'text',
      placeholder: 'Enter Vehicle Weight',
      disabled: false,
    },
    {
      id: 'Status',
      label: 'Vehicle Status',
      type: 'text',
      placeholder: 'Enter Vehicle Status',
      disabled: false,
    },
    {
      id: 'YearOfManufacture',
      label: 'Year of Manufacture',
      type: 'number',
      placeholder: 'Enter Year of Manufacture',
      disabled: false,
    },
    {
      id: 'NumberOfAxles',
      label: 'Number of Axles',
      type: 'number',
      placeholder: 'Enter Number of Axles',
      disabled: false,
    },
    {
      id: 'LicensePlateNumber',
      label: 'License Plate Number',
      type: 'text',
      placeholder: 'Enter License Plate Number',
      disabled: false,
    },
    {
      id: 'VehicleInspectionStatus',
      label: 'Vehicle Inspection Status',
      type: 'text',
      placeholder: 'Enter Inspection Status',
      disabled: false,
    },
    {
      id: 'MakeAndModel',
      label: 'Make and Model',
      type: 'text',
      placeholder: 'Enter Make and Model',
      disabled: false,
    },
    {
      id: 'FuelType',
      label: 'Fuel Type',
      type: 'text',
      placeholder: 'Enter Fuel Type',
      disabled: false,
    },
    {
      id: 'VehicleCapacity',
      label: 'Vehicle Capacity',
      type: 'text',
      placeholder: 'Enter Vehicle Capacity',
      disabled: false,
    },
    {
      id: 'RCOwnerName',
      label: 'RC Owner Name',
      type: 'text',
      placeholder: 'Enter RC Owner Name',
      disabled: false,
    },
  ];

  insuranceInformation = [
    {
      id: 'ExpiryDate',
      label: 'Insurance Expiry Date',
      type: 'date',
      placeholder: 'Enter Expiry Date',
    },
    {
      id: 'InsuranceProvider',
      label: 'Insurance Provider',
      type: 'text',
      placeholder: 'Enter Insurance Provider',
    },
    {
      id: 'PolicyNumber',
      label: 'Insurance Policy Number',
      type: 'text',
      placeholder: 'Enter Policy Number',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VehicleFormComponent>,
    private router: Router,
  ) {}

  ngOnInit(): void {
    let user = this.localStorageServices.getCarrierAdminData();

     const currentUrl = this.router.url;

     if (currentUrl.includes('/carrier/admin')) {
       user = this.localStorageServices.getCarrierAdminData();
     } else if (currentUrl.includes('/carrier/driver/dashboard')) {
       user = this.localStorageServices.getDriverData();
     } 
    let companyRefId = user.companyRefId;

    this.vehicleForm = this.fb.group({
      companyRefId: [companyRefId, Validators.required],
      VehicleType: ['', Validators.required],
      VehicleRegistrationNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$'),
        ],
      ], // Indian license plate format
      VehicleColor: ['', Validators.required],
      VehicleWeight: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
        ],
      ], // Positive number
      Status: ['', Validators.required],
      YearOfManufacture: [
        '',
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ], // Year should not be in the future
      NumberOfAxles: ['', [Validators.required, Validators.min(1)]], // Should be 1 or greater
      LicensePlateNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$'),
        ],
      ], // Indian license plate format
      VehicleInspectionStatus: ['', Validators.required],
      MakeAndModel: ['', Validators.required],
      FuelType: ['', Validators.required],
      VehicleCapacity: ['', Validators.required],
      RCOwnerName: ['', Validators.required],
      ExpiryDate: ['', [Validators.required, DateValidator.futureDate]], // Custom validator to check future date
      InsuranceProvider: ['', Validators.required],
      PolicyNumber: [
        '',
        [Validators.required, Validators.pattern('^[A-Z0-9]+$')],
      ], // Alphanumeric pattern for policy number
    });
  }
  onSubmit(): void {
    if (this.vehicleForm.valid) {
      const formData = this.vehicleForm.value;

      // Call the service to add a new truck
      this.carrierServices.addNewTruck(formData).subscribe(
        (response: any) => {
          if (response.success) {
            // Show success message inside the dialog for 3 seconds, then close
            alert(response.message); // Display the message
            setTimeout(() => {
              this.dialogRef.close();
            }, 3000);
          } else {
            // Show failure message inside the dialog for 3 seconds
            alert(response.message); // Display the message
          }
        },
        (error: any) => {
          // Show error message for 3 seconds
          alert('An error occurred. Please try again.');
        }
      );
    } else {
      console.log('Form is invalid');
      console.log('Form Submitted:', this.vehicleForm.value);

      // Optionally display an alert for invalid form submission
      alert('Please fill out all required fields.');
    }
  }
}
