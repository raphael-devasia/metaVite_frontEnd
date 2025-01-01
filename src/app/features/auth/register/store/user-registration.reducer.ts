import { createReducer, on } from '@ngrx/store';
import * as UserRegistrationActions from './user-registration.actions';
import {
  UserRegistrationState,
  initialUserRegistrationState,
} from './user-registration.state';
import { createUserWithDefaults } from '../../../../utils/user-registration.utils';

export const userRegistrationReducer = createReducer(
  initialUserRegistrationState,
  on(UserRegistrationActions.startRegistration, (state, { user }) => ({
    ...state,
    user,
    loading: true,
    error: null,
  })),
  on(UserRegistrationActions.registrationSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(UserRegistrationActions.registrationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UserRegistrationActions.updateUser, (state, { user }) => ({
    ...state,
    user: createUserWithDefaults(user),
  }))
);
