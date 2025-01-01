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
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: [
        '',
        [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)],
      ],
    });
  }

  ngOnInit(): void {
    console.log('this value is from the address component', this.userRole);


// this.currentUser$ = this.store.pipe(select(selectUser));
// this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
//   console.log('currentUser$ emitted:', currentUser);
//   if (currentUser) {
//     console.log('currentUser available:', currentUser);
//     // The rest of your logic...
//   } else {
//     console.log('No current user found');
//   }
// });








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
        if (status==="VALID"){
        this.buttonActivate.emit(true);
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
}
