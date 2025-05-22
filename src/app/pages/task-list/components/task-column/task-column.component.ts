import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../../model/task';
import { NgFor } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-column',
  imports: [NgFor,TaskItemComponent,CdkDropList],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.css'
})
export class TaskColumnComponent {
  @Input() title!: string;
  @Input() color: 'success' | 'primary' | 'secondary' = 'primary';
  @Input() tasks: Task[] = [];

  @Output() taskMoved = new EventEmitter<{
    task: Task;
    from: string;
    to: string;
  }>();
  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      this.taskMoved.emit({
        task,
        from: task.frequency,
        to: this.title
      });

      transferArrayItem(
        event.previousContainer.data,
        this.tasks,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
