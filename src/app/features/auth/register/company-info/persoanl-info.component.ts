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
      companyName: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\+?\d{1,4}[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
          ),
        ],
      ],
      taxId: ['', Validators.required],
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
      if (this.formGroup.valid) {
        this.buttonActivate.emit(true);
      } else {
        this.buttonActivate.emit(false);
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
}
