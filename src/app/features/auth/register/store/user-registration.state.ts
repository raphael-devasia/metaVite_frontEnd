import { User } from "../../../../shared/models/user";

export interface UserRegistrationState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialUserRegistrationState: UserRegistrationState = {
  user: null,
  loading: false,
  error: null,
};
