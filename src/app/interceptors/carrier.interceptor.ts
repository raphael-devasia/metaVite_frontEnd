import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const carrierInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService); // Inject the toast service

  console.log('This is from the interceptor');

  // Initialize token as null
  let token: string | null = null;
  let baseUrl = 'http://a4624d01d367b4e51ae51cbe6f066c92-452922102.eu-north-1.elb.amazonaws.com:4000/';

  // // Check if the request URL starts with specific paths
  // if (req.url.startsWith('http://localhost:4000/shipper')) {
  //   token = localStorage.getItem('shipperAdminToken');
  // }
  // // else if (req.url.startsWith('http://localhost:4000/carrier/driver')) {
  // //   token = localStorage.getItem('driverToken');
  // // }
  // else if (req.url.startsWith('http://localhost:4000/carrier/staff-driver')) {
  //   token = localStorage.getItem('driverToken');
  // } else if (req.url.startsWith('http://localhost:4000/carrier/')) {
  //   token = localStorage.getItem('carrierAdminToken');
  // } else if (req.url.startsWith('http://localhost:4000/admin')) {
  //   token = localStorage.getItem('appAdminToken');
  // }
  // Check if the request URL starts with specific paths
  if (req.url.startsWith(`${baseUrl}shipper`)) {
    token = localStorage.getItem('shipperAdminToken');
  }
  // else if (req.url.startsWith(`${baseUrl}carrier/driver`)) {
  //   token = localStorage.getItem('driverToken');
  // }
  else if (req.url.startsWith(`${baseUrl}carrier/staff-driver`)) {
    token = localStorage.getItem('driverToken');
  } else if (req.url.startsWith(`${baseUrl}carrier/`)) {
    token = localStorage.getItem('carrierAdminToken');
  } else if (req.url.startsWith(`${baseUrl}admin`)) {
    token = localStorage.getItem('appAdminToken');
  }

  // Clone the request and add the Authorization header if a token exists
  const clonedReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  console.log(clonedReq);
  //  return next(clonedReq);

  // Pass the cloned request to the next handler and handle errors
  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Show a toaster for unauthorized errors
        toastr.error(
          'You are not authorized to perform this action.',
          'Unauthorized'
        );
      } else if (error.status === 403) {
        // Handle forbidden errors
        toastr.warning(
          'You do not have permission to perform this action.',
          'Forbidden'
        );
      } else if (error.status === 500) {
        // Handle server errors
        toastr.error(
          'An unexpected server error occurred. Please try again later.',
          'Server Error'
        );
      } else {
        // Handle other errors
        toastr.error(
          'An error occurred while processing your request.',
          'Error'
        );
      }
      console.error('HTTP Error:', error);
      return throwError(() => error); // Re-throw the error for further handling
    })
  );
};
