import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let carrierAdminToken;
  let shipperAdminToken;
  let appAdminToken;
  let driverToken;
  const router = inject(Router); // Inject the Router instance
  const routePath = route.routeConfig?.path;

  if (routePath === 'shipper/admin/dashboard' || 'shipper') {
    shipperAdminToken = localStorage.getItem('shipperAdminToken');
  } else if (routePath === 'carrier/admin/dashboard' || 'carrier') {
    carrierAdminToken = localStorage.getItem('carrierAdminToken');
  } else if (routePath === 'carrier/driver/dashboard' || 'driver') {
    driverToken = localStorage.getItem('driverToken');
  } else if (routePath === 'admin/dashboard' || 'admin') {
      let appAdminToken= localStorage.getItem('appAdminToken');
  }

  if (shipperAdminToken) {
    if (routePath === 'shipper') {
      router.navigate(['/shipper/admin/dashboard']);
    } 
    return true;
  } else {
     if (routePath === 'shipper/admin/dashboard') {
      router.navigate(['/shipper']);
    }
     // Ensure to return false to prevent navigation
  }
 
  return false
};




