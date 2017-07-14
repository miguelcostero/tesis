import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { Storage } from '@ionic/storage'
import { Events } from 'ionic-angular'
import 'rxjs/add/operator/toPromise'

import { Empleado } from '../../interfaces/empleado'

@Injectable()
export class AuthProvider {
  private apiUrl = `http://api.talentproducciones.com.ve/v1`

  constructor(
    private http: Http,
    private storage: Storage,
    private events: Events
  ) {}

  login (email: string, password: string): Promise<any> {
    return this.http.post(
      `${this.apiUrl}/login/`,
      JSON.stringify({ email, password })
    ).toPromise().then(res => {
      let response = res.json()
      if (response.error) {
        return Promise.reject(response.error)
      } else {
        let empleado = response as Empleado
        this.storage.set('auth', empleado)
        this.events.publish('empleado:login', empleado, Date.now())
        return Promise.resolve(empleado)
      }
    }).catch(err => Promise.reject(err))
  }

  logout () {
    this.events.publish('empleado:logout', Date.now())
    return this.storage.remove('auth')
  }

  checkLogin (): Promise<any> {
    return this.storage.get('auth').then(auth => {
      if (auth) {
        return this.http.post(
          `${this.apiUrl}/validate-token/`,
          JSON.stringify({ token: auth.token })
        ).toPromise().then(res => {
          let response = res.json()
          return response.status == 'success' ? Promise.resolve(auth) : Promise.reject(response.error)
        }).catch(err => Promise.reject(err))
      } else {
        return Promise.reject({ error: 'No existe un usuario logueado' })
      }
    }).catch(err => Promise.reject(err)) 
  }

}
