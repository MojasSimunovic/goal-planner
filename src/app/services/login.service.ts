import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UserRegister, UserLogin } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  http = inject(HttpClient);

  constructor() { }

  register(url: string, registerObject : UserRegister) {
    return this.http.post(`${url}`, registerObject).
    pipe(
      catchError((error)=> {
        console.log(error.error)
        return throwError(()=> new Error('failed to register'))
      })
    )
  }

  login(url: string, loginObject: UserLogin) {
    return this.http.post(`${url}`, loginObject).
    pipe(
      catchError((error)=> {
        console.log(error.error)
        return throwError(()=> new Error('failed to register'))
      })
    )
  }
}
