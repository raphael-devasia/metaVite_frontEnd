import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-adress-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adress-modal.component.html',
  styleUrls: ['./adress-modal.component.css'],
})
export class AdressModalComponent {
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();
  @Input() updateResource!: (target: string) => void;
  @Input() modalHeading!: string;
  @Input() form!: FormGroup;
  @Input() action!: string;
  companyRefId: string | null = null;
  // form: FormGroup;
  message: string | null = null; // To store success/error message
  messageType: 'success' | 'error' | null = null; // To store message type

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
    const userData = JSON.parse(
      localStorage.getItem('shipperAdminData') || '{}'
    );
    this.companyRefId = userData?.companyRefId || null;
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      address: this.fb.group({
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
      }),
      contactNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      contactPerson: ['', Validators.required],
      companyRefId: [this.companyRefId, Validators.required],
      _id: [''],
    });
    // Patch companyRefId after initializing the form
  }

  save(): void {
    this.form.patchValue({
      companyRefId: this.companyRefId,
    });

    if (this.form.valid) {
      this.dataService
        .sendClientData({
          data: this.form.value,
          identifier: this.modalHeading,
        })
        .subscribe({
          next: (result) => {
            if (result.success) {
              this.message = result.message;
              this.messageType = 'success';
              this.cdr.detectChanges();
              setTimeout(() => {
                this.onSave.emit(this.form.value); // Emit after successful save
                this.form.reset();
                this.message = null; // Clear message
                this.messageType = null; // Clear message type
                this.close(); // Close the modal
                console.log('its success closing modal');
              }, 3000); // 3 seconds delay
            } else {
              this.message = result.message;
              this.messageType = 'error';
              setTimeout(() => {
                this.message = null; // Clear message
                this.messageType = null; // Clear message type
              }, 3000); // 3 seconds delay
            }
          },
          error: (error) => {
            this.message = error;
            this.messageType = 'error';
            setTimeout(() => {
              this.message = null; // Clear message
              this.messageType = null; // Clear message type
            }, 3000); // 3 seconds delay
          },
        });
    }
    console.log('form is not valid ');
  }

  close() {
    this.onClose.emit();
    console.log('onclose emitted');
    this.updateResource(this.modalHeading);
  }
}
