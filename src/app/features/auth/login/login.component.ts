import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginDetails } from '../../../shared/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Output() formSubmitEvent = new EventEmitter<{
    success: boolean;
    message: string;
  }>();
  formGroup: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.formGroup = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(9)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    const carrierAdminToken = localStorage.getItem('carrierAdminToken');
    const shipperAdminToken = localStorage.getItem('shipperAdminToken');
     const appAdminToken = localStorage.getItem('appAdminToken');
      const driverToken = localStorage.getItem('driverToken');

    // Check if the token is present and the current path is '/carrier'
    if (carrierAdminToken && this.router.url === '/carrier') {
      
      
      // Redirect to '/carrier/admin/dashboard'
      this.router.navigate(['/carrier/admin/dashboard']);
    }
    // Redirect logic for shipper
    if (shipperAdminToken && this.router.url === '/shipper') {
      this.router.navigate(['/shipper/admin/dashboard']);
      return; // Prevent further execution
    }
      if (appAdminToken && this.router.url === '/admin') {
        this.router.navigate(['/admin/dashboard']);
        return; // Prevent further execution
      }
       if (driverToken && this.router.url === '/carrier/driver') {
        console.log(this.router.url);
         this.router.navigate(['/carrier/driver/dashboard']);
         return; // Prevent further execution
       }
  }

  navigateToRegister(): void {
    console.log('button clicked');
    const currentUrl = this.router.url;
    this.router.navigate([`${currentUrl}/register`]);
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const formValues = this.formGroup.value;

    const user: LoginDetails = {
      username: formValues.username,
      password: formValues.password,
    };

    this.authService.loginUser(user).subscribe(
      (response) => {
        console.log('Login successful:', response.success);
        if (response.success) {
          let role = response.user.role;
          if (role === 'appAdmin') {
            localStorage.setItem('appAdminToken', response.token);
            localStorage.setItem('appAdminData', JSON.stringify(response.user));
          } else if (role === 'shipperAdmin') {
            localStorage.setItem('shipperAdminToken', response.token);
            localStorage.setItem(
              'shipperAdminData',
              JSON.stringify(response.user)
            );
          } else if (role === 'carrierAdmin') {
            localStorage.setItem('carrierAdminToken', response.token);
            localStorage.setItem(
              'carrierAdminData',
              JSON.stringify(response.user)
            );
          } else if (role === 'driver') {
            localStorage.setItem('driverToken', response.token);
            localStorage.setItem('driverData', JSON.stringify(response.user));
          }
          // localStorage.setItem('userToken', response.token);
          // localStorage.setItem('userData', JSON.stringify(response.user));

          if (response.user.role === 'appAdmin') {
            this.router.navigate(['admin/dashboard']);
          } else if (response.user.role === 'carrierAdmin')
            this.router.navigate(['carrier/admin/dashboard']);
          else if (response.user.role === 'shipperAdmin')
            this.router.navigate(['shipper/admin/dashboard']);
          else if (response.user.role === 'driver')
            this.router.navigate(['carrier/driver/dashboard']);
          else {
            this.router.navigate(['shipper/staff/dashboard']);
          }
          // this.formSubmitEvent.emit({
          //   success: true,
          //   message: 'Form submitted successfully',
          // });
        } else {
          this.errorMessage = response.message;
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      },
      (error) => {
        this.formGroup.reset(); // Clear the form
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed. Please try again.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
        // this.formSubmitEvent.emit({
        //   success: false,
        //   message: 'Login failed',
        // });
      }
    );
  }
}
