import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

@Injectable()
export class TipoEventoProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1`

  constructor(
    private http: Http
  ) {}

  getTiposEvento (token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/tipo-eventos/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  createTipoEvento (te: { nombre: string; }, token: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/tipo-eventos/`,
      { tipo_evento: te },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  deleteTipoEvento (id: number, token: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/tipo-eventos/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
