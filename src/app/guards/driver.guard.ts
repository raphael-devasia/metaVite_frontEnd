import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const driverGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject the Router instance
  const driverToken = localStorage.getItem('driverToken');

  if (driverToken) {
  
    
    return true; // Allow access if token is present
  }
  console.log(driverToken);
  // Redirect to '/carrier' if token is not present
  router.navigate(['/carrier/driver']);
  return false; // Deny access
};
