import { createAction, props } from '@ngrx/store';
import { User } from '../../../../shared/models/user';

export const startRegistration = createAction(
  '[User Registration] Start Registration',
  props<{ user: User }>()
);

export const registrationSuccess = createAction(
  '[User Registration] Registration Success'
);

export const registrationFailure = createAction(
  '[User Registration] Registration Failure',
  props<{ error: string }>()
);
export const updateUser = createAction(
  '[User Registration] Update User',
  props<{ user: Partial<User> }>()
);
