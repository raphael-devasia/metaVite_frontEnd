import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserRegistrationState } from '../store/user-registration.state';
import { Store } from '@ngrx/store';
import { createUserWithDefaults } from '../../../../utils/user-registration.utils';
import { User } from '../../../../shared/models/user';
import { updateUser } from '../store/user-registration.actions';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { selectUser } from '../store/user-registration.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  @Input() submitEvent!: EventEmitter<void>;
  @Input() userRole!: string;
  @Output() buttonActivate = new EventEmitter<boolean>();
  formGroup: FormGroup;
  currentUser$!: Observable<User | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<UserRegistrationState>
  ) {
    this.formGroup = this.fb.group({
      addressLine1: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9][\sa-zA-Z0-9-/,]+[a-zA-Z0-9]$/),
          // Starts with alphanumeric, allows spaces/hyphens/commas/forward slashes in between, ends with alphanumeric
        ],
      ],

      addressLine2: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9][\sa-zA-Z0-9-/,]+[a-zA-Z0-9]$/),
          // Same pattern as addressLine1 but not required
        ],
      ],

      city: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z][\sa-zA-Z]+$/),
          // Only letters and spaces, must start with a letter
        ],
      ],

      state: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Andaman and Nicobar Islands|Chandigarh|Dadra and Nagar Haveli and Daman and Diu|Delhi|Jammu and Kashmir|Ladakh|Lakshadweep|Puducherry)$/
          ),
          // Exact match for valid Indian states and union territories
        ],
      ],

      postalCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[1-9][0-9]{5}$/),
          // Indian postal code validation:
          // - Must be exactly 6 digits
          // - Cannot start with 0
          // - Cannot be all zeros
        ],
      ],
    });
  }

  ngOnInit(): void {
    console.log('this value is from the address component', this.userRole);

    this.currentUser$ = this.store.pipe(select(selectUser));
    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser) {
        if (this.userRole === 'driver' || this.userRole === 'shipperStaff') {
          const address = currentUser.personalDetails?.address;
          this.formGroup.patchValue({
            addressLine1: address?.addressLine1 || '',
            addressLine2: address?.addressLine2 || '',
            city: address?.city || '',
            state: address?.state || '',
            postalCode: address?.postalCode || '',
          });
        } else {
          const address = currentUser.companyDetails?.address;
          this.formGroup.patchValue({
            addressLine1: address?.addressLine1 || '',
            addressLine2: address?.addressLine2 || '',
            city: address?.city || '',
            state: address?.state || '',
            postalCode: address?.postalCode || '',
          });
        }
        setTimeout(() => {
          if (
            this.formGroup.valid &&
            !this.formGroup.touched &&
            !this.formGroup.dirty
          ) {
            this.buttonActivate.emit(true); // Emit only if form is valid and neither touched nor dirty
          }
        });
      }
    });

    this.formGroup.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        console.log('valid activated');
        this.buttonActivate.emit(true); // Emit true if form is valid
      } else {
        console.log('invalid activated');
        
        this.buttonActivate.emit(false); // Emit false if form is not valid
      }
    });


    this.submitEvent.subscribe(() => this.onsubmit());
  }

  onsubmit() {
    console.log('onsubmit initiated');

    const formValues = this.formGroup.value;

    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser) {
        console.log(currentUser);

        let updatedUser: Partial<User> = { ...currentUser }; // Clone current user

        if (this.userRole === 'driver' || this.userRole === 'shipperStaff') {
          updatedUser = {
            ...currentUser,

            personalDetails: {
              ...currentUser.personalDetails,
              address: {
                addressLine1: formValues.addressLine1,
                addressLine2: formValues.addressLine2,
                city: formValues.city,
                state: formValues.state,
                postalCode: formValues.postalCode,
              },
            },
          };
        } else {
          updatedUser = {
            ...currentUser,

            companyDetails: {
              ...currentUser.companyDetails,
              address: {
                addressLine1: formValues.addressLine1,
                addressLine2: formValues.addressLine2,
                city: formValues.city,
                state: formValues.state,
                postalCode: formValues.postalCode,
              },
            },
          };
        }

        this.store.dispatch(updateUser({ user: updatedUser }));
        console.log('Updated User:', updatedUser);
      }
    });
  }
  isFormValid(): boolean {
    return this.formGroup.valid;
  }

  // Helper method to get error messages
  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${controlName} is required`;
    }

    if (control.hasError('pattern')) {
      switch (controlName) {
        case 'postalCode':
          return 'Please enter a valid 6-digit Indian postal code';
        case 'state':
          return 'Please select a valid Indian state/union territory';
        default:
          return `Invalid ${controlName} format`;
      }
    }

    if (control.hasError('minlength')) {
      return `${controlName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }

    if (control.hasError('maxlength')) {
      return `${controlName} cannot exceed ${control.errors?.['maxlength'].requiredLength} characters`;
    }

    return '';
  }
}
