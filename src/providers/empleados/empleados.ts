import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

import { Empleado } from '../../interfaces/empleado'

@Injectable()
export class EmpleadosProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1`

  constructor(
    private http: Http
  ) {}

  getEmpleados (token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/empleados/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  getEmpleado (id: number, token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/empleados/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  createEmpleado (empleado: Empleado, token: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/admin/empleados/`,
      { empleado },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  updateEmpleado (empleado: Empleado, token: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/admin/empleados/${empleado.id}/`,
      { empleado },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  deleteEmpleado (id: number, token: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/admin/empleados/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
