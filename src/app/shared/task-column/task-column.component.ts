import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '../../model/task';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.css'
})
export class TaskColumnComponent {
  @Input() tasks: Task[] = [];
  @Input() frequency: 'Daily' | 'Weekly' | 'Monthly' = 'Daily';
  @Output() drop = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() toggleTask = new EventEmitter<Task>();
  @Output() createReminder = new EventEmitter<Task>();

  get headerClass(): string {
    switch (this.frequency) {
      case 'Daily':
        return 'bg-success text-white';
      case 'Weekly':
        return 'bg-primary text-white';
      case 'Monthly':
        return 'bg-secondary text-white';
      default:
        return 'bg-success text-white';
    }
  }

  get iconClass(): string {
    switch (this.frequency) {
      case 'Daily':
        return 'fas fa-calendar-day me-2';
      case 'Weekly':
        return 'fas fa-calendar-week me-2';
      case 'Monthly':
        return 'fas fa-calendar-alt me-2';
      default:
        return 'fas fa-calendar me-2';
    }
  }

  get progressBarClass(): string {
    switch (this.frequency) {
      case 'Daily':
        return 'bg-success';
      case 'Weekly':
        return 'bg-primary';
      case 'Monthly':
        return 'bg-secondary';
      default:
        return 'bg-success';
    }
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    this.drop.emit(event);
  }

  onEditTask(task: Task) {
    this.editTask.emit(task);
  }

  onDeleteTask(taskId: string) {
    this.deleteTask.emit(taskId);
  }

  onToggleTask(task: Task) {
    this.toggleTask.emit(task);
  }

  onCreateReminder(task: Task) {
    this.createReminder.emit(task);
  }
} 