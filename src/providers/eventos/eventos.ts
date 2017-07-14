import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs/Observable'

import 'rxjs/add/operator/debounceTime'

import { Evento } from '../../interfaces/evento'

@Injectable()
export class EventosProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1`

  constructor(
    private http: Http
  ) {}

  getEventos (token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/eventos/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  getEvento (id: number, token: string): Observable<Evento> {
    return this.http.get(
      `${this.apiUrl}/eventos/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    ).map(evento => evento.json() as Evento)
  }

  editEvento (evento: Evento, token: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/eventos/${evento.id}/`,
      { evento },
      { 
        headers: new Headers({
          'Access-Token': token,
          'Content-Type': 'application/json'
        }) 
      }
    )
  }

  searchEventosByNombre (nombre: string, token: string) {
    return this.http.get(
      `${this.apiUrl}/eventos/?query=${nombre}`,
      { headers: new Headers({ 'Access-Token': token }) }
    ).debounceTime(300)
  }

}
