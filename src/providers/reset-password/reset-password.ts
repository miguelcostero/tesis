import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'
import 'rxjs/add/operator/map'

@Injectable()
export class ResetPasswordProvider {
  private apiUrl: string = `http://api.talentproducciones.com.ve/v1`

  constructor (
    private http: Http
  ) {}

  sendRequest (email: string) {
    return this.http.post(
      `${this.apiUrl}/reset-password/`,
      { email },
      { headers: new Headers({ 'Content-Type': 'application/json' }) }
    )
  }

}
