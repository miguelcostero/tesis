import { FormControl } from '@angular/forms'
import * as moment from 'moment'

export class FechaNacimientoValidator {
  static Min18YeardOld (input: FormControl) {
    const fecha_nacimiento = moment(input.value)
    return moment().diff(fecha_nacimiento, 'years') < 18 ? { not18: true } : null
  }
}