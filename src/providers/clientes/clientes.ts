import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

@Injectable()
export class ClientesProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1`

  constructor(
    private http: Http
  ) {}

  getClientes (token: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/clientes/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
