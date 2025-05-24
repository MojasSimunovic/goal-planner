import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-routines',
  imports: [NgFor,NgIf],
  templateUrl: './dashboard-routines.component.html',
  styleUrl: './dashboard-routines.component.css',
  host: {
    class: 'card shadow-sm'
  }
})
export class DashboardRoutinesComponent {

  @Output() newRoutine = new EventEmitter();
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  routines = [
    {
      name: 'Morning Exercise',
      icon: 'bi bi-bicycle',
      completions: [true, true, false, false, true, false, false]
    },
    {
      name: 'Read 30 Minutes',
      icon: 'bi bi-book',
      completions: [true, false, true, true, false, false, false]
    },
    {
      name: 'Meditation',
      icon: 'bi bi-cloud-sun',
      completions: [true, true, true, false, false, false, false]
    }
  ];

  addRoutine() {
    this.newRoutine.emit();
  }
}
