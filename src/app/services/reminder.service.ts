import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../model/reminder';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  http = inject(HttpClient);

  constructor() { }

  getAllRemindersByUser(userId: number): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`https://api.freeprojectapi.com/api/GoalTracker/getReminders?userId=${userId}`);
  }

  creteNewReminder(newReminder: Reminder) {
    return this.http.post('https://api.freeprojectapi.com/api/GoalTracker/createReminder', newReminder);
  }

  updateReminder(reminder: Reminder, reminderId: number) {
    return this.http.put(`https://api.freeprojectapi.com/api/GoalTracker/updateReminder?id=${reminderId}`, reminder);
  }
}
