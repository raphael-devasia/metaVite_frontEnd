import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvitationFormComponent } from '../invitation-form/invitation-form.component';
import { Invitation } from '../../models/user';
import { EditDeleteViewComponent } from '../edit-delete-view/edit-delete-view.component';
import { UserService } from '../../../core/services/user/user.service';
import { DataService } from '../../services/data.service';
import { LoadFormComponent } from '../load-form/load-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdressModalComponent } from '../adress-modal/adress-modal.component';
import { ShipperService } from '../../../core/services/shipper/shipper.service';
import { MatIconModule } from '@angular/material/icon';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { Router } from '@angular/router';
import { CarrierService } from '../../../core/services/shipper/carrier/carrier.service';
import { DriverService } from '../../../layouts/driver-layout/services/driver.service';
import { RazorpayService } from '../../../core/services/razorpay.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { BidpriceSocketService } from '../../../core/services/user/bidprice-socket.service';
import { InvoiceComponent } from '../invoice/invoice.component';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { TrackerComponent } from '../tracker/tracker.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    EditDeleteViewComponent,
    ReactiveFormsModule,
    AdressModalComponent,
    MatIconModule,
    NgClass,
    FormsModule,
    DeleteModalComponent,
    TrackerComponent,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  protected Object = Object;
  localStorageServices = inject(LocalstorageService);
  user: any;
  id: string = '';
  showTable: boolean = false;
  filteredData: any;
  showDeleteModal: boolean = false;
  target!: string;
  targetId!: string;
  @Input() tabledata: {
    title: string;
    button: string;
    statuses: string[];
    tableHeads: string[];
    tableData: any[];
    paginatedData?: any[];
  } = {
    title: '',
    button: '',
    statuses: [],
    tableHeads: [],
    tableData: [],
    paginatedData: [],
  };

  getProcessedTableData(): any[] {
    return this.tabledata.tableData.map((row) =>
      Object.values(row).flatMap((value) =>
        typeof value === 'object' && value !== null
          ? Object.values(value)
          : value
      )
    );
  }

  @Output() driverInvitation = new EventEmitter<Invitation>();
  @Output() loadCreation = new EventEmitter<string>();
  UserServices = inject(UserService);
  ShipperServices = inject(ShipperService);
  CarrierServices = inject(CarrierService);
  DriverServices = inject(DriverService);
  @Input() updateResource!: (target: string) => void;
  showClientModal!: boolean;
  modalHeading: string = '';
  tableExpanded: boolean = false;
  loadData: any;
  selectedBidData: any;
  currentExpandedRow: any = null; // Add this property
  itemsPerPage = 10; // Number of items per page
  currentPage = 1; // Current page
  searchQuery: string = '';
  showNoContentMessage!: boolean;
  private originalTableData: any[] = [];
  private bidSubscription!: Subscription;

  activeStatus: string = 'Active';
  setActiveStatus(status: string) {
    this.activeStatus = status;
    // const filteredData =
    //   this.tabledata.paginatedData?.filter((item) => item.status === status) ||
    //   [];
    // if (filteredData.length === 0) {
    //   this.showNoContentMessage = true;
    // } else {
    //   this.showNoContentMessage = false;
    // }
  }
  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(DataService) private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private razorpayService: RazorpayService,
    private bidpriceSocketService: BidpriceSocketService
  ) {}
  openModal() {
    console.log('initaiated', this.tabledata.title);

    let dataToPass;
    if (this.tabledata.title === 'Drivers') {
      dataToPass = { heading: 'Invite A Driver' };

      const dialogRef = this.dialog.open(InvitationFormComponent, {
        width: '600px',
        data: dataToPass,
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe((result) => {
        let data;
        if (result.formHeading === 'Invite A Driver') {
          console.log(result.user);

          data = { ...result.user, companyRefId: this.user.companyRefId };
          console.log(data);
          this.driverInvitation.emit(data);
        }
      });
    } else if (this.tabledata.title === 'All Bids') {
      dataToPass = { heading: 'Create Load' };

      const dialogRef = this.dialog.open(LoadFormComponent, {
        maxWidth: '1000px',
        maxHeight: '100vh',
        data: dataToPass,
        panelClass: 'custom-dialog-container',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        let data;
        if (result.formHeading === 'Create Load') {
          console.log(result.user);

          data = { ...result.user, companyRefId: this.user.companyRefId };
          console.log(data);
          this.loadCreation.emit('success');
        }
      });
    } else if (this.tabledata.title === 'All Clients') {
      console.log('tanle daat is ', this.tabledata.title);

      this.openClientModal();
    } else if (this.tabledata.title === 'All Pickups') {
      console.log('tanle daat is ', this.tabledata.title);

      this.openPickupModal();
    } else if (this.tabledata.title === 'All Trucks') {
      dataToPass = { heading: 'Add Truck' };

      const dialogRef = this.dialog.open(VehicleFormComponent, {
        minWidth: '800px',
        maxHeight: '100vh',
        data: dataToPass,
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe((result) => {
        let data;
        if (result.formHeading === 'Add Truck') {
          console.log(result.user);

          data = { ...result.user, companyRefId: this.user.companyRefId };
          console.log(data);
          this.loadCreation.emit('success');
        }
      });
    }
  }
  ngOnInit(): void {
    const currentUrl = this.router.url;
    console.log(this.tabledata);

    if (currentUrl.includes('/carrier/admin/dashboard')) {
      this.user = this.localStorageServices.getCarrierAdminData();
    } else if (currentUrl.includes('/carrier/driver/dashboard')) {
      this.user = this.localStorageServices.getDriverData();
    } else if (currentUrl.includes('/shipper/admin/dashboard')) {
      this.user = this.localStorageServices.getShipperAdminData();
    } else if (currentUrl.includes('/admin/dashboard')) {
      this.user = this.localStorageServices.getAppAdminData();
    }
    // this.filteredData = this.tabledata.tableData.filter(
    //   (row) => row.status === this.activeStatus
    // );
    console.log('the data is ', this.getProcessedTableData());
    console.log(this.tabledata);
    this.originalTableData = [...this.tabledata.tableData];

    this.updatePaginatedData();
    // if (this.tabledata?.statuses.length > 0) {
    //   this.setActiveStatus(this.tabledata?.statuses[0]);
    // }
    if (this.tabledata?.statuses.length === 0) {
      this.showNoContentMessage = true;
    }
    this.setActiveStatus(this.tabledata.statuses[0]);
    //  const filteredData =
    //    this.tabledata.paginatedData?.filter((item) => item.status === this.tabledata?.statuses[0]) || [];
    //  if (filteredData.length === 0) {
    //    this.showNoContentMessage = true;
    //  } else {
    //    this.showNoContentMessage = false;
    //  }

    this.establishSocketConnection();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabledata'] && changes['tabledata'].currentValue) {
      console.log('tabledata changed', changes['tabledata'].currentValue);
      this.originalTableData = [...this.tabledata.tableData];
      this.updatePaginatedData();
      if (this.tabledata?.statuses.length === 0) {
        this.showNoContentMessage = true;
      } else {
        this.showNoContentMessage = false;
      }
    }
  }
  // Update the data to display based on current page
  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.tabledata.paginatedData = this.tabledata.tableData
      .reverse()
      .slice(startIndex, endIndex);
    console.log('Paginated data:', this.tabledata.paginatedData);
  }

  // Navigate to the next page
  goToNextPage(): void {
    if (
      this.currentPage * this.itemsPerPage <
      this.tabledata.tableData.length
    ) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }
  establishSocketConnection(): void {
    this.bidSubscription = this.bidpriceSocketService.lowestBid$.subscribe(
      (newBid: any) => {
        console.log('Received updated bid:', newBid);
        if (!newBid) {
          console.log(
            'No new bid data received, table data remains unchanged.'
          );
          return;
        }
        if (
          this.tabledata.title === 'All Bids' ||
          this.tabledata.title === 'All Loads' ||
          this.tabledata.title === 'Active Bids'
        ) {
          // Find the bid by loadRefId (bid.loadRefId) and update the lowestBid
          console.log(newBid.newBid);

          const updatedBids = this.tabledata.tableData.map((bid: any) => {
            if (bid._id === newBid.newBid.loadRefId) {
              return {
                ...bid,
                lowestBid: newBid.newBid.bid, // Update the lowestBid field
              };
            }
            return bid;
          });

          console.log(updatedBids);
          // Update the table data with the new bid info
          this.tabledata = {
            ...this.tabledata,
            tableData: updatedBids,
          };
        }
      }
    );
  }

  // Navigate to the previous page
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  // Get the total number of pages
  getPageNumbers(): number[] {
    return Array(Math.ceil(this.tabledata.tableData.length / this.itemsPerPage))
      .fill(0)
      .map((_, index) => index + 1);
  }

  // Navigate to a specific page
  goToPage(page: number): void {
    if (page > 0 && page <= this.getPageNumbers().length) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  // Get start index for display
  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  // Get end index for display
  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return endIndex > this.tabledata.tableData.length
      ? this.tabledata.tableData.length
      : endIndex;
  }

  openClientModal() {
    this.modalHeading = 'Add a Client';
    this.showClientModal = true;
  }
  onSearch(): void {
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      // Filter the data based on the search query across all fields
      this.tabledata.tableData = this.originalTableData.filter((item: any) => {
        // Check each property in the item, convert it to string and check if it includes the search query
        return Object.values(item).some((field: any) =>
          field
            ? field
                .toString()
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase())
            : false
        );
      });
    } else {
      // If search is cleared, restore the original data
      this.tabledata.tableData = [...this.originalTableData];
    }

    this.updatePaginatedData();
  }

  closeClientModal() {
    this.showClientModal = false;
    this.dataService.sendData('Customers');
  }
  openPickupModal() {
    this.modalHeading = 'Add a Pick-up Location';
    this.showClientModal = true;
  }

  closePickupModal() {
    this.showClientModal = false;
    this.dataService.sendData('Pick-up Locations');
  }
  openInvoiceModal(data: any) {
    const dialogRef = this.dialog.open(InvoiceComponent, {
      width: '90%', // Increased the width to 90%
      height: '90vh', // Set a height to limit the dialog size
      data: data,
      panelClass: 'custom-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }

  saveClient(clientData: any) {
    console.log('save client initiated');

    console.log(this.user);

    if (this.user) {
      const userId = this.user._id;

      this.handleClientData(userId);
      this.updateResource('Client Details');
    }

    this.closeClientModal();
  }
  savePickup(pickupData: any) {
    console.log('save pickup initiated');
    console.log(this.user);

    if (this.user) {
      const userId = this.user._id;

      this.handlePickupData(userId);
      this.updateResource('Pickup Details');
    }

    this.closePickupModal();
  }
  handleClientData(userId: string) {
    this.ShipperServices.getAllClients(userId).subscribe((data) => {
      console.log(data);
      this.cdr.detectChanges();
    });
  }
  handlePickupData(userId: string) {
    this.ShipperServices.getAllPickups(userId).subscribe((data) => {
      console.log(data);
      this.cdr.detectChanges();
    });
  }

  refreshTableData() {
    if (this.user) {
      const userId = this.user._id;
      this.ShipperServices.getAllClients(userId).subscribe((data) => {
        this.tabledata.tableData = data;
        this.cdr.detectChanges();
      });
    }
  }
  toggleExpand(row: any) {
    const currentRoute = this.router.url;
    console.log('Current Route:', currentRoute);

    if (currentRoute === '/carrier/admin/dashboard') {
      console.log(row._id);
      this.CarrierServices.getLoadInfo(row._id).subscribe((data) => {
        console.log(data.load);
        this.showTable = true;
        this.loadData = data.load;
        if (this.currentExpandedRow && this.currentExpandedRow !== row) {
          this.currentExpandedRow.expanded = false;
        }
        row.expanded = !row.expanded;
        this.currentExpandedRow = row.expanded ? row : null;
      });
    } else if (currentRoute === '/carrier/driver/dashboard') {
      console.log(row._id);
      this.DriverServices.getLoadInfo(row._id).subscribe((data) => {
        console.log(data.load);
        this.showTable = true;
        this.loadData = data.load;
        if (this.currentExpandedRow && this.currentExpandedRow !== row) {
          this.currentExpandedRow.expanded = false;
        }
        row.expanded = !row.expanded;
        this.currentExpandedRow = row.expanded ? row : null;
      });
    } else if (currentRoute === '/admin/dashboard') {
      console.log(row._id);
      this.UserServices.getLoadInfo(row._id).subscribe((data) => {
        console.log(data.load);
        this.showTable = true;
        this.loadData = data.load;
        if (this.currentExpandedRow && this.currentExpandedRow !== row) {
          this.currentExpandedRow.expanded = false;
        }
        row.expanded = !row.expanded;
        this.currentExpandedRow = row.expanded ? row : null;
      });
    } else {
      console.log(row._id);
      this.ShipperServices.getLoadInfo(row._id).subscribe((data) => {
        console.log(data.load);
        this.showTable = true;
        this.loadData = data.load;
        if (this.currentExpandedRow && this.currentExpandedRow !== row) {
          this.currentExpandedRow.expanded = false;
        }
        row.expanded = !row.expanded;
        this.currentExpandedRow = row.expanded ? row : null;
      });
    }
  }
  getAppointmentDateTime(appointment: string) {
    const [date, time] = appointment.split('T');
    return { date, time };
  }
  makeBid(data: any) {
    const action = { type: 'Bid', data: data._id };
    this.dataService.sendData(action);
  }
  makeBidAgain(data: any) {
    
    
    const action = { type: 'BidAgain', data: data._id };
    this.dataService.sendData(action);
  }
  getPayment(data: any) {
    console.log(data);
    const currentUrl = this.router.url;
    if (currentUrl.includes('/carrier/admin/dashboard')) {
      this.CarrierServices.getPayment(data.id).subscribe((result) => {
        console.log(result);

        this.openInvoiceModal(result.payments);
      });
    } else if (currentUrl.includes('/shipper/admin/dashboard')) {
      this.ShipperServices.getPayment(data.id).subscribe((result) => {
        this.openInvoiceModal(result.payments);
      });
    } else if (currentUrl.includes('/admin/dashboard')) {
      this.UserServices.getPayment(data.id).subscribe((result) => {
        this.openInvoiceModal(result.payments);
      });
    }
  }
  onBidderSelection(bidder: any) {
    this.loadData.selectedBidder = bidder._id;
    this.selectedBidData = bidder;
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj).filter(
      (key) => key !== '_id' && key !== 'expanded' && key !== 'id'
    );
  }
  // onSubmit() {
  //   if (this.loadData.selectedBidder) {
  //     this.ShipperServices.updateLoadInfo(this.loadData._id, {
  //       id: this.loadData.selectedBidder,
  //     }).subscribe((result) => {
  //       console.log(result);
  //     });
  //     console.log('Assigning load to bidder:', this.loadData.selectedBidder);
  //   }
  // }
  // onSubmit(): void {
  //   // Step 1: Check if there is a selected bidder
  //   console.log('The load data is ', this.loadData.selectedBidder);

  //   if (this.loadData.selectedBidder) {
  //     // Step 2: Create Razorpay Order by calling backend service
  //     this.ShipperServices.createRazorpayOrder(
  //       this.selectedBidData.bid,
  //       this.loadData._id,
  //       this.loadData.shipperRefId,
  //       this.selectedBidData.companyRefId
  //     ).subscribe(
  //       (orderData) => {
  //         // Step 3: Open Razorpay payment modal
  //         if (orderData.success) {
  //           console.log(orderData);
  //           this.razorpayService
  //             .openPaymentModal(orderData.orderData)
  //             .then((paymentSuccess: boolean) => {
  //               console.log('Payment Success:', paymentSuccess);

  //               if (paymentSuccess) {
  //                 console.log('Payment was successful');
  //                 // Step 4: After successful payment, update load info with selected bidder
  //                 this.ShipperServices.updateLoadInfo(this.loadData._id, {
  //                   id: this.loadData.selectedBidder,
  //                 }).subscribe(
  //                   (result) => {
  //                     console.log('Load updated successfully:', result);
  //                   },
  //                   (error) => {
  //                     console.error('Error updating load info:', error);
  //                   }
  //                 );
  //               } else {
  //                 console.log('Payment verification failed');
  //               }
  //             })
  //             .catch((error) => {
  //               console.error('Error during payment:', error);
  //             });
  //         }
  //       },
  //       (error) => {
  //         console.error('Error creating Razorpay order:', error);
  //       }
  //     );
  //   } else {
  //     console.log('No selected bidder');
  //   }
  // }
  async onSubmit(): Promise<void> {
    try {
      if (!this.loadData.selectedBidder) {
        console.log('No selected bidder');
        return;
      }

      // Step 1: Create Razorpay Order
      const orderResponse = await firstValueFrom(
        this.ShipperServices.createRazorpayOrder(
          this.selectedBidData.bid,
          this.loadData._id,
          this.loadData.shipperRefId,
          this.selectedBidData.companyRefId
        )
      );

      if (!orderResponse.success) {
        console.error('Failed to create order');
        return;
      }

      console.log('Order created:', orderResponse);

      // Step 2: Process Payment
      const paymentSuccess = await this.razorpayService.openPaymentModal(
        orderResponse.orderData
      );

      console.log('Payment process completed:', paymentSuccess);

      // Step 3: Update load info if payment was successful
      if (paymentSuccess) {
        try {
          const updateResult = await firstValueFrom(
            this.ShipperServices.updateLoadInfo(this.loadData._id, {
              id: this.loadData.selectedBidder,
            })
          );
          console.log('Load updated successfully:', updateResult);
        } catch (error) {
          console.error('Error updating load info:', error);
        }
      }
    } catch (error) {
      console.error('Error in submit process:', error);
    }
  }

  cancelShipment(id: string) {
    this.targetId = id;
    this.target = 'Cancelled';
    this.showDeleteModal = true;
    // this.CarrierServices.updateLoadInfo(id, 'Cancelled').subscribe((result) => {
    //   if (result.success) {
    //     console.log();
    //   }
    // });
  }
  deleteResource(id: string, target: string) {
    console.log(id, target);
    if (this.user.role === 'carrierAdmin') {
      this.CarrierServices.updateLoadInfo(id, { id: target }).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.toastr.success('Shipment cancelled successfully!', 'Success');
            this.dataService.sendData('Shipments');
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (err) => {
          console.error('Error cancelling shipment:', err);
          this.toastr.error(
            'Failed to cancel shipment. Please try again.',
            'Error'
          );
        },
      });
    }
    if (this.user.role === 'shipperAdmin') {
      this.ShipperServices.updateLoadInfo(id, { id: target }).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.toastr.success('Shipment cancelled successfully!', 'Success');
            this.dataService.sendData('Shipments');
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (err) => {
          console.error('Error cancelling shipment:', err);
          this.toastr.error(
            'Failed to cancel shipment. Please try again.',
            'Error'
          );
        },
      });
    }
  }

  updateStatus(id: string, status: string) {
    console.log('button clicked');

    if (this.user.role === 'driver') {
      this.DriverServices.updateLoadInfo(id, { id: status }).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.toastr.success('Shipment updated successfully!', 'Success');
            this.dataService.sendData('Shipments');
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (err) => {
          console.error('Error updating shipment:', err);
          this.toastr.error(
            'Failed to update shipment. Please try again.',
            'Error'
          );
        },
      });
    }
    if (this.user.role === 'shipperAdmin') {
      this.ShipperServices.updateLoadInfo(id, { id: status }).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.toastr.success('Shipment updated successfully!', 'Success');
            this.dataService.sendData('Shipments');
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (err) => {
          console.error('Error updating shipment:', err);
          this.toastr.error(
            'Failed to update shipment. Please try again.',
            'Error'
          );
        },
      });
    }
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
  }
  updateStatusToDelivered() {}
  shouldShowRow(row: any): boolean {
    // Normalize statuses for comparison
    const rowStatus = row.status?.trim().toLowerCase() || '';
    const activeStatus = this.activeStatus?.trim().toLowerCase() || '';

    if (!rowStatus) {
      return true;
    }
    console.log('the row status is ', rowStatus);
    console.log('the active status is ', activeStatus);

    // Handle 'Active' status group (e.g., Assigned, Dispatched, Delivered, Open)
    if (activeStatus === 'active') {
      // Show rows with 'Assigned' or 'Open' status when activeStatus is 'Active'
      return rowStatus === 'assigned' || rowStatus === 'open';
    }
    if (activeStatus === 'assigned') {
      // Show rows with 'Assigned' or 'Open' status when activeStatus is 'Active'
      return rowStatus === 'picked' || rowStatus === 'assigned';
    }
    if (activeStatus === 'dispatched') {
      // Show rows with 'Assigned' or 'Open' status when activeStatus is 'Active'
      return (
        rowStatus === 'picked' ||
        rowStatus === 'delivered1' ||
        rowStatus === 'delivered2' ||
        rowStatus === 'delivered3' ||
        rowStatus === 'delivered' ||
        rowStatus === 'delivered1-partial' ||
        rowStatus === 'delivered2-partial' ||
        rowStatus === 'delivered3-partial' ||
        rowStatus === 'dispatched'
      );
    }

    if (activeStatus === 'delivered') {
      // Show rows with 'Assigned' or 'Open' status when activeStatus is 'Active'
      return rowStatus === 'completed';
    }

    // Handle 'Open/Closed' status group
    if (activeStatus === 'open' || activeStatus === 'closed') {
      return rowStatus === activeStatus;
    }

    // Exact match for other statuses
    const isMatch = rowStatus === activeStatus;

    return isMatch;
  }
  getDriverActions(
    loadData: any
  ): { label: string; nextStatus: string; class: string }[] {
    const actions: any = [];
    if (!loadData) return actions;

    const { status, dropoffs } = loadData;

    const buttonClass =
      'bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded';

    if (status === 'Dispatched' && dropoffs === 1) {
      actions.push({
        label: 'Confirm Delivery',
        nextStatus: 'Delivered',
        class: buttonClass,
      });
    } else if (status === 'Dispatched' && dropoffs > 1) {
      actions.push({
        label: `Confirm Delivery 1`,
        nextStatus: 'Delivered1-Partial',
        class: buttonClass,
      });
    } else if (status === 'Delivered1' && dropoffs === 2) {
      actions.push({
        label: `Complete Delivery`,
        nextStatus: 'Delivered',
        class: buttonClass,
      });
    } else if (status === 'Delivered1' && dropoffs === 3) {
      actions.push({
        label: `Confirm Delivery 2`,
        nextStatus: 'Delivered2-Partial',
        class: buttonClass,
      });
    } else if (status === 'Delivered2' && dropoffs === 3) {
      actions.push({
        label: `Complete Delivery`,
        nextStatus: 'Delivered',
        class: buttonClass,
      });
    }

    return actions;
  }

  getShipperAction(
    loadData: any
  ): { label: string; nextStatus: string; class: string } | null {
    if (!loadData) return null;

    const { status, dropoffs } = loadData;

    const buttonClass =
      'bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded';

    if (status === 'Delivered' && dropoffs === 1) {
      return {
        label: 'Complete Delivery',
        nextStatus: 'Completed',
        class: buttonClass,
      };
    } else if (status === 'Delivered1-Partial' || status === 'Delivered1') {
      return {
        label: 'Confirm Delivery 1',
        nextStatus: 'Delivered1',
        class: buttonClass,
      };
    } else if (status === 'Delivered2-Partial') {
      return {
        label: 'Confirm Delivery 2',
        nextStatus: 'Delivered2',
        class: buttonClass,
      };
    } else if (status === 'Delivered' && dropoffs > 1) {
      return {
        label: 'Complete Delivery',
        nextStatus: 'Completed',
        class: buttonClass,
      };
    }

    return null;
  }

  isWaitingForDelivery(loadData: any): boolean {
    if (!loadData) return false;

    const waitingStatuses = [
      'Dispatched',
      'Delivered1-Partial',
      'Delivered2-Partial',
    ];
    return waitingStatuses.includes(loadData.status);
  }

  getDeliveryStep(status: string): string {
    const statusMapping: { [key: string]: string } = {
      Dispatched: '1',
      'Delivered1-Partial': '2',
      'Delivered2-Partial': '3',
    };

    return statusMapping[status] || '';
  }
}
