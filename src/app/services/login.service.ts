import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, Observable, throwError } from 'rxjs';
import { UserRegister, UserLogin, LoggedUserData } from '../model/user';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, UserCredential, user, authState, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user$: Observable<User | null>;

  constructor(private auth: Auth, private router: Router) {
     this.user$ = authState(this.auth);
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  register(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
     return signOut(this.auth).then(() => {
      this.router.navigate(['']); // or wherever you want to redirect
    });
  }

  getCurrentUser() {
    return user(this.auth);
   
  }
  getAuthState() {
    return authState(this.auth);
  }
}
