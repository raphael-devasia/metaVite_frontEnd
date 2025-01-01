import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { fileValidator } from '../../customValidators';
import { DataService } from '../../services/data.service';
import { DriverService } from '../../../layouts/driver-layout/services/driver.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { CarrierService } from '../../../core/services/shipper/carrier/carrier.service';
import { ToastrService } from 'ngx-toastr';


interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  disabled?: boolean; // Added disabled property
  imageUrl?: string;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  driverData = inject(DriverService);
  carrierService = inject(CarrierService);
  userData = inject(UserService);
  localstorage = inject(LocalstorageService);
  buttonText: string = 'Start On-Boarding';
  isBoardingActive: boolean = false;
  userId!: string;
  localStorageServices = inject(LocalstorageService);
  user: any;
  @Input() role: string = '';
  @Input() personalInformation: FormField[] = [];
  @Input() companyInformation: FormField[] = [];
  @Input() additionalInformation: FormField[] = [];
  @Input() bankDetails: FormField[] = [];
  @Input() formTitle: string = '';
  @Input() address: FormField[] = [];
  @Input() formGroup!: FormGroup; // Accept the form group from parent component
  @Output() isOn_BoardingSuccess = new EventEmitter<string>();
  @Input() isDriver: boolean = true;
  @Input() userStatus!: string;
  @Input() vehicleStatus!: string;
  @Input() action!: string;

  @Input() dataToShow!: string;
  @Input() vehicleDetails: FormField[] = [];
  @Input() vehicleSpecifications: FormField[] = [];
  @Input() registrationAndLicensing: FormField[] = [];
  @Input() insuranceDetails: FormField[] = [];
  @Input() statusAndMetadata: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(DataService) private dataService: DataService,
    private router: Router,
    private toastr: ToastrService,
  ) {}
  get vehicleId(): string | '' {
    return this.formGroup.get('_id')?.value; // Accessing the `id` field
  }
  get companyRefId(): string | '' {
    return this.formGroup.get('companyRefId')?.value; // Accessing the `id` field
  }
  ngOnInit(): void {
    console.log('the data to show is ',this.dataToShow);
    
    if (this.dataToShow === 'Trucks') {
      this.addControls(this.vehicleDetails);
      this.addControls(this.vehicleSpecifications);
      this.addControls(this.registrationAndLicensing);
      this.addControls(this.insuranceDetails);
      this.addControls(this.statusAndMetadata);
    }

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

    this.userId = this.user._id;
    if (this.formGroup) {
      this.addControls(this.personalInformation);
    }
    this.checkIfDriver();
    console.log(this.userId);
  }

  addControls(fields: FormField[]): void {
    fields.forEach((field) => {
      const control = this.fb.control(
        { value: '', disabled: field.disabled || false },
        Validators.required // Default validator
      );
      if (!this.formGroup.contains(field.id)) {
        this.formGroup.addControl(field.id, control);
      }
    });
  }

  // Custom validator for checking if the date is in the future
  futureDateValidator(control: any) {
    const today = new Date();
    const inputDate = new Date(control.value);
    if (inputDate <= today) {
      return { futureDate: true }; // Invalid if not in the future
    }
    return null; // Valid date
  }

  toggleBoarding(): void {
    if (this.buttonText === 'Start On-Boarding') {
      this.addControls(this.additionalInformation);
      this.addControls(this.bankDetails);
      this.addControls(this.address);

      this.buttonText = 'Submit';
      this.isBoardingActive = true;
    } else {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('Form data:', this.formGroup.value);
      this.driverData
        .driverOnboardingInfo(this.formGroup.value, this.userId)
        .subscribe((data) => {
          if (data.success) {
            this.isOn_BoardingSuccess.emit('success');
          } else {
            this.isOn_BoardingSuccess.emit('error');
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }

  checkIfDriver(): void {
    if (!this.isDriver) {
      this.toggleBoarding();
    }
  }

  // onUpdate(): void {
  //   if (this.formTitle === 'Driver Details') {
  //     this.formGroup.patchValue({ status: 'Active' }); // Update the status

  //     console.log(this.formGroup.value._id); // Check updated values
  //     this.driverData
  //       .updateDriverInfo(this.formGroup.value, this.formGroup.value._id)
  //       .subscribe((data) => {
  //         console.log('driver updated successfully', data);
  //         this.dataService.sendData('Drivers')
  //       });
  //   }
  //   if (this.formTitle === 'Truck Details') {
  //      console.log(this.formGroup.value._id); // Check updated values
  //      this.driverData
  //        .updateTruckInfo(this.formGroup.value, this.formGroup.value._id)
  //        .subscribe((data) => {
  //          console.log('truck updated successfully', data);
  //           this.dataService.sendData('Trucks');
  //        });
  //   } else {
  //     console.log(this.formGroup.value._id); // Check updated values
  //     this.driverData
  //       .updateDriverInfo(this.formGroup.value, this.formGroup.value._id)
  //       .subscribe((data) => {
  //         console.log('driver updated successfully', data);
  //       });
  //   }
  // }


onUpdate(): void {
  const formValue = this.formGroup.value;

  if (!formValue._id && this.dataToShow!=='Company Details') {
    this.toastr.error('Update operation cannot proceed without an ID.', 'Error');
    console.error('ID is missing in form value. Update operation cannot proceed.');
    return;
  }


  // Function to handle success and error responses
  const handleResponse = (data: any, entity: string) => {
    if (data.success) {
      console.log(`${entity} updated successfully`, data);
      console.log(entity);
      
      this.dataService.sendData(entity);
      this.toastr.success(`${entity} updated successfully`, 'Success');
    } else {
      console.error(`${entity} update failed:`, data.text);
      this.toastr.error(data.text || 'An error occurred while updating.', 'Error');
    }
  };

  // Common function to handle errors in subscriptions
  const handleError = (error: any) => {
    console.error('An error occurred during the update operation:', error);
    this.toastr.error('An unexpected error occurred. Please try again later.', 'Error');
  };

  // Update Driver Details
  if (this.formTitle === 'Driver Details') {
    this.formGroup.patchValue({ status: 'Active' }); // Update the status
    console.log('Updating Driver:', formValue._id);

    this.driverData.updateDriverInfo(formValue, formValue._id).subscribe({
      next: (data) => handleResponse(data, 'Drivers'),
      error: handleError,
    });

  // Update Truck Details
  } else if (this.formTitle === 'Truck Details') {
    console.log('Updating Truck:', formValue._id);

    this.driverData.updateTruckInfo(formValue, formValue._id).subscribe({
      next: (data) => handleResponse(data, 'Trucks'),
      error: handleError,
    });

    // Default Case (Fallback)
  } else if (this.dataToShow === 'Company Details') {
    console.log('Updating company:',this.userId);

    this.driverData.updateTruckInfo(formValue, formValue._id).subscribe({
      next: (data) => handleResponse(data, 'Trucks'),
      error: handleError,
    });

    // Default Case (Fallback)
  } else {
    console.log('Updating Default Entity (Driver):', formValue._id);

    this.driverData.updateDriverInfo(formValue, formValue._id).subscribe({
      next: (data) => handleResponse(data, 'Driver'),
      error: handleError,
    });
  }
}


  onDelete(): void {
    console.log('Delete action');
  }

  onCancel(): void {
    if (this.formTitle === 'Truck Details'){
      this.dataService.sendData('Trucks');
    }
     if (this.formTitle === 'Driver Details') {
       this.dataService.sendData('Drivers');
     }
     if(this.dataToShow==='Company Details'){
       this.dataService.sendData('Dashboard');
     }
  }
  onApprove() {
    const formData = this.formGroup.value; // Get the form values
    console.log('the form dtat is', formData);
    console.log(this.companyRefId);

    // Determine which service to use based on the route
    const isCarrierAdmin = this.router.url.includes('/carrier/admin');

    if (formData.LicensePlateNumber) {
      this.formGroup.patchValue({ Status: 'Active' });
      this.formGroup.patchValue({ companyRefId: this.companyRefId }); // Update the status

      const service = isCarrierAdmin ? this.driverData : this.userData; // Choose service dynamically

      service
        .updateTruckInfo(this.formGroup.value, this.vehicleId)
        .subscribe((data) => {
          console.log('Vehicle updated successfully');
        });
    } else {
      this.formGroup.patchValue({ status: 'Active' }); // Update the status
      console.log(this.formGroup.value.id); // Check updated values

      const service = isCarrierAdmin ? this.driverData : this.userData; // Choose service dynamically

      service
        .updateDriverInfo(this.formGroup.value, this.formGroup.value.id)
        .subscribe((data) => {
          console.log('Driver updated successfully');
        });
    }
  }
  onReject() {}
}
