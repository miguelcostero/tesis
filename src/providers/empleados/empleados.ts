import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

@Injectable()
export class EmpleadosProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1/empleados`

  constructor(
    private http: Http
  ) {}

  getEmpleado (id: number, token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
