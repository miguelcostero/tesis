import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

import { Telefono } from '../../interfaces/telefono'

@Injectable()
export class TelefonosProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1/telefonos`

  constructor (
    private http: Http
  ) {}

  deteleTelefono (id: number, token: string, tabla: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${tabla}/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }
}
