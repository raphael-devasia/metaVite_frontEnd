import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { provideState, provideStore } from '@ngrx/store';
import { userRegistrationReducer } from './features/auth/register/store/user-registration.reducer';

@NgModule({
  declarations: [],
  providers: [provideStore()],
  imports: [CommonModule, AppRoutingModule, ],
})
export class AppModule {}
