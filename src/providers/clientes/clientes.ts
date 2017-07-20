import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'

import { Cliente } from '../../interfaces/cliente'

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

  createCliente (cliente: Cliente, token: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/clientes/`,
      { cliente },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  updateCliente (cliente: Cliente, token: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/clientes/${cliente.id}/`,
      { cliente },
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

  deleteCliente (id: number, token: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/clientes/${id}/`,
      { headers: new Headers({ 'Access-Token': token }) }
    )
  }

}
