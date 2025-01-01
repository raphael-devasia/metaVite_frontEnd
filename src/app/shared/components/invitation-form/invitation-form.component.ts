import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invitation-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './invitation-form.component.html',
  styleUrls: ['./invitation-form.component.css'],
})
export class InvitationFormComponent implements OnInit {
  invitationForm: FormGroup;
  private user: any = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InvitationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.invitationForm = this.fb.group({
      name: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
      }),
      email: [this.data.email || '', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      
    });
  }

  ngOnInit(): void {
   
  }

  get f() {
    return this.invitationForm.controls as { [key: string]: AbstractControl };
  }

  get nameControls() {
    return (this.invitationForm.get('name') as FormGroup).controls;
  }

  onSubmit() {
    if (this.invitationForm.valid) {
      const formData = this.invitationForm.value;
      const data = { user: formData, formHeading: this.data.heading };
      
      
      this.dialogRef.close(data);
    }
  }

  onCancel() {
    this.dialogRef.close({ cancelled: true });
  }
}
