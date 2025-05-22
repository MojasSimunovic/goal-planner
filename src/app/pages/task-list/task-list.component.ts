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
  taskService = inject(TaskService);
  taskList$ : Observable<Task[]> = new Observable<Task[]>();
  newTask: Task = {
    taskName: '',
    description: '',
    frequency: '',
    dueDate: '',   
    isCompleted: false,
  }
  @ViewChild('taskModalRef') modalRef!: ElementRef;
  ngOnInit(): void {
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
    // this.taskList$ = this.taskService.getTasksByUser();
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
      taskName: '',
      description: '',
      frequency: '',
      dueDate: '',     // ISO date string
      isCompleted: false,
    }
  }
}
