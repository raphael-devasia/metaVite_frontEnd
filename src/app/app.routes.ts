import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { LoginComponent } from './features/auth/login/login.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ShipperLayoutComponent } from './layouts/shipper-layout/shipper-layout.component';
import { CarrierLayoutComponent } from './layouts/carrier-layout/carrier-layout.component';

import { DriverLayoutComponent } from './layouts/driver-layout/driver-layout.component';
import { LoadFormComponent } from './shared/components/load-form/load-form.component';
import { BiddingComponent } from './features/bidding/bidding/bidding.component';
import { SuccessComponent } from './shared/components/success/success.component';

import { VehicleFormComponent } from './shared/components/vehicle-form/vehicle-form.component';
import { ChatComponent } from './features/chat/chat/chat.component';
import { carrierGuard } from './guards/carrier.guard';
import { shipperGuard } from './guards/shipper.guard';
import { adminGuard } from './guards/admin.guard';
import { driverGuard } from './guards/driver.guard';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { InvoiceComponent } from './shared/components/invoice/invoice.component';
import { RegisterFailureComponent } from './features/auth/register/register-failure/register-failure.component';
import { RegisterSuccessComponent } from './features/auth/register/register-success/register-success.component';

export const routes: Routes = [
  // route for user logins-
  { path: 'admin', component: LoginComponent },
  { path: 'shipper', component: LoginComponent },
  { path: 'carrier', component: LoginComponent },
  { path: 'carrier/driver', component: LoginComponent },

  // Route for user registration
  { path: 'admin/register', component: RegisterComponent },
  { path: 'shipper/register', component: RegisterComponent },
  { path: 'carrier/register', component: RegisterComponent },
  { path: 'carrier/driver/register', component: RegisterComponent },

  // Routes for user dashboards
  {
    path: 'admin/dashboard',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'shipper/admin/dashboard',
    component: ShipperLayoutComponent,
    canActivate: [shipperGuard],
  },
  {
    path: 'carrier/driver/dashboard',
    component: DriverLayoutComponent,
    canActivate: [driverGuard],
  },

  {
    path: 'carrier/admin/dashboard',
    component: CarrierLayoutComponent,
    canActivate: [carrierGuard],
  },

  { path: '', component: HomePageComponent },

  // routes need to be deleted (for testing purpose)
  { path: 'test', component: VehicleFormComponent },
  { path: 'dashboard', component: InvoiceComponent },
  { path: 'loads', component: LoadFormComponent },
];
