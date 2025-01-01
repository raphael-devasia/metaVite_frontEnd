import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const carrierGuard: CanActivateFn = (route, state) => {


  const carrierAdminToken = localStorage.getItem('carrierAdminToken');

  if (carrierAdminToken) {
   return true;
  }
 return false
};
