import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../shared/models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './app-admin.component.html',
  styleUrls: ['./app-admin.component.css'],
})
export class AppAdminComponent implements OnInit {
  @Input() submitEvent!: EventEmitter<void>;
  @Input() userRole!: string;
  @Output() formStatusEvent = new EventEmitter<boolean>();
  @Output() messageEvent = new EventEmitter<{
    success: boolean;
    message: string;
  }>();
  formGroup: FormGroup;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.formGroup = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
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
        confirm_password: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.submitEvent.subscribe(() => this.onsubmit());
    this.formGroup.statusChanges.subscribe((status) => {
      if(this.formGroup.valid)
      this.formStatusEvent.emit(this.formGroup.valid);
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirm_password');
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mustMatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    }
  }

  onsubmit() {
    if (this.formGroup.invalid || this.isSubmitting){
       return 
      } 
       this.isSubmitting = true;

    const formValues = this.formGroup.value;

    const user: User = {
      name: {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
      },
      role: this.userRole,
      email: formValues.email,
      password: formValues.password,
      phoneNumber: '',
      companyDetails: {
        companyName: '',
        companyEmail: '',
        companyPhone: '',
        taxId: '',
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
        },
      },
      personalDetails: {
        emergencyContact: {
          name: '',
          phoneNumber: '',
        },
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
        },
      },
    };

    this.authService.registerUser(user).subscribe(
      (response) => {
        console.log('User registered successfully:', response);
        this.messageEvent.emit(response);
        this.isSubmitting = false;
      },
      (error) => {
        console.error('Error registering user:', error.error.message);
        this.messageEvent.emit(error.error);
        this.isSubmitting = false ;
      }
    );
  }
}
