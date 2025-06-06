import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Task } from '../../model/task';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TitleComponent } from '../../shared/title/title.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { AutoOpenDatePickerDirective } from '../../directives/open-date-picker.directive';
import { TaskColumnComponent } from '../../shared/task-column/task-column.component';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    FormsModule,
    DragDropModule,
    TitleComponent,
    ButtonComponent,
    AutoOpenDatePickerDirective,
    TaskColumnComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  @ViewChild('taskModalRef') modalRef!: ElementRef;
  @ViewChild('taskDateInput') dateInput!: ElementRef;

  taskService = inject(TaskService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);

  tasks = signal<Task[]>([]);
  dailyTasks = signal<Task[]>([]);
  weeklyTasks = signal<Task[]>([]);
  monthlyTasks = signal<Task[]>([]);

  isEditing = false;
  newTask: Task = {
    taskName: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    frequency: 'Daily',
    isCompleted: false,
  };

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasksByUser().subscribe((data) => {
      this.tasks.set(data);
      this.updateTaskLists();
    });
  }

  updateTaskLists() {
    this.dailyTasks.set(this.tasks().filter((task) => task.frequency === 'Daily'));
    this.weeklyTasks.set(this.tasks().filter((task) => task.frequency === 'Weekly'));
    this.monthlyTasks.set(this.tasks().filter((task) => task.frequency === 'Monthly'));
  }

  async drop(event: CdkDragDrop<Task[]>, frequency: 'Daily' | 'Weekly' | 'Monthly') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.container.data[event.currentIndex];
      try {
        await this.taskService.editTask(task.id!, frequency, event.currentIndex);
        this.loadTasks();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  }

  editTaskModal(task: Task) {
    this.isEditing = true;
    this.newTask = { ...task };
    const modal = new bootstrap.Modal(this.modalRef.nativeElement);
    modal.show();
  }

  async deleteTask(taskId: string) {
    try {
      await this.taskService.deleteTask(taskId);
      this.loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  toggleTaskCompletion(task: Task) {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    firstValueFrom(this.taskService.onEditEntireTask(updatedTask))
      .then(() => this.loadTasks())
      .catch(error => console.error('Error updating task:', error));
  }

  createReminder(task: Task) {
    sessionStorage.setItem('reminderTaskTitle', task.taskName);
    this.router.navigate(['/reminders']);
  }

  async onSaveTask() {
    try {
      if (this.isEditing) {
        await firstValueFrom(this.taskService.onEditEntireTask(this.newTask));
      } else {
        await firstValueFrom(this.taskService.createTask(this.newTask));
      }
      this.loadTasks();
      this.closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
    this.resetForm();
  }

  private resetForm() {
    this.isEditing = false;
    this.newTask = {
      taskName: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      frequency: 'Daily',
      isCompleted: false,
    };
  }
}
