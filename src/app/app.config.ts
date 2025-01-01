import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects'; import { provideState, provideStore } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { userRegistrationReducer } from './features/auth/register/store/user-registration.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { carrierInterceptor } from './interceptors/carrier.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { SocketioService } from './core/services/socketio.service';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    MatIconModule,
     MatTooltipModule,
    provideCharts(withDefaultRegisterables()),
    provideStore(),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    provideState({
      name: 'userRegistration',
      reducer: userRegistrationReducer,
    }),
    // SocketioService,
    provideHttpClient(withInterceptors([carrierInterceptor, authInterceptor])),
  ],
};
