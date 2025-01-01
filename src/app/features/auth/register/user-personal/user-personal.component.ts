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
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      emergencyContactName: [''],
      emergencyContactNumber: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
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
         this.buttonActivate.emit(true);
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
}
