import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdressModalComponent } from '../adress-modal/adress-modal.component';
import { ShipperService } from '../../../core/services/shipper/shipper.service';
import { CustomValidators } from '../../customValidators';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalstorageService } from '../../../core/services/localstorage.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-load-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdressModalComponent,
  ],
  templateUrl: './load-form.component.html',
  styleUrls: ['./load-form.component.css'],
})
export class LoadFormComponent implements OnInit {
  ShipperServices = inject(ShipperService);
  dataServices = inject(DataService);
  
  form: FormGroup;
  message: string | null = null; // To store success/error message
  messageType: 'success' | 'error' | null = null; // To store message type
  // allClients = []
  // companyAddresses = [];

  // availableClients = this.allClients.slice();
  allClients: { display: string; fullAddress: any }[] = [];
  companyAddresses: { display: string; fullAddress: any }[] = [];
  availableClients: { display: string; fullAddress: any }[] = [];
  dropOffs = [1, 2, 3];
  showClientModal = false;
  showPickupModal = false;
  errorMessages!:any
  userId: string = '';
  modalHeading = 'Add A Client';
  vehicleTypes = [
    { type: 'Small Commercial Vehicle', value: 'scv' },
    { type: 'Light Commercial Vehicle', value: 'lcv' },
    { type: 'Medium & Heavy Commercial Vehicle', value: 'mhcv' },
  ];
  mhcvSubTypes = [
    { type: 'Tipper', value: 'tipper' },
    { type: 'Trailer', value: 'trailer' },
    { type: 'Transit Mixer', value: 'transit-mixer' },
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<LoadFormComponent>
  ) {
    this.form = this.fb.group(
      {
        dropoffs: [1, Validators.required],
        client1: ['', Validators.required],
        appointment1: ['', Validators.required],
        client2: [''],
        appointment2: [''],
        client3: [''],
        appointment3: [''],
        pickupLocation: [''],
        // material: ['', Validators.required],
        // quantity: ['', [Validators.required, CustomValidators.quantityInTons]],
        material: [
          '',
          [
            Validators.required,
            Validators.pattern('^[A-Z]+( [A-Z]+)*$'), // Minimum 3 letters, uppercase only, and spaces allowed
            Validators.minLength(3),
          ],
        ],
        quantity: [
          '',
          [Validators.required, Validators.min(1), Validators.max(100)],
        ],
        vehicleBody: ['open', Validators.required],
        vehicleType: ['', Validators.required],
        mhcvSubtype: [''],
        trailerFeet: ['', [CustomValidators.trailerFeet]],
        tipperLoad: ['', [CustomValidators.tipperLoad]],
        mixerCapacity: ['', [CustomValidators.mixerCapacity]],
        lcvBody: [''],
        containerFeet: ['', [Validators.min(12), Validators.max(60)]],
        agentName: [
          '',
          [Validators.required, Validators.pattern('^[a-zA-Z]+$')],
        ],
        agentContact: [
          '',
          [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
        ],
        dispatchDateTime: [
          '',
          [Validators.required, CustomValidators.atLeast24HoursFromNow],
        ],
        expectedDelivery: [
          '',
          [Validators.required, CustomValidators.dateAfter('dispatchDateTime')],
        ],
        basePrice: ['', [Validators.required, Validators.min(3000)]],
      },
      {
        validators: [
          CustomValidators.appointmentsAfterDelivery(),
          CustomValidators.mandatoryDropoffOrder(),
          CustomValidators.uniqueClientAddresses(),
        ],
      }
    );

    // Error messages
    this.errorMessages = {
      material: {
        required: 'Material is required.',
        pattern: 'Only uppercase letters and spaces are allowed.',
        minLength: 'Material must be at least 3 characters long.',
      },
      quantity: {
        required: 'Quantity is required.',
        min: 'Quantity must be at least 1 ton.',
        max: 'Quantity cannot exceed 100 tons.',
      },
      trailerFeet: {
        invalid: 'Invalid trailer feet value.',
      },
      tipperLoad: {
        invalid: 'Invalid tipper load value.',
      },
      mixerCapacity: {
        invalid: 'Invalid mixer capacity value.',
      },
      dispatchDateTime: {
        required: 'Dispatch date and time is required.',
        atLeast24HoursFromNow:
          'Dispatch must be scheduled at least 24 hours from now.',
      },
    };
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('shipperAdminData');
    console.log(userData);

    if (userData) {
      // Parse the JSON data
      const parsedData = JSON.parse(userData);

      // Extract the user ID
      const userId = parsedData._id;
      console.log(userData);
      this.userId = userId;
      // Pass the userId to functions
      this.handleClientData(userId);
      this.handlePickupData(userId);
    } else {
      console.error('No userData found in localStorage');
    }
    this.setupClientDropdowns();
    this.onDropoffsChange();
    this.onVehicleTypeChange();
  }
  // handleClientData(userId: string) {
  //   this.ShipperServices.getAllClients(userId).subscribe((data) => {
  //     // Map the data to extract companyName and city, and populate allClients
  //     this.allClients = data.map((company: any) => {
  //       const companyName = company.companyName || 'Unknown Company';
  //       const add1 = company.address.addressLine1 || 'Unknown address';
  //       const city = company.address.city || 'Unknown City';
  //       return `{display:${companyName}, ${add1}, ${city} address:${company}}`;
  //     });
  //     this.updateClientOptions();
  //     this.cdr.detectChanges();
  //     console.log('Processed allClients:', this.allClients);
  //   });
  // }
  handleClientData(userId: string) {
    this.ShipperServices.getAllClients(userId).subscribe((data) => {
      this.allClients = data.map((company: any) => {
        const companyName = company.companyName || 'Unknown Company';
        const address = `${company.address.addressLine1}, ${company.address.city}`;
        return { display: `${companyName}, ${address}`, fullAddress: company };
      });
      this.updateClientOptions();
      this.cdr.detectChanges();
    });
  }

  updateClientOptions() {
    const selectedClients: any = [];
    for (let i = 1; i <= 3; i++) {
      const value = this.form.get(`client${i}`)?.value;
      if (value) selectedClients.push(value.fullAddress);
    }
    console.log('The selected clients are:', selectedClients);
    this.availableClients = this.allClients.filter(
      (client) => !selectedClients.includes(client)
    );

    console.log('The availableClients clients are:', this.availableClients);
  }

  handlePickupData(userId: string) {
    console.log('piclup handler');

    this.ShipperServices.getAllPickups(userId).subscribe((data) => {
      console.log('getting dat', data);
      // Map the data to extract companyName and city, and populate allClients
      this.companyAddresses = data.map((company: any) => {
        const companyName = company.companyName || 'Unknown Company';
        const address = `${company.address.addressLine1}, ${company.address.city}`;
        return { display: `${companyName}, ${address}`, fullAddress: company };
      });
      if (this.companyAddresses.length > 0) {
        this.form.get('pickupLocation')?.setValue(this.companyAddresses[0]);
      }

      this.cdr.detectChanges();
    });
  }

  onDropoffsChange() {
    this.form.get('dropoffs')!.valueChanges.subscribe((value) => {
      this.resetDropoffControls();
      for (let i = 1; i <= value; i++) {
        // this.form.get(`client${i}`)!.setValidators([Validators.required]);
        // this.form.get(`appointment${i}`)!.setValidators([Validators.required]);
        // this.form.get(`client${i}`)!.updateValueAndValidity();
        // this.form.get(`appointment${i}`)!.updateValueAndValidity();
        this.form.addControl(
          `client${i}`,
          this.fb.control('', Validators.required)
        );
        this.form.addControl(
          `appointment${i}`,
          this.fb.control('', Validators.required)
        );
      }
    });
  }

  resetDropoffControls() {
    for (let i = 1; i <= 3; i++) {
      this.form.get(`client${i}`)!.clearValidators();
      this.form.get(`appointment${i}`)!.clearValidators();
      this.form.get(`client${i}`)!.updateValueAndValidity();
      this.form.get(`appointment${i}`)!.updateValueAndValidity();
      // this.form.removeControl(`client${i}`);
      // this.form.removeControl(`appointment${i}`);
    }
    this.updateClientOptions();
  }

  setupClientDropdowns() {
    for (let i = 1; i <= 3; i++) {
      const control = this.form.get(`client${i}`);
      if (control) {
        control.valueChanges.subscribe(() => this.updateClientOptions());
      }
    }
  }

  onVehicleTypeChange() {
    this.form.get('vehicleType')!.valueChanges.subscribe((value) => {
      if (value === 'mhcv') {
        this.form.get('mhcvSubtype')!.setValidators([Validators.required]);
      } else {
        this.form.get('mhcvSubtype')!.clearValidators();
      }
      this.form.get('mhcvSubtype')!.updateValueAndValidity();
    });

    this.form.get('mhcvSubtype')!.valueChanges.subscribe((value) => {
      this.resetMHCVSubtypeControls();

      // Set validators for the selected subtype
      if (value === 'trailer') {
        this.form.get('trailerFeet')!.setValidators([Validators.required]);
      } else if (value === 'tipper') {
        this.form.get('tipperLoad')!.setValidators([Validators.required]);
      } else if (value === 'transit-mixer') {
        this.form.get('mixerCapacity')!.setValidators([Validators.required]);
      }

      // Update the validity of all fields
      this.form.get('trailerFeet')!.updateValueAndValidity();
      this.form.get('tipperLoad')!.updateValueAndValidity();
      this.form.get('mixerCapacity')!.updateValueAndValidity();
    });
  }

  resetMHCVSubtypeControls() {
    // Clear values and validators for all subtype-related controls
    this.form.get('trailerFeet')!.clearValidators();
    this.form.get('tipperLoad')!.clearValidators();
    this.form.get('mixerCapacity')!.clearValidators();

    this.form.get('trailerFeet')!.setValue('');
    this.form.get('tipperLoad')!.setValue('');
    this.form.get('mixerCapacity')!.setValue('');

    this.form.get('trailerFeet')!.updateValueAndValidity();
    this.form.get('tipperLoad')!.updateValueAndValidity();
    this.form.get('mixerCapacity')!.updateValueAndValidity();
  }

  onSubmit() {
    console.log(this.form);

    if (this.form.valid) {
      // Prepare the form data for submission
      const formData = {
        ...this.form.value,
        dropoff1: this.form.get('client1')?.value?.fullAddress,
        dropoff2: this.form.get('client2')?.value?.fullAddress,
        dropoff3: this.form.get('client3')?.value?.fullAddress,
        shipperRefId: this.userId,
        status: 'Open',

        pickupLocation: this.form.get('pickupLocation')?.value?.fullAddress,
      };

      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== '' && value !== null
        )
      );
      console.log('Filtered Data:', cleanedFormData);
      this.ShipperServices.addLoad(cleanedFormData).subscribe((result) => {
        if (result.success) {
          this.message = result.message;
          this.messageType = 'success';
          this.cdr.detectChanges();
           this.toastr.success(result.message, 'Success');
           this.dataServices.sendData('All Bids');
          setTimeout(() => {
            // this.form.reset();
            // this.message = null; // Clear message
            // this.messageType = null; // Clear message type
             this.dialogRef.close();
            // this.onCancel();
          }, 2000); // 3 seconds delay
        } else {
          this.toastr.error(result.message, 'Error');
          // this.message = result.message;
          // this.messageType = 'error';
          // setTimeout(() => {
          //   this.message = null; // Clear message
          //   this.messageType = null; // Clear message type
          // }, 3000); 
        }
      });
    } else {
     this.toastr.error('Form Is Invalid', 'Error');
    }
  }

  openClientModal() {
    this.modalHeading = 'Add a Client';
    this.showClientModal = true;
  }

  closeClientModal() {
    
    this.handleClientData(this.userId);
    this.showClientModal = false;
    
  }

  saveClient(clientData: any) {
    // this.allClients.push(clientData.companyName);
    const userData = localStorage.getItem('userData');
    console.log(userData);

    if (userData) {
      // Parse the JSON data
      const parsedData = JSON.parse(userData);

      // Extract the user ID
      const userId = parsedData._id;
      console.log(userData);

      // Pass the userId to functions

      this.handleClientData(userId);
    }
    this.updateClientOptions();

    this.closeClientModal();
  }

  openPickupModal() {
    this.modalHeading = 'Add a Pick-up Location';
    this.showPickupModal = true;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  closePickupModal() {
    console.log('event received');
    this.cdr.detectChanges();
    this.showPickupModal = false;
  }

  savePickup(pickupData: any) {
    // this.companyAddresses.push(pickupData.companyName);
    // console.log(pickupData);

    const userData = localStorage.getItem('shipperAdminData');
    console.log(userData);

    if (userData) {
      // Parse the JSON data
      const parsedData = JSON.parse(userData);

      // Extract the user ID
      const userId = parsedData._id;
      console.log(userData);

      // Pass the userId to functions

      this.handlePickupData(userId);
    }
    this.updateClientOptions();
    this.closePickupModal();
  }







  
}
