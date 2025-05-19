import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserRegister, UserLogin } from '../model/user';
import { Task } from '../model/task';
import { GoalService } from './goal.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

   goalService = inject(GoalService);

  http = inject(HttpClient);

  createTask(newTask: Task): Observable<any> {
    return this.http.post<any>(`https://api.freeprojectapi.com/api/GoalTracker/createTask`, newTask).
    pipe(
      catchError((error)=> {
        console.log(error.error)
        return throwError(()=> new Error('failed to create new task'))
      })
    );
  }

  getTasksByUser():Observable<Task[]> {
    return this.http.get<Task[]>(`https://api.freeprojectapi.com/api/GoalTracker/getAllTasks?userId=${this.goalService.user.userId}`).
    pipe(
      catchError((error)=> {
        console.log(error.error)
        return throwError(()=> new Error('failed to create new task'))
      })
    );
  }
}