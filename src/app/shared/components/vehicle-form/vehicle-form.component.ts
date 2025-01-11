import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DateValidator } from '../../customValidators';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { CarrierService } from '../../../core/services/shipper/carrier/carrier.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';

export class FutureDateValidator {
  static futureDate(minMonths: number): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + minMonths);

      if (selectedDate <= currentDate) {
        return { futureDate: { requiredMonths: minMonths } };
      }
      return null;
    };
  }
}

// Custom validators
const weightRangeValidator = (min: number, max: number) => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    if (isNaN(value) || value < min || value > max) {
      return { weightRange: { min, max } };
    }
    return null;
  };
};

const vehicleCapacityValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = Number(control.value);
  if (isNaN(value) || value < 1 || value > 100) {
    return { capacity: true };
  }
  return null;
};

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css'],
})
export class VehicleFormComponent implements OnInit {
  vehicleForm!: FormGroup;
  formTitle = 'Upload Vehicle Information';
  localStorageServices = inject(LocalstorageService);
  carrierServices = inject(CarrierService);
  dataServices = inject(DataService);

  companyRefId!: string;

  // Updated vehicle types based on Indian commercial vehicle categories
  vehicleTypes = [
    'Light Commercial Vehicle (LCV)',
    'Intermediate Commercial Vehicle (ICV)',
    'Medium Commercial Vehicle (MCV)',
    'Heavy Commercial Vehicle (HCV)',
    'Multi-Axle Vehicle (MAV)',
    'Tractor-Trailer',
  ];

