import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Goal } from '../model/goal';
import { LoggedUserData } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  http = inject(HttpClient);

  user! : LoggedUserData;

  constructor() {
    const userData = localStorage.getItem('goalUser');
    this.user = userData ? JSON.parse(userData) : null;
   }

  saveGoal(obj: Goal) {
    return this.http.post( 'https://api.freeprojectapi.com/api/GoalTracker/createGoalWithMilestones',obj);
  }

  getAllGoalsFromUser() {
    return this.http.get(`https://api.freeprojectapi.com/api/GoalTracker/getAllGoalsByUser?userId=${this.user.userId}`);
  }
}
