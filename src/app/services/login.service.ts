import {  Injectable } from '@angular/core';
import {  from, Observable, Subject, throwError } from 'rxjs';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, authState, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user$: Observable<User | null>;
  private clickSubject = new Subject<any>();
  click$ = this.clickSubject.asObservable();

  constructor(private auth: Auth, private router: Router) {
     this.user$ = authState(this.auth);
  }

  emitClick(data?: any) {
    this.clickSubject.next(data);
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  register( email: string, password: string) {
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
