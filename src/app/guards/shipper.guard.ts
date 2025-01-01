import { CanActivateFn } from '@angular/router';

export const shipperGuard: CanActivateFn = (route, state) => {
   const shipperAdminToken = localStorage.getItem('shipperAdminToken');

   if (shipperAdminToken) {
     return true;
   }
   return false;
};
