import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor(private router: Router) {}

  // Get user data
  getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  getAppAdminData(): any {
    const userData = localStorage.getItem('appAdminData');
    return userData ? JSON.parse(userData) : null;
  }
  getShipperAdminData(): any {
    const userData = localStorage.getItem('shipperAdminData');
    return userData ? JSON.parse(userData) : null;
  }
  getCarrierAdminData(): any {
    const userData = localStorage.getItem('carrierAdminData');
    return userData ? JSON.parse(userData) : null;
  }
  getDriverData(): any {
    const userData = localStorage.getItem('driverData');
    return userData ? JSON.parse(userData) : null;
  }

  getUserId(): string {
    const currentPath = this.router.url; // Get the current URL

    let userData: any = null;

    if (currentPath.startsWith('/admin/dashboard')) {
      userData = this.getAppAdminData();
    } else if (currentPath.startsWith('/carrier/admin/dashboard')) {
      userData = this.getCarrierAdminData();
    } else if (currentPath.startsWith('/shipper/admin/dashboard')) {
      userData = this.getShipperAdminData();
    } else if (currentPath.startsWith('carrier/driver/dashboard')) {
      userData = this.getDriverData();
    }

    return userData ? userData._id : '';
  }
}
