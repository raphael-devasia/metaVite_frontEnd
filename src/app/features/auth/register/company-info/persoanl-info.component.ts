import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../../shared/models/user';
import { UserRegistrationState } from '../store/user-registration.state';
import { Store } from '@ngrx/store';
import { selectUser } from '../store/user-registration.selectors';
import { updateUser } from '../store/user-registration.actions';
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { createUserWithDefaults } from '../../../../utils/user-registration.utils';

@Component({
  selector: 'app-persoanl-info',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './persoanl-info.component.html',
  styleUrls: ['./persoanl-info.component.css'],
})
export class PersoanlInfoComponent implements OnInit {
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
      companyName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9][\sa-zA-Z0-9-&.,]+[a-zA-Z0-9]$/),
          // Allows letters, numbers, spaces, hyphens, ampersands, dots, and commas
          // Must start and end with alphanumeric
        ],
      ],

      companyEmail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          // Stricter email validation
        ],
      ],

      companyPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/
          ),
          // Indian phone number validation:
          // - Optional +91 or 91 prefix
          // - Must start with 6, 7, 8, or 9
          // - Total 10 digits after prefix
        ],
      ],

      taxId: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
          ),
          // GSTIN validation:
          // - 15 characters
          // - Format: 22AAAAA0000A1Z5
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.currentUser$ = this.store.pipe(select(selectUser));
    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser && currentUser.companyDetails) {
        this.formGroup.patchValue({
          companyName: currentUser.companyDetails.companyName || '',
          companyEmail: currentUser.companyDetails.companyEmail || '',
          companyPhone: currentUser.companyDetails.companyPhone || '',
          taxId: currentUser.companyDetails.taxId || '',
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
      // if (this.formGroup.valid) {
      //   this.buttonActivate.emit(true);
      // } else {
      //   this.buttonActivate.emit(false);
      // }
       if (status === 'VALID') {
         
         this.buttonActivate.emit(true); // Emit true if form is valid
       } else {
        

         this.buttonActivate.emit(false); // Emit false if form is not valid
       }
    });

    this.submitEvent.subscribe(() => this.onsubmit());
  }

  onsubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    const formValues = this.formGroup.value;

    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser) {
        const updatedUser: Partial<User> = {
          ...currentUser,
          companyDetails: {
            ...currentUser.companyDetails,
            companyName: formValues.companyName,
            companyEmail: formValues.companyEmail,
            companyPhone: formValues.companyPhone,
            taxId: formValues.taxId,
          },
        };
        this.store.dispatch(updateUser({ user: updatedUser }));
        console.log('Updated User in the company info:', updatedUser);
      } else {
        const updatedUser: User = createUserWithDefaults({
          companyDetails: {
            companyName: formValues.companyName,
            companyEmail: formValues.companyEmail,
            companyPhone: formValues.companyPhone,
            taxId: formValues.taxId,
          },
        });
        this.store.dispatch(updateUser({ user: updatedUser }));
        console.log('Updated User in the company info:', updatedUser);
      }
    });
  }
  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return `${controlName} is required`;
    }

    switch (controlName) {
      case 'companyName':
        if (control.hasError('minlength'))
          return 'Company name must be at least 3 characters';
        if (control.hasError('maxlength'))
          return 'Company name cannot exceed 100 characters';
        if (control.hasError('pattern'))
          return 'Company name can only contain letters, numbers, and basic punctuation';
        break;

      case 'companyEmail':
        if (control.hasError('email') || control.hasError('pattern'))
          return 'Please enter a valid email address';
        break;

      case 'companyPhone':
        if (control.hasError('pattern'))
          return 'Please enter a valid Indian phone number (e.g., +91 9876543210)';
        break;

      case 'taxId':
        if (control.hasError('pattern'))
          return 'Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)';
        break;
    }

    return '';
  }
}
