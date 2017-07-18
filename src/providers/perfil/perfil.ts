import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

import { Empleado } from '../../interfaces/empleado'

@Injectable()
export class PerfilProvider {
  private apiUrl = `http://api.talentproducciones.com.ve/v1/empleados`
  // private empleado: Empleado

  constructor(
    private http: Http
  ) {}

  getPerfil (id: number, token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  updateEmpleado (id: number, token: string, data: Empleado, password: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/`,
      {
        empleado: data,
        password
      },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
