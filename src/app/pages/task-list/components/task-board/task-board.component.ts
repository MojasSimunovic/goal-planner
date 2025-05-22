import { Component, computed, inject, input, Input } from '@angular/core';
import { Task } from '../../../../model/task';
import { TaskColumnComponent } from '../task-column/task-column.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../../../services/task.service';

@Component({
  selector: 'app-task-board',
  imports: [TaskColumnComponent,DragDropModule],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent {

  taskService = inject(TaskService);
  taskList = input.required<Task[]>();
  dailyTasks = computed(() => {
    return this.taskList().filter(t => t.frequency === 'Daily');
  });
  weeklyTasks = computed(() => {
    return this.taskList().filter(t => t.frequency === 'Weekly');
  });
  monthlyTasks = computed(()=> {
    return this.taskList().filter(t => t.frequency  ==='Monthly');
  })

  onTaskMoved(event: { task: Task; from: string; to: string }) {
  if (event.from !== event.to) {
    // Update the frequency in your backend or local data
    event.task.frequency = event.to;
    // this.taskService.updateTask(event.task); // or however you update
  }
}

  
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
