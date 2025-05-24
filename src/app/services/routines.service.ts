import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
  afs = inject(AngularFirestore);
  loginAuthUser = inject(LoginService);
  constructor() {
    const auth = getAuth();
    this.userId = auth.currentUser?.uid || '';
  }
  createNewRoutine(routine: Routine) {
    routine= {...routine, userId: this.userId};
    const routineRef = collection(this.firestore, 'routines');
    const newDocRef = doc(routineRef);
    const routinelWithId = { ...routine, id: newDocRef.id };
    return from(setDoc(newDocRef, routinelWithId));
  }
  deleteRoutine(routine: Routine) {
      const routineDocRef = doc(this.firestore, `routines/${routine.id}`);
      return deleteDoc(routineDocRef);
  }
  updateRoutine(routine: Routine): Observable<void> {
    const routineDocRef = doc(this.firestore, `routines/${routine.id}`);
    return from(setDoc(routineDocRef, routine));
  }
  getAllRoutines() {
    if (!this.userId) throw new Error('No user logged in');
    const routinesRef = collection(this.firestore, 'routines');
    const q = query(routinesRef, where('userId', '==', this.userId));
    return collectionData(q, {idField: 'id'}) as Observable<Routine[]>;
  }
  async checkAndResetWeeklyRoutines() {
  const settingsDoc = await this.afs
    .doc(`users/${this.userId}/settings/weeklyReset`)
    .get()
    .toPromise();

  const today = new Date();
  const currentMonday = this.getMonday(today);

  const settingsData = settingsDoc?.data() as { lastResetDate?: string } | undefined;
  const lastResetDateStr = settingsData?.lastResetDate;
  const lastResetDate = lastResetDateStr ? new Date(lastResetDateStr) : null;
  const lastResetMonday = lastResetDate ? this.getMonday(lastResetDate) : null;

  const shouldReset = !lastResetMonday || currentMonday.getTime() !== lastResetMonday.getTime();

  if (shouldReset) {
      await this.resetAllRoutines(this.userId);
      await this.afs
        .doc(`users/${this.userId}/settings/weeklyReset`)
        .set({ lastResetDate: currentMonday.toISOString() });
      }
  }
  async resetAllRoutines(userId: string) {
  const routinesRef = this.afs.collection(`users/${userId}/routines`);
  const routinesSnapshot = await routinesRef.get().toPromise();

  const batch = this.afs.firestore.batch();
  const completionsReset = {
    mon: false, tue: false, wed: false,
    thu: false, fri: false, sat: false, sun: false
  };

  routinesSnapshot?.forEach(doc => {
    batch.update(doc.ref, {
      completions: completionsReset
    });
  });
    await batch.commit();
  }

  getMonday(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust if Sunday
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}
}
