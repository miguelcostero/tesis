import { FormControl } from '@angular/forms'

export class NumberValidator {
  static isValid (input: FormControl) {
    return isNaN(input.value) ? { NotANumber: true } : null
  }
}