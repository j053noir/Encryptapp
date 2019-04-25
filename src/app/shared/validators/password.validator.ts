import { AbstractControl } from '@angular/forms';

export function validatePassword(control: AbstractControl) {
  const value = control.value;

  if (value) {
    if (value.length < 8) {
      return { minlength: true };
    } else if (value.search(/\d/) < 0) {
      return { digit: true };
    } else if (value.search(/[a-z]/) < 0) {
      return { lowercase: true };
    } else if (value.search(/[A-Z]/) < 0) {
      return { uppercase: true };
    } else if (
      value.search(/[\.\,\ \!\@\#\$\%\^\&\*\(\)\_\+\"\'\`\°\¬\|]/) < 0
    ) {
      return { special: true };
    }
  }

  return null;
}
