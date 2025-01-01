// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { of } from 'rxjs';
// import { catchError, map, mergeMap } from 'rxjs/operators';

// import * as UserRegistrationActions from './user-registration.actions';
// import { UserService } from '../../../core/services/user.service';

// @Injectable()
// export class UserRegistrationEffects {
//   constructor(private actions$: Actions, private userService: UserService) {}

//   registerUser$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(UserRegistrationActions.startRegistration),
//       mergeMap((action) =>
//         this.userService.registerUser(action.user).pipe(
//           map(() => UserRegistrationActions.registrationSuccess()),
//           catchError((error) =>
//             of(UserRegistrationActions.registrationFailure({ error }))
//           )
//         )
//       )
//     )
//   );
// }