  // Popular truck manufacturers in India
  manufacturers = [
    'Tata Motors',
    'Ashok Leyland',
    'Mahindra & Mahindra',
    'BharatBenz',
    'Eicher Motors',
    'Force Motors',
  ];

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
      type: 'select',
      placeholder: 'Select Vehicle Type',
      disabled: false,
      options: this.vehicleTypes,
    },
    {
      id: 'VehicleRegistrationNumber',
      label: 'Vehicle Identification Number',
      type: 'text',
      placeholder:
        'Enter Vehicle Identification Number (e.g., 1HGCM82633A123456)',
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
      label: 'Vehicle Weight (tonnes)',
      type: 'number',
      placeholder: 'Enter Vehicle Weight',
      disabled: false,
    },
    // {
    //   id: 'Status',
    //   label: 'Vehicle Status',
    //   type: 'select',
    //   placeholder: 'Select Status',
    //   disabled: false,
    //   options: ['Active', 'Inactive', 'Maintenance', 'Under Repair'],
    // },
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
      placeholder: 'Enter License Plate Number (e.g., MH12AB1234)',
      disabled: false,
    },
    {
      id: 'VehicleInspectionStatus',
      label: 'Vehicle Inspection Status',
      type: 'select',
      placeholder: 'Select Inspection Status',
      disabled: false,
      options: ['Passed', 'Failed', 'Pending', 'Expired'],
    },
    {
      id: 'Manufacturer',
      label: 'Manufacturer',
      type: 'select',
      placeholder: 'Select Manufacturer',
      disabled: false,
      options: this.manufacturers,
    },
    {
      id: 'Model',
      label: 'Model',
      type: 'text',
      placeholder: 'Enter Model',
      disabled: false,
    },
    {
      id: 'FuelType',
      label: 'Fuel Type',
      type: 'select',
      placeholder: 'Select Fuel Type',
      disabled: false,
      options: ['Diesel', 'CNG', 'LNG', 'Electric'],
    },
    {
      id: 'VehicleCapacity',
      label: 'Vehicle Capacity (tonnes)',
      type: 'number',
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
    private toastr: ToastrService,

    private router: Router
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
    this.companyRefId = companyRefId;
    this.vehicleForm = this.fb.group({
      companyRefId: [
        { value: companyRefId, disabled: true },
        Validators.required,
      ],
      VehicleType: ['', Validators.required],
      VehicleRegistrationNumber: [
        '',
        [
          Validators.required,
          // Updated pattern for Indian vehicle registration numbers
          Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/),
        ],
      ],
      VehicleColor: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)],
      ],
      VehicleWeight: [
        '',
        [
          Validators.required,
          // Weight validation based on Indian commercial vehicle standards
          weightRangeValidator(0.5, 49), // 0.5 to 49 tonnes
        ],
      ],
      // Status: ['', Validators.required],
      YearOfManufacture: [
        '',
        [
          Validators.required,
          Validators.min(2000), // Assuming 20+ year old vehicles aren't allowed
          Validators.max(new Date().getFullYear()),
        ],
      ],
      NumberOfAxles: [
        '',
        [
          Validators.required,
          Validators.min(2),
          Validators.max(12), // Maximum for multi-axle vehicles in India
        ],
      ],
      LicensePlateNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/),
        ],
      ],
      VehicleInspectionStatus: ['', Validators.required],
      Manufacturer: ['', Validators.required],
      Model: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\s\-]+$/),
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      FuelType: ['', Validators.required],
      VehicleCapacity: ['', [Validators.required, vehicleCapacityValidator]],
      RCOwnerName: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z\s]+$/),
          Validators.minLength(3),
          Validators.maxLength(100),
          this.noOnlySpacesValidator, // Custom validator
        ],
      ],
      ExpiryDate: [
        '',
        [Validators.required, FutureDateValidator.futureDate(2)],
      ],
      InsuranceProvider: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z\s\&\-\.]+$/),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      PolicyNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z0-9\-\/]+$/),
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
    });
  }
  noOnlySpacesValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    return value && value.length > 0 ? null : { noOnlySpaces: true };
  }

  // getErrorMessage(fieldId: string): string {
  //   const control = this.vehicleForm.get(fieldId);
  //   if (control?.errors) {
  //     if (control.errors['required']) {
  //       return `This field is required`;
  //     }
  //     if (control.errors['pattern']) {
  //       switch (fieldId) {
  //         case 'VehicleRegistrationNumber':
  //         case 'LicensePlateNumber':
  //           return 'Invalid format. Example: MH12AB1234';
  //         case 'VehicleColor':
  //           return 'Only letters and spaces allowed';
  //         case 'PolicyNumber':
  //           return 'Only uppercase letters, numbers, and hyphens allowed';
  //         default:
  //           return 'Invalid format';
  //       }
  //     }
  //     if (control.errors['weightRange']) {
  //       return `Weight must be between ${control.errors['weightRange'].min} and ${control.errors['weightRange'].max} tonnes`;
  //     }
  //     if (control.errors['min']) {
  //       return `Value must be at least ${control.errors['min'].min}`;
  //     }
  //     if (control.errors['max']) {
  //       return `Value cannot exceed ${control.errors['max'].max}`;
  //     }
  //     if (control.errors['capacity']) {
  //       return 'Capacity must be between 1 and 100 tonnes';
  //     }
  //   }
  //   return '';
  // }
  getErrorMessage(fieldId: string): string {
    const control = this.vehicleForm.get(fieldId);
    if (control?.errors) {
      if (control.errors['required']) {
        return `This field is required`;
      }
      if (control.errors['pattern']) {
        switch (fieldId) {
          case 'VehicleRegistrationNumber':
            return 'Invalid VIN. Must be 17 characters, uppercase letters (A-Z) and digits (0-9), excluding I, O, Q.';

          case 'LicensePlateNumber':
            return 'Invalid format. Example: MH12AB1234';
          case 'VehicleColor':
            return 'Only letters and spaces allowed';
          case 'PolicyNumber':
            return 'Only uppercase letters, numbers, and hyphens allowed';
          case 'RCOwnerName':
            return 'Only letters and spaces allowed. Minimum 3 characters.';
          default:
            return 'Invalid format';
        }
      }
      if (control.errors['noOnlySpaces']) {
        return 'Name cannot contain only spaces';
      }
      if (control.errors['weightRange']) {
        return `Weight must be between ${control.errors['weightRange'].min} and ${control.errors['weightRange'].max} tonnes`;
      }
      if (control.errors['min']) {
        return `Value must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `Value cannot exceed ${control.errors['max'].max}`;
      }
      if (control.errors['capacity']) {
        return 'Capacity must be between 1 and 100 tonnes';
      }
      if (control.errors['futureDate']) {
        return `Expiry date must be at least ${control.errors['futureDate'].requiredMonths} months in the future`;
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      const formData = this.vehicleForm.value;
      formData.MakeAndModel = `${formData.Manufacturer} ${formData.Model}`;
      formData.companyRefId = this.companyRefId;

      this.carrierServices.addNewTruck(formData).subscribe(
        (response: any) => {
          if (response.success) {
            // Show success toast
            this.toastr.success(response.message, 'Success');
            this.dataServices.sendData('Trucks');
            // Close the modal
            setTimeout(() => {
              this.dialogRef.close();
            }, 2000);
          } else {
            // Show error toast
            this.toastr.error(response.message, 'Error');

            // Clear the modal fields
            this.vehicleForm.reset();
          }
        },
        (error: any) => {
          // Show generic error toast
          this.toastr.error('An error occurred. Please try again.', 'Error');
        }
      );
    } else {
      Object.keys(this.vehicleForm.controls).forEach((key) => {
        const control = this.vehicleForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      alert('Please fill out all required fields with valid data.');
    }
  }
}
