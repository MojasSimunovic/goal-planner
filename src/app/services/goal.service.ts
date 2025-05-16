import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Goal } from '../model/goal';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  http = inject(HttpClient);

  constructor() { }

  saveGoal(obj: Goal) {
    return this.http.post( 'https://api.freeprojectapi.com/api/GoalTracker/createGoalWithMilestones',obj)
  }
}
