import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Goal } from '../model/goal';
import { LoggedUserData } from '../model/user';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, query, setDoc, where } from '@angular/fire/firestore';
import { getAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private userId: string;
  firestore = inject(Firestore);
  constructor() {
    const auth = getAuth();
    this.userId = auth.currentUser?.uid || '';
  }
  createNewGoal(goal: Goal) {
    goal = {...goal, userId: this.userId};
    const goalsCollection = collection(this.firestore, 'goals');
    const newDocRef = doc(goalsCollection); // generate a new doc ref
  // set the ID manually inside the goal object (optional but useful)
    const goalWithId = { ...goal, id: newDocRef.id };
    return from(setDoc(newDocRef, goalWithId));
  }
  getAllGoalsFromUser() {
    if (!this.userId) throw new Error('No user logged in');
    const goalsRef = collection(this.firestore, 'goals');
    const q = query(goalsRef, where('userId', '==', this.userId));
    return collectionData(q, { idField: 'id' }) as Observable<Goal[]>;
  }
  updateGoal(goal: Goal): Observable<void> {
    const goalDocRef = doc(this.firestore, `goals/${goal.id}`);
    return from(setDoc(goalDocRef, goal));
  }
  getGoalById(goalId: string): Promise<Goal | null> {
    const goalDocRef = doc(this.firestore, `goals/${goalId}`);
    return getDoc(goalDocRef).then(snapshot => {
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Goal;
      } else {
        return null;
      }
    });
  }
  deleteGoal(goalId: string) {
    const goalDocRef = doc(this.firestore, `goals/${goalId}`);
    return deleteDoc(goalDocRef);
  }
}
