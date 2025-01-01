import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { bidPriceValidator } from '../../../shared/customValidators';
import { ChatComponent } from '../../chat/chat/chat.component';
import { DataService } from '../../../shared/services/data.service';
import { CarrierService } from '../../../core/services/shipper/carrier/carrier.service';
import { LocalstorageService } from '../../../core/services/localstorage.service';

@Component({
  selector: 'app-bidding',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './bidding.component.html',
  styleUrl: './bidding.component.css',
})
export class BiddingComponent implements OnInit {
  bookingForm: FormGroup;
  CarrierServices = inject(CarrierService);
  localStorageServices = inject(LocalstorageService);
  load: any;
  loadRefId: string;
  vehicles: any = [];
  drivers: any = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<BiddingComponent>,
    @Inject(DataService) private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.load = data.load;
    this.loadRefId = data.loadRefId;
    // Initialize the form
    this.bookingForm = this.fb.group({
      vehicle: ['', Validators.required],
      driver: ['', Validators.required],
      bid: [
        '',
        [
          Validators.required,
          Validators.min(1),
          bidPriceValidator(this.load.basePrice),
        ],
      ],
      termsAccepted: [false, Validators.requiredTrue],
    });
  }

  // onSubmit() {
  //   if (this.bookingForm.valid) {
  //     console.log('Form Submitted', this.bookingForm.value);
  //   } else {
  //     console.log('Form is not valid');
  //   }
  // }
  onSubmit() {
    if (this.bookingForm.valid) {
      console.log('Form Submitted', this.bookingForm.value);
      // You can include loadRefId when sending data back
      const submissionData = {
        ...this.bookingForm.value,
        loadRefId: this.loadRefId,
      };
      this.dialogRef.close(submissionData);
    } else {
      console.log('Form is not valid');
    }
  }

  onCancel() {
    this.dialogRef.close(); // Close the modal explicitly
    this.bookingForm.reset();
  }
  openChatBox(shipperRefId: string) {
    this.dataService.sendChat(shipperRefId);
  }

  ngOnInit(): void {
    const user = this.localStorageServices.getCarrierAdminData();
    this.CarrierServices.getAllTrucks(user.companyRefId).subscribe(
      (response) => {
        console.log(response);
        if (response && Array.isArray(response.trucks)) {
          this.vehicles = response.trucks.filter(
            (truck: any) =>
              truck.Status === 'Active' && truck.workStatus === 'Idle'
          );
          console.log(this.vehicles);
        } else {
          console.error('Invalid response format', response);
        }
      },
      (error) => {
        console.error('Error fetching trucks', error);
      }
    );
     this.CarrierServices.getAllDrivers(user.companyRefId).subscribe(
       (response) => {
         console.log(response);
         if (response && Array.isArray(response.drivers)) {
           this.drivers = response.drivers.filter(
             (driver: any) =>
               driver.status === 'Active' && driver.workStatus === 'Idle'
           );
           console.log(this.drivers);
         } else {
           console.error('Invalid response format', response);
         }
       },
       (error) => {
         console.error('Error fetching drivers', error);
       }
     );
  }
}
