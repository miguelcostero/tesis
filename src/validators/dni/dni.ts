import { FormControl } from '@angular/forms'

export class DniValidator {
  static isValid (input: FormControl) {
    const regex = /[VJE]\-\d{8}(\-\d{1})?/
    console.log('REGEX', regex.test(input.value))
    return regex.exec(input.value) === null ?  { noMatch: true } : null
  }
}