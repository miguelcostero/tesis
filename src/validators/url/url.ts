import { FormControl } from '@angular/forms'
import { isWebUri } from 'valid-url'

export class UrlValidator {
  static isValid (input: FormControl) {
    return isWebUri(input.value) ? null : { InvalidUri: true }
  }
}