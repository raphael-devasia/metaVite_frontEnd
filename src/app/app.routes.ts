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

export const routes: Routes = [
  { path: 'test', component: ChatComponent },
  { path: 'shipper', component: LoginComponent },

  { path: 'carrier', component: LoginComponent },

  { path: 'admin', component: LoginComponent },
  { path: 'carrier/driver', component: LoginComponent },
  { path: 'shipper/register', component: RegisterComponent },
  { path: 'carrier/register', component: RegisterComponent },
  { path: 'admin/register', component: RegisterComponent },
  { path: 'dashboard', component: InvoiceComponent },

  { path: 'loads', component: LoadFormComponent },
  {
    path: 'carrier/driver/dashboard',
    component: DriverLayoutComponent,
    canActivate: [driverGuard],
  },

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
    path: 'carrier/admin/dashboard',
    component: CarrierLayoutComponent,
    canActivate: [carrierGuard],
  },

  { path: '', component: HomePageComponent },
];
