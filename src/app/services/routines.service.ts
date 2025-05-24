import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { LoginService } from './login.service';
import { getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class RoutinesService {
  private userId: string;
  firestore = inject(Firestore);
  loginAuthUser = inject(LoginService);
   constructor() {
     const auth = getAuth();
     this.userId = auth.currentUser?.uid || '';
   }
}
