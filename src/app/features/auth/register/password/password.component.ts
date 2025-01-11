import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';
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
import { Observable } from 'rxjs';
import { select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { updateUser } from '../store/user-registration.actions';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit {
  @Input() submitEvent!: EventEmitter<void>;
  @Input() userRole!: string;
  @Output() buttonActivate = new EventEmitter<boolean>();
  formGroup: FormGroup;
  currentUser$!: Observable<User | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<UserRegistrationState>
  ) {
    this.formGroup = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
        ],
        companyRefId: [''],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Update form controls if `userRole` changes dynamically
    this.updateFormStateBasedOnRole();
    this.currentUser$ = this.store.pipe(select(selectUser));
    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser) {
        const companyRefId = localStorage.getItem('companyRefId') || '';
        const email = localStorage.getItem('driverEmail') || '';
        this.formGroup.patchValue({
          email: email || '',
          phoneNumber: currentUser.phoneNumber || '',
          companyRefId: companyRefId || '',
          password: currentUser.password || '',
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
        console.log('valid activated');
        this.buttonActivate.emit(true); // Emit true if form is valid
      } else {
        console.log('invalid activated');

        this.buttonActivate.emit(false); // Emit false if form is not valid
      }
    });
    this.submitEvent.subscribe(() => this.onsubmit());
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mustMatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  onsubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    const formValues = this.formGroup.value;

    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser) {
        let updatedUser: Partial<User> = { ...currentUser };

        if (this.userRole === 'driver' || this.userRole === 'shipperStaff') {
          const companyRefId = localStorage.getItem('companyRefId') || '';
          const email = localStorage.getItem('driverEmail') || '';
          updatedUser = {
            ...currentUser,
            email: email,
            phoneNumber: formValues.phoneNumber,
            companyRefId: companyRefId,
            password: formValues.password,
            role: this.userRole,
          };
        } else {
          updatedUser = {
            ...currentUser,
            email: formValues.email,
            phoneNumber: formValues.phoneNumber,
            password: formValues.password,
          };
        }

        this.store.dispatch(updateUser({ user: updatedUser }));
        console.log('Updated password:', updatedUser);
      }
    });
  }
  updateFormStateBasedOnRole() {
    if (this.userRole === 'driver') {
      this.formGroup.get('email')?.disable();
      this.formGroup.get('companyRefId')?.disable();
    } else {
      this.formGroup.get('email')?.enable();
      this.formGroup.get('companyRefId')?.enable();
    }
  }
}
