import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserRegistrationState } from '../store/user-registration.state';
import { updateUser } from '../store/user-registration.actions';
import { User } from '../../../../shared/models/user';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { createUserWithDefaults } from '../../../../utils/user-registration.utils';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { selectUser } from '../store/user-registration.selectors';

@Component({
  selector: 'app-user-personal',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './user-personal.component.html',
  styleUrls: ['./user-personal.component.css'],
})
export class UserPersonalComponent implements OnInit {
  @Input() submitEvent!: EventEmitter<void>;
  @Output() buttonActivate = new EventEmitter<boolean>();
  formGroup: FormGroup;
  currentUser$!: Observable<User | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<UserRegistrationState>
  ) {
    this.formGroup = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
          // Allows letters, spaces, dots, apostrophes, hyphens
          // Must start with letter
        ],
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
          // Same pattern as firstName
        ],
      ],

      emergencyContactName: [
        '',
        [
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
          // Optional but if provided, must follow name format
        ],
      ],

      emergencyContactNumber: [
        '',
        [
          Validators.pattern(
            /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/
          ),
          // Indian phone number validation
          // Optional +91 prefix
          // Must start with 6, 7, 8, or 9
          // Total 10 digits after prefix
        ],
      ],
    });
  }

  ngOnInit(): void {
    console.log('UserPersonalComponent initialized');
    this.currentUser$ = this.store.pipe(select(selectUser));
    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser) {
        this.formGroup.patchValue({
          firstName: currentUser.name?.firstName || '',
          lastName: currentUser.name?.lastName || '',
          emergencyContactName:
            currentUser.personalDetails?.emergencyContact?.name || '',
          emergencyContactNumber:
            currentUser.personalDetails?.emergencyContact?.phoneNumber || '',
        });
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
        this.buttonActivate.emit(true); // Emit true if form is valid
      } else {
        this.buttonActivate.emit(false); // Emit false if form is not valid
      }
    });

    this.submitEvent.subscribe(() => this.onSubmit());
  }

  onSubmit() {
    const formValues = this.formGroup.value;
    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser) {
        const updatedUser: Partial<User> = {
          ...currentUser,
          personalDetails: {
            ...currentUser.personalDetails,
            emergencyContact: {
              ...currentUser.personalDetails?.emergencyContact,
              name: formValues.emergencyContactName,
              phoneNumber: formValues.emergencyContactNumber,
            },
          },
          name: {
            ...currentUser.name,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
          },
        };

        this.store.dispatch(updateUser({ user: updatedUser }));
        console.log('Personal Details Updated:', updatedUser);
      } else {
        const updatedUser: User = createUserWithDefaults({
          personalDetails: {
            emergencyContact: {
              name: formValues.emergencyContactName,
              phoneNumber: formValues.emergencyContactNumber,
            },
          },
          name: {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
          },
        });
        this.store.dispatch(updateUser({ user: updatedUser }));
        console.log('Personal Details Updated:', updatedUser);
      }
    });
  }
  // Helper method for error messages
  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${controlName.replace(/([A-Z])/g, ' $1').trim()} is required`;
    }

    if (control.hasError('minlength')) {
      return `${controlName
        .replace(/([A-Z])/g, ' $1')
        .trim()} must be at least ${
        control.errors?.['minlength'].requiredLength
      } characters`;
    }

    if (control.hasError('pattern')) {
      switch (controlName) {
        case 'firstName':
        case 'lastName':
        case 'emergencyContactName':
          return 'Please enter valid letters only (spaces and hyphens allowed)';
        case 'emergencyContactNumber':
          return 'Please enter a valid Indian phone number (e.g., +91 9876543210)';
      }
    }

    return '';
  }
}
