import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export class CustomValidators {
  static atLeast24HoursFromNow(
    control: AbstractControl
  ): ValidationErrors | null {
    const currentTime = new Date();
    const controlTime = new Date(control.value);

    // Check if the dispatch time is at least 24 hours (in milliseconds) from now
    return controlTime.getTime() - currentTime.getTime() >= 24 * 60 * 60 * 1000
      ? null
      : { atLeast24HoursFromNow: true };
  }

  static futureDate(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const controlDate = new Date(control.value);

    return controlDate > currentDate ? null : { futureDate: true };
  }

  static futureTime(control: AbstractControl): ValidationErrors | null {
    const currentTime = new Date().getTime();
    const controlTime = new Date(control.value).getTime();

    return controlTime > currentTime ? null : { futureTime: true };
  }

  static dateAfter(dispatchDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent as FormGroup;
      if (formGroup) {
        const dispatchDateValue = new Date(formGroup.get(dispatchDate)?.value);
        const expectedDeliveryDateValue = new Date(control.value);

        return expectedDeliveryDateValue > dispatchDateValue
          ? null
          : { dateAfter: true };
      }
      return null;
    };
  }

  static appointmentsAfterDelivery(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormGroup)) {
        return null;
      }

      const formGroup = control as FormGroup;
      const expectedDelivery = new Date(
        formGroup.get('expectedDelivery')?.value
      );
      const appointment1 = new Date(formGroup.get('appointment1')?.value);
      const appointment2 = new Date(formGroup.get('appointment2')?.value);
      const appointment3 = new Date(formGroup.get('appointment3')?.value);

      if (
        (formGroup.get('appointment1')?.value &&
          appointment1 <= expectedDelivery) ||
        (formGroup.get('appointment2')?.value &&
          appointment2 <= appointment1) ||
        (formGroup.get('appointment3')?.value && appointment3 <= appointment2)
      ) {
        return { appointmentsAfterDelivery: true };
      }
      return null;
    };
  }

  static mandatoryDropoffOrder(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormGroup)) {
        return null;
      }

      const formGroup = control as FormGroup;
      const dropoffs = formGroup.get('dropoffs')?.value;
      const expectedDelivery = formGroup.get('expectedDelivery')?.value;

      // If expected delivery is not provided, return null (no error)
      if (!expectedDelivery) {
        return null;
      }

      // Check the drop-off order
      for (let i = 1; i <= dropoffs; i++) {
        if (
          !formGroup.get(`client${i}`)?.value ||
          !formGroup.get(`appointment${i}`)?.value
        ) {
          return { mandatoryDropoffOrder: false };
        }
      }
      return null;
    };
  }

  static quantityInTons(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value > 0 ? null : { quantityInTons: true };
  }

  static trailerFeet(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value >= 12 && value <= 60 ? null : { trailerFeet: true };
  }

  static tipperLoad(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value > 0 && value <= 25 ? null : { tipperLoad: true };
  }

  static mixerCapacity(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value > 0 && value <= 15 ? null : { mixerCapacity: true };
  }
  static uniqueClientAddresses(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormGroup)) {
        return null;
      }
      const formGroup = control as FormGroup;
      const client1 = formGroup.get('client1')?.value?.fullAddress;
      const client2 = formGroup.get('client2')?.value?.fullAddress;
      const client3 = formGroup.get('client3')?.value?.fullAddress;
      if (
        (client1 && client2 && client1 === client2) ||
        (client1 && client3 && client1 === client3) ||
        (client2 && client3 && client2 === client3)
      ) {
        return { uniqueClientAddresses: true };
      }
      return null;
    };
  }
}
export function bidPriceValidator(basePrice: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const bidPrice = control.value;
    return bidPrice < basePrice ? null : { bidPriceInvalid: true };
  };
}


export function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateOfBirth = control.value;

    if (!dateOfBirth) return null; // If there's no date, skip validation

    // Calculate age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // Return error if age is less than 18
    if (age < 18) {
      return { underAge: true };
    }

    return null; // Return null if valid (age is 18 or older)
  };
}
export function fileValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const file = control.value instanceof File ? control.value : null;
    if (file) {
      const size = file.size / 1024 / 1024; // Convert size to MB
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
      ];

      if (size > 1) {
        return { invalidFile: true }; // Error for size
      }

      if (!allowedTypes.includes(file.type)) {
        return { invalidFile: true }; // Error for type
      }
    }
    return null; // No errors
  };
}
export class DateValidator {
  static futureDate(control: AbstractControl): ValidationErrors | null {
    const inputDate = new Date(control.value);
    const currentDate = new Date();
    if (inputDate <= currentDate) {
      return { pastDate: true }; // Custom error if the date is in the past or today
    }
    return null;
  }
}