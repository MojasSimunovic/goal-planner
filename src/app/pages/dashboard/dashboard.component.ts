import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { DashboardRoutinesComponent } from "./dashboard-routines/dashboard-routines.component";
import { Task } from '../../model/task';
import { TaskService } from '../../services/task.service';
import { GoalService } from '../../services/goal.service';
import { ReminderService } from '../../services/reminder.service';
import { Goal } from '../../model/goal';
import { Reminder } from '../../model/reminder';
import { Routine } from '../../model/routine';
import { FormsModule } from '@angular/forms';
import {icons } from '../../model/iconList';
import { DashboardIconPickerComponent } from './dashboard-icon-picker/dashboard-icon-picker.component';
import { RoutinesService } from '../../services/routines.service';


declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  imports: [ DashboardCardComponent, DashboardRoutinesComponent, FormsModule,DashboardIconPickerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  routineService = inject(RoutinesService);
  faIcons = icons;
  selectedIcon = '';
  @ViewChild('routineModalRef') modalRef!: ElementRef;
  taskService = inject(TaskService);
  goalService = inject(GoalService);
  reminderService = inject(ReminderService);
  taskList = signal<Task[]>([]);
  goalsList = signal<Goal[]>([]);
  reminderList = signal<Reminder[]>([]);
  summaryCards = computed(() => [
    {
      title: 'Total Tasks',
      value: this.taskList().length,
      subtext: `${this.taskList().filter(t => t.isCompleted).length} completed`,
      icon: '📋'
    },
    {
      title: 'Active Goals',
      value: this.goalsList().length,
      subtext: `${this.goalsList().filter(t => t.isAchieved).length} achieved`,
      icon: '🏁'
    },
    {
      title: 'Reminders',
      value: this.reminderList().length,
      subtext: `${this.reminderList().filter(r => new Date(r.reminderDateTime) > new Date()).length} upcoming`,
      icon: '🔔'
    }
  ]);
  summaryCardRoutine = computed(() => [
    {
      title: 'Total Tasks',
      value: this.taskList().length,
      subtext: `${this.taskList().filter(t => t.isCompleted).length} completed`,
      icon: '📋'
    },
  ]);

  routine : Routine = {
    name: '',
    icon: '',
    completions: [false, false,false,false,false,false, false]
  }

  ngOnInit(): void {
    if (this.modalRef) {
      const modal = new bootstrap.Modal(this.modalRef);
    }
    this.getTasksByUser();
    this.getGoalsByUser();
    this.getRemindersByUser();
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
  }
  openModal() {
    const modal = new bootstrap.Modal(this.modalRef.nativeElement);
    modal.show();
  }
  getTasksByUser() {
    this.taskService.getAllTasksByUser().subscribe((data)=> {
      this.taskList.set(data);
    })
  }
  getGoalsByUser() {
    this.goalService.getAllGoalsFromUser().subscribe((data)=> {
      this.goalsList.set(data);
    })
  }

  getRemindersByUser() {
    this.reminderService.getAllRemindersByUser().subscribe((data)=> {
      this.reminderList.set(data);
    })
  }

  onSaveRoutine() {
    this.routineService.createNewRoutine(this.routine);
    this.closeModal();
    this.routine = {
      name: '',
      icon: '',
      completions: [false, false,false,false,false,false, false]
    }
  }
}
