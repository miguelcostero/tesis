import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'

import { Locacion } from '../../interfaces/locacion'

@Injectable()
export class LocacionesProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1/locaciones`

  constructor (
    private http: Http
  ) {}

  getLocaciones (token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  createLocacion (locacion: Locacion, token: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/`,
      { locacion },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  updateLocacion (locacion: Locacion, token: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${locacion.id}/`,
      { locacion },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  deleteLocacion (id: number, token: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
