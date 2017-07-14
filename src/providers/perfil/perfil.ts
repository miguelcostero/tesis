import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

import { Empleado } from '../../interfaces/empleado'

@Injectable()
export class PerfilProvider {
  private apiUrl = `http://api.talentproducciones.com.ve/v1`
  // private empleado: Empleado

  constructor(
    private http: Http
  ) {}

  updateEmpleado (id: number, token: string, data: Empleado): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/empleados/${id}/`,
      data,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
