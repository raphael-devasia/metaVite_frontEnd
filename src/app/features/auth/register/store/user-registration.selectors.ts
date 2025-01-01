import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserRegistrationState } from './user-registration.state';

export const selectUserRegistrationState =
  createFeatureSelector<UserRegistrationState>('userRegistration');

export const selectUser = createSelector(
  selectUserRegistrationState,
  (state: UserRegistrationState) => state.user
);

export const selectLoading = createSelector(
  selectUserRegistrationState,
  (state: UserRegistrationState) => state.loading
);

export const selectError = createSelector(
  selectUserRegistrationState,
  (state: UserRegistrationState) => state.error
);
