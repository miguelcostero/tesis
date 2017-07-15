import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'

@Injectable()
export class LocacionesProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1`

  constructor (
    private http: Http
  ) {}

  getLocaciones (token): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/locaciones/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
