import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { MatIcon } from '@angular/material/icon';
interface MenuButton {
  text: string;
  icon: string;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,MatIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})

export class SidebarComponent implements OnInit {
  
  @Input() buttonTexts: MenuButton[] = [];
  @Output() buttonClick = new EventEmitter<string>();
  localStorageServices = inject(LocalstorageService);
  user!: string;
  userDetails: any;
  constructor(private router: Router) {}
  onButtonClick(text: string) {
    this.buttonClick.emit(text);
  }
  ngOnInit(): void {
    const currentPath = this.router.url; // Get the current URL

    if (currentPath.startsWith('/admin/dashboard')) {
      this.user = 'admin';
      this.userDetails = this.localStorageServices.getAppAdminData();
    } else if (currentPath.startsWith('/carrier/admin/dashboard')) {
      this.user = 'carrier';
      this.userDetails = this.localStorageServices.getCarrierAdminData();
    } else if (currentPath.startsWith('/shipper/admin/dashboard')) {
      this.user = 'shipper';
      this.userDetails = this.localStorageServices.getShipperAdminData();
    } else if (currentPath.startsWith('/carrier/driver/dashboard')) {
      this.user = 'driver';
      this.userDetails = this.localStorageServices.getDriverData();
    }
  }
}
