import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
    const appAdminToken = localStorage.getItem('appAdminToken');

    if (appAdminToken) {
      return true;
    }
    return false;
};
