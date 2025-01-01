import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../shared/models/user';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { take } from 'rxjs/operators';
import { updateUser } from '../store/user-registration.actions';
import { UserRegistrationState } from '../store/user-registration.state';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.css',
})
export class RoleSelectionComponent implements OnInit {
  @Input() fields: any[] = [];
  @Input() formGroup!: FormGroup;
  @Output() endUserSelectionEvent = new EventEmitter<string>();
  @Input() submitEvent!: EventEmitter<void>;
  selectedRole: string | null = null;
  currentUser$!: Observable<User | null>;
  constructor(
    private fb: FormBuilder,
    private store: Store<UserRegistrationState>
  ) {}
  ngOnInit() {}
  selectUserRole(endUser: string) {
    if (this.selectedRole !== endUser) {
      this.selectedRole = endUser;
      
        let user: Partial<User> = {
          role: this.selectedRole !== null ? this.selectedRole : undefined,
        };
        this.store.dispatch(updateUser({ user: user }));
        console.log('Updated User:', user);

      
      this.endUserSelectionEvent.emit(endUser);
    }
  }
  isSelected(endUser: string): boolean {
    return this.selectedRole === endUser;
  }

  onsubmit() {
    console.log('submission started');
    
    console.log(this.currentUser$);
    
    this.currentUser$.pipe(take(1)).subscribe((currentUser) => {
      if (currentUser) {
        console.log(currentUser);

        let updatedUser: Partial<User> = { ...currentUser }; // Clone current user

        if (this.selectedRole !== null) {
          updatedUser = {
            ...currentUser,
            role: this.selectedRole,
          };
        }

        this.store.dispatch(updateUser({ user: updatedUser }));
        console.log('Updated User:', updatedUser);
      } else {
        let user: Partial<User> = {
          role: this.selectedRole !== null ? this.selectedRole : undefined,
        };
        this.store.dispatch(updateUser({ user: user }));
        console.log('Updated User:', currentUser);
      }
    });
  }
}



