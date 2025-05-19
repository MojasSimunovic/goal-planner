import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Task } from '../../model/task';
import { GoalService } from '../../services/goal.service';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

declare var bootstrap: any;

@Component({
  selector: 'app-task-list',
  imports: [FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  goalService = inject(GoalService);
  taskService = inject(TaskService);
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
    this.newTask.userId = this.goalService.user.userId;
    if (this.modalRef) {
      const modal = new bootstrap.Modal(this.modalRef);
    }
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
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
    this.closeModal();
  }
}
