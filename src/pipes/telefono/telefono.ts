import { Pipe, PipeTransform } from '@angular/core'
import { format } from 'libphonenumber-js'

import { Telefono } from '../../interfaces/telefono'

@Pipe({
  name: 'telefono',
})
export class TelefonoPipe implements PipeTransform {
  transform(telefono: Telefono, ...args) {
    return format(`${telefono.prefijo}${telefono.numero}`, telefono.pais, 'International')
  }
}
