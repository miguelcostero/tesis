import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

import { Talento } from '../../interfaces/talento'

@Injectable()
export class TalentosProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1/talentos`

  constructor(
    private http: Http
  ) {}

  getTalentos (token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  createTalento (talento: Talento, token: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/`,
      { talento },
      { headers: new Headers({ 'Access-Token': token }) }      
    )
  }

  updateTalento (talento: Talento, token: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${talento.id}/`,
      { talento },
      { headers: new Headers({ 'Access-Token': token }) }      
    )
  }

  deteleTalentos (id: number, token: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
