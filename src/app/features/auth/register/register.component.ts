import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { PersoanlInfoComponent } from './company-info/persoanl-info.component';
import { User } from '../../../shared/models/user';
import { UserRegistrationState } from './store/user-registration.state';
import { startRegistration } from './store/user-registration.actions';
import {
  selectError,
  selectLoading,
  selectUser,
} from './store/user-registration.selectors';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPersonalComponent } from './user-personal/user-personal.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AddressComponent } from './address/address.component';
import { PasswordComponent } from './password/password.component';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs';
import { AppAdminComponent } from './app-admin/app-admin.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';
import { RegisterFailureComponent } from './register-failure/register-failure.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    PersoanlInfoComponent,
    RoleSelectionComponent,
    UserPersonalComponent,
    ButtonComponent,
    AddressComponent,
    PasswordComponent,
    AppAdminComponent,
    RegisterSuccessComponent,
    RegisterFailureComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  @Output() submitEvent = new EventEmitter<void>();
  @Output() indexChanger = new EventEmitter<number>();
  private fb: FormBuilder = inject(FormBuilder);
  registrationForm!: FormGroup;
  private store: Store = inject(Store<UserRegistrationState>);
  private authService = inject(AuthService);

  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  user$ = this.store.select(selectUser);
  @Output() buttonStatus = new EventEmitter<boolean>();
  stepsList = [{ stepName: 'Choose A Role', isComplete: false, index: 1 }];

  usersList = [
    'shipperAdmin',
    'carrierAdmin',
    'driver',
    'shipperStaff',
    'appAdmin',
  ];
  activeUser = 'shipperAdmin';
  activeStepIndex = 0;
  activeStep = this.stepsList[this.activeStepIndex];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.registrationForm = this.fb.group({});
    this.registrationForm = this.fb.group({
      role: ['', Validators.required],
      name: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      }),
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],

      password: ['', Validators.required],
      companyRefId: [''],
      personalDetails: this.fb.group({
        emergencyContact: this.fb.group({
          name: [''],
          phoneNumber: [''],
          address: this.fb.group({
            addressLine1: [''],
            addressLine2: [''],
            city: [''],
            state: [''],
            postalCode: [''],
          }),
        }),
      }),
      companyDetails: this.fb.group({
        companyName: [''],
        companyEmail: [''],
        companyPhone: [''],
        taxId: [''],
        address: this.fb.group({
          addressLine1: [''],
          addressLine2: [''],
          city: [''],
          state: [''],
          postalCode: [''],
        }),
      }),
    });
  }
  company: string = '';
  endUser_role: string = 'appAdmin';
  fields: {}[] = [];
  index = 0;
  isCompleted: boolean = false;
  registrationStatus: boolean = false;
  registrationMessage: string = '';
  firstName: string = '';

  incrementIndexOfRole(index: number) {
    this.submitEvent.emit();
    if (this.activeStepIndex < this.stepsList.length - 1) {
      this.activeStepIndex++;
      this.activeStep = this.stepsList[this.activeStepIndex];
      if (this.activeStep.isComplete) {
        this.onSubmit();
      }
    }

    console.log(this.activeStepIndex);
  }
  decrementIndexOfRole(index: number) {
    this.submitEvent.emit();
    if (this.activeStepIndex > 0) {
      this.activeStepIndex--;
      this.activeStep = this.stepsList[this.activeStepIndex];
    }
    console.log(this.activeStepIndex);
  }
  handleMessage(response: any) {
    console.log('message received', response.message);
    this.isCompleted = true;
    this.registrationStatus = response.success;
    this.registrationMessage = response.message;
    this.firstName = response.firstName;
  }
  selectEndUser(userRole: string) {
    this.endUser_role = userRole;
    this.registrationForm.get('role')?.setValue(userRole);

    if (userRole == 'carrierAdmin' || userRole == 'shipperAdmin') {
      this.stepsList = [
        { stepName: 'Choose A Role', isComplete: false, index: 1 },
        { stepName: 'Company Information', isComplete: false, index: 2 },
        { stepName: 'Company Address', isComplete: false, index: 3 },
        { stepName: 'Admin Details', isComplete: false, index: 4 },

        { stepName: 'Submit', isComplete: false, index: 5 },
        { stepName: 'Registration Successful!', isComplete: true, index: 6 },
      ];
    } else {
      this.stepsList = [
        { stepName: 'Choose A Role', isComplete: false, index: 1 },
        { stepName: 'Personal Information', isComplete: false, index: 2 },
        { stepName: 'Your Address', isComplete: false, index: 3 },
        { stepName: 'Submit', isComplete: false, index: 4 },
        { stepName: 'Registration Successful!', isComplete: true, index: 5 },
      ];
    }
    this.buttonStatus.emit(true);
  }
  navigateToRegister() {
    this.isCompleted = false;
    this.registrationStatus = false;
  }
  navigateToLogin(role: string) {
    if (this.endUser_role === 'admin') {
      this.router.navigate([`/${role}`]);
    } else if (role === 'carrierAdmin') {
      this.router.navigate([`/carrier`]);
    } else if (role === 'shipperAdmin') {
      this.router.navigate([`/shipper`]);
    } else if (role === 'driver') {
       this.router.navigate([`/carrier/driver`]);
    }
    }
   
  handleButtonStatus(event: any) {
    if (event===true) {
      this.buttonStatus.emit(true);
    }else{
      console.log('button status reaching here');
       this.buttonStatus.emit(false);
      
    }
  }
  onSubmit() {
    console.log('final step listing user', this.user$);
    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.authService.registerUser(user).subscribe(
          (response) => {
            console.log('User registered successfully:', response);
            this.deleteLocalStorageItems()
            this.isCompleted = true;
            
            this.firstName = response.firstName;
            if(response.success){
              console.log('success activated');
              this.registrationStatus = response.success;
              this.registrationMessage = response.message;
            }
             if (!response.success) {
              console.log('error activated');
              
               this.registrationStatus = false;
               this.registrationMessage = response.message;

               console.log('the end user is ',this.endUser_role);
               console.log('registrationStatus', this.registrationStatus);
               
             }
          },
          (error) => {
            console.error('Error registering user:', error);
            this.deleteLocalStorageItems();
            this.isCompleted = true;
            this.registrationStatus = error.error.success;
            this.registrationMessage = error.error.message;
            this.firstName = error.error.firstName;
          }
        );
      }
    });
  }
  deleteLocalStorageItems() {
    localStorage.removeItem('driverEmail');
    localStorage.removeItem('invitationToken');
    localStorage.removeItem('companyRefId');
    console.log('Items deleted from localStorage');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const companyRefId = params['companyRefId'];
      const email = params['email'];
      if (token) {
        localStorage.setItem('invitationToken', token);
        localStorage.setItem('companyRefId', companyRefId);
        localStorage.setItem('driverEmail', email);
      }
    });

    this.loading$.subscribe((loading) => console.log('Loading:', loading));

    const url = this.router.url;
    if (url.includes('/shipper/register')) {
      this.company = 'shipper';
      this.endUser_role = 'shipperAdmin';
      this.fields = [
        { endUser: 'shipperAdmin', text: 'COMPANY' },
        { endUser: 'shipperStaff', text: 'STAFF' },
      ];
    } else if (url.includes('/carrier/driver/register')) {
      this.company = 'carrier';
      this.endUser_role = 'driver';
      this.fields = [
        { endUser: 'carrierAdmin', text: 'COMPANY' },
        { endUser: 'driver', text: 'DRIVER' },
      ];
    } else if (url.includes('/carrier/register')) {
      this.company = 'carrier';
      this.endUser_role = 'carrierAdmin';
      this.fields = [
        { endUser: 'carrierAdmin', text: 'COMPANY' },
        { endUser: 'driver', text: 'DRIVER' },
      ];
    }
  }
}
