import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reminder } from '../model/reminder';
import { Observable, from } from 'rxjs';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  where,
  query,
} from '@angular/fire/firestore';
import { LoginService } from './login.service';
import { getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private userId: string;
  firestore = inject(Firestore);
  loginAuthUser = inject(LoginService);
  constructor() {
    const auth = getAuth();
    this.userId = auth.currentUser?.uid || '';
  }
  deleteReminder(reminderId: string) {
    const reminderDocRef = doc(this.firestore, `reminders/${reminderId}`);
    return deleteDoc(reminderDocRef);
  }
  getAllRemindersByUser(): Observable<Reminder[]> {
  if (!this.userId) throw new Error('No user logged in');
    const remindersRef = collection(this.firestore, 'reminders');
    const q = query(remindersRef, where('userId', '==', this.userId));
    return collectionData(q, { idField: 'id' }) as Observable<Reminder[]>;
  }

  createNewReminder(reminder: Reminder) {
    reminder = {...reminder, userId: this.userId};
    const reminderRef = collection(this.firestore, 'reminders');
    return addDoc(reminderRef, {
      ...reminder,
      reminderDateTime: reminder.reminderDateTime instanceof Date
        ? reminder.reminderDateTime.toISOString()
        : reminder.reminderDateTime
    });
  }
}
