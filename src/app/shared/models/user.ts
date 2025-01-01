export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  phoneNumber: string;
}

export interface PersonalDetails {
  emergencyContact?: EmergencyContact;
  address?: Address;
}

export interface CompanyDetails {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  taxId?: string;
  address?: Address;
}

export interface User {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  phoneNumber: string;
  password: string;
  role:string ;
  companyRefId?: string;
  personalDetails?: PersonalDetails;
  companyDetails?: CompanyDetails;
}
export interface LoginDetails{
  username:string;
  password:string;
  
}
export interface LoginDetails {
  username: string;
  password: string;
}
export interface Invitation {
  name: {
    firstName: string;
    lastName: string;
  };
  
  email: string;
  phoneNumber: string;
  status:string,
  role: string;
  companyRefId?: string;
  username?:string
  company?:string
  id?:string
}
