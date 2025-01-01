import { User } from '../shared/models/user';

export function createUserWithDefaults(user: Partial<User>): User {
  return {
    name: { firstName: '', lastName: '' },
    email: '',
    phoneNumber: '',
    password: '',
    role: 'driver',
    companyRefId: '',
    personalDetails: {
      emergencyContact: {
        name: '',
        phoneNumber: '',
      },
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
      },
    },
    companyDetails: {
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      taxId: '',
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
      },
    },
    ...user,
  };
}
export const userDefaults: User = {
  name: { firstName: '', lastName: '' },
  email: '',
  phoneNumber: '',
  password: '',
  role: 'driver',
  companyRefId: '',
  personalDetails: {
    emergencyContact: { name: '', phoneNumber: '' },
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
    },
  },
  companyDetails: {
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    taxId: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
    },
  },
};
