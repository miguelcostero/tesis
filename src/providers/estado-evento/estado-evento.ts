import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

@Injectable()
export class EstadoEventoProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1`

  constructor(
    private http: Http
  ) {}

  getEstadosEvento (token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/estado-eventos/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  createEstadoEvento (ee: { nombre: string; }, token: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/estado-eventos/`,
      { estado_evento: ee },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  deleteEstadoEvento (id: number, token: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/estado-eventos/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
