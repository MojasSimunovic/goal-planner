import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Task } from '../../model/task';
import { GoalService } from '../../services/goal.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-task-list',
  imports: [FormsModule, DatePipe, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  goalService = inject(GoalService);
  taskService = inject(TaskService);

  taskList$ : Observable<Task[]> = new Observable<Task[]>();
  newTask: Task = {
  taskId: 0,
  taskName: '',
  description: '',
  frequency: '',
  createdDate: new Date(), // ISO date string
  startDate: '',   // ISO date string
  dueDate: '',     // ISO date string
  isCompleted: false,
  userId: 0
  }

  @ViewChild('taskModalRef') modalRef!: ElementRef;
  ngOnInit(): void {
    // this.newTask.userId = this.goalService.user.userId;
    if (this.modalRef) {
      const modal = new bootstrap.Modal(this.modalRef);
    }
    this.getAllTasksByUser();
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
  }

  getAllTasksByUser() {
    this.taskList$ = this.taskService.getTasksByUser();
  }
 
  onSaveTask() {
    const subscription = this.taskService.createTask(this.newTask).subscribe({
      error: (error: Error) => {
        console.log(error);
      }
    });
    this.destroyRef.onDestroy(()=> {
      subscription.unsubscribe();
    })
    this.getAllTasksByUser();
    this.closeModal();
    this.newTask = {
      taskId: 0,
      taskName: '',
      description: '',
      frequency: '',
      createdDate: new Date(), // ISO date string
      startDate: '',   // ISO date string
      dueDate: '',     // ISO date string
      isCompleted: false,
      userId: this.goalService.user.userId
    }
  }
}
