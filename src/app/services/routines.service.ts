import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { LoginService } from './login.service';
import { getAuth } from '@angular/fire/auth';
import { Routine } from '../model/routine';
import { from, Observable } from 'rxjs';

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
  createNewReminder(routine: Routine) {
    routine= {...routine, userId: this.userId};
    const routineRef = collection(this.firestore, 'routines');
    const newDocRef = doc(routineRef); // generate a new doc ref
    // set the ID manually inside the goal object (optional but useful)
    const routinelWithId = { ...routine, id: newDocRef.id };
    return from(setDoc(newDocRef, routinelWithId));
  }
  getAllRoutines() {
     if (!this.userId) throw new Error('No user logged in');
     const routinesRef = collection(this.firestore, 'routines');
     const q = query(routinesRef, where('userId', '==', this.userId));
     return collectionData(q, {idField: 'id'}) as Observable<Routine[]>;
  }
}
