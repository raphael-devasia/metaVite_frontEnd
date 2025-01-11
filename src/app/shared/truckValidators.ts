import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export class TruckValidators {
  
  
 
  // validators for trucks

  static validStateCode(control: AbstractControl): ValidationErrors | null {
    
    
    const validStateCodes = [
      'AP',
      'AR',
      'AS',
      'BR',
      'CG',
      'GA',
      'GJ',
      'HR',
      'HP',
      'JH',
      'KA',
      'KL',
      'MP',
      'MH',
      'MN',
      'ML',
      'MZ',
      'NL',
      'OD',
      'PB',
      'RJ',
      'SK',
      'TN',
      'TG',
      'TR',
      'UP',
      'UK',
      'WB',
      'AN',
      'CH',
      'DN',
      'DD',
      'DL',
      'JK',
      'LA',
      'LD',
      'PY',
    ];

    const value = control.value;
    if (!value) return null;

    const stateCode = value.substring(0, 2);
    return validStateCodes.includes(stateCode)
      ? null
      : { invalidStateCode: true };
  }

  static validManufacturer(control: AbstractControl): ValidationErrors | null {
    const validManufacturers = [
      'TATA',
      'ASHOK LEYLAND',
      'MAHINDRA',
      'BHARAT BENZ',
      'EICHER',
      'FORCE MOTORS',
      'VOLVO',
      'SCANIA',
      'MAN',
      'AMW',
    ];

    const value = control.value?.toUpperCase();
    if (!value) return null;

    return validManufacturers.some((mfg) => value.includes(mfg))
      ? null
      : { invalidManufacturer: true };
  }

  static validInsurer(control: AbstractControl): ValidationErrors | null {
    const validInsurers = [
      'NATIONAL INSURANCE',
      'NEW INDIA ASSURANCE',
      'ORIENTAL INSURANCE',
      'UNITED INDIA INSURANCE',
      'ICICI LOMBARD',
      'BAJAJ ALLIANZ',
      'HDFC ERGO',
      'RELIANCE GENERAL',
      'TATA AIG',
      'FUTURE GENERALI',
    ];

    const value = control.value?.toUpperCase();
    if (!value) return null;

    return validInsurers.some((ins) => value.includes(ins))
      ? null
      : { invalidInsurer: true };
  }



  static maxExpiryDate(years: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(currentDate.getFullYear() + years);

      const inputDate = new Date(control.value);
      return inputDate <= maxDate ? null : { exceedsMaxDate: true };
    };
  }

  static validName(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    // Allows names with dots (like initials) and spaces
    const nameRegex = /^[a-zA-Z]+([\s\.][a-zA-Z]+)*$/;
    return nameRegex.test(value) ? null : { invalidName: true };
  }
}
