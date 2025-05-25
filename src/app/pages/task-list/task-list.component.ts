import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Task } from '../../model/task';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { DatePipe } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TitleComponent } from '../../shared/title/title.component';
import { ButtonComponent } from "../../shared/button/button.component";
import { SectionTitleComponent } from "../../shared/section-title/section-title.component";

declare var bootstrap: any;

@Component({
  selector: 'app-task-list',
  imports: [FormsModule, DatePipe, DragDropModule, TitleComponent, ButtonComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  taskService = inject(TaskService);
  dailyTasks = signal<Task[]>([]);
  weeklyTasks = signal<Task[]>([]);
  monthlyTasks = signal<Task[]>([]);
  taskList = signal<Task[]>([]);
  isEditing : boolean = false;
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
    this.isEditing = false;
  }
  openModal() {
    const modal = new bootstrap.Modal(this.modalRef.nativeElement);
    modal.show();
  }
  getAllTasksByUser() {
    this.taskService.getAllTasksByUser().subscribe((data: Task[]) => {
      const sortedTasks = data.sort((a, b) => (a.order || 0) - (b.order || 0));
      // Filter and set each column's tasks
      this.dailyTasks.set(sortedTasks.filter(task => task.frequency === 'Daily'));
      this.weeklyTasks.set(sortedTasks.filter(task => task.frequency === 'Weekly'));
      this.monthlyTasks.set(sortedTasks.filter(task => task.frequency === 'Monthly'));
    });
  }
 
  async onSaveTask() {
    if (this.isEditing) {
      this.taskService.onEditEntireTask(this.newTask).subscribe();
      this.getAllTasksByUser();
      this.closeModal();
      this.resetNewTask();
    } else {
      try {
      const currentTasks = this.getTasksByFrequency(this.newTask.frequency);
      this.newTask.order = currentTasks.length;

      await this.taskService.createTask(this.newTask).toPromise();
      this.getAllTasksByUser();
      this.closeModal();
      this.resetNewTask();
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  }

  private resetNewTask() {
    this.newTask = {
      taskName: '',
      description: '',
      frequency: '',
      dueDate: '',
      isCompleted: false,
      order: 0
    }
  }
  private getTasksByFrequency(frequency: string): Task[] {
    switch (frequency) {
      case 'Daily': return this.dailyTasks();
      case 'Weekly': return this.weeklyTasks();
      case 'Monthly': return this.monthlyTasks();
      default: return [];
    }
  }
  async drop(event: CdkDragDrop<Task[]>, category: string) {
    const draggedTask = event.item.data;
    
    if (event.previousContainer === event.container) {
      // Moving within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
      try {
        await this.taskService.reorderTasksInColumn(
          draggedTask.id!, 
          category, 
          event.currentIndex
        );
      } catch (error) {
        console.error('Error reordering task:', error);
        // Revert the local change if Firebase update fails
        moveItemInArray(event.container.data, event.currentIndex, event.previousIndex);
      }
    } else {
      // Moving between different columns
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      try {
        await this.taskService.editTask(
          draggedTask.id!, 
          category, 
          event.currentIndex
        );
      } catch (error) {
        console.error('Error moving task:', error);
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );
      }
    }
  }
  toggleTaskCompletion(task: Task) {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    this.taskService.onEditEntireTask(updatedTask).subscribe();
    this.getAllTasksByUser();
  }
  editTaskModal(task: Task) {
    this.newTask = { ...task };
    this.isEditing = true;
    this.openModal();
  }
  deleteTask(taskId: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).then(() => {
        this.getAllTasksByUser();
      });
    }
  }
}
