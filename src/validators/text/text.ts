import { FormControl } from '@angular/forms'

export class TextValidator {
  static isValid (input: FormControl) {
    return input.value.match(/\d+/g) != null ? { hasAnumber: true } : null
  }
}