import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoginService } from './login.service';
import { getAuth } from '@angular/fire/auth';
import { Routine } from '../model/routine';
import { firstValueFrom, from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutinesService {
  private userId: string;
  constructor(
    private afs: AngularFirestore,
    private firestore: Firestore,
    private loginAuthUser: LoginService
  ) {
    const auth = getAuth();
    this.userId = auth.currentUser?.uid || '';
  }
  createNewRoutine(routine: Routine) {
    routine = { ...routine, userId: this.userId };
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
    return collectionData(q, { idField: 'id' }) as Observable<Routine[]>;
  }

  async checkAndResetWeeklyRoutines(): Promise<void> {
    const currentMonday = this.getMonday(new Date());
    const settingsRef = this.afs.doc(
      `users/${this.userId}/settings/weeklyReset`
    );

    try {
      // const settingsDoc = await firstValueFrom(settingsRef.get());
      const settingsDocSnap = await getDoc(
        doc(this.firestore, `users/${this.userId}/settings/weeklyReset`)
      );
      const data = settingsDocSnap.data() as
        | { lastResetDate?: string }
        | undefined;
      const lastResetDateStr = data?.lastResetDate;

      if (
        lastResetDateStr &&
        new Date(lastResetDateStr).getTime() === currentMonday.getTime()
      ) {
        return;
      }

      await Promise.all([
        firstValueFrom(this.resetAllRoutines()),
        settingsRef.set({ lastResetDate: currentMonday.toISOString() }),
      ]);
    } catch (error) {
      console.error('Error checking/resetting weekly routines:', error);
      throw error;
    }
  }

  resetAllRoutines(): Observable<void> {
    const routinesRef = collection(this.firestore, 'routines');
    const q = query(routinesRef, where('userId', '==', this.userId));

    return from(getDocs(q)).pipe(
      switchMap((snapshot) => {
        if (snapshot.empty) return of(void 0);

        const batch = writeBatch(this.firestore);
        const completionsReset = {
          mon: false,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
          sun: false,
        };

        snapshot.docs.forEach((docSnapshot) => {
          batch.update(docSnapshot.ref, { completions: completionsReset });
        });

        return from(batch.commit());
      })
    );
  }

  getMonday(date: Date): Date {
    const targetDate = new Date(date);
    const day = targetDate.getDay();
    const daysToMonday = day === 0 ? -6 : 1 - day; // Sunday: -6, Mon: 0, Tue: -1, etc.

    targetDate.setDate(targetDate.getDate() + daysToMonday);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate;
  }
}
