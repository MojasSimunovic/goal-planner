import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, NgFor],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
summaryCards = [
  {
    title: 'Total Tasks',
    value: 12,
    subtext: '4 completed',
    icon: '📋'
  },
  {
    title: 'Active Goals',
    value: 3,
    subtext: '2 in progress',
    icon: '🏁'
  },
  {
    title: 'Reminders',
    value: 5,
    subtext: '2 upcoming',
    icon: '🔔'
  },
  {
    title: 'Completion Rate',
    value: '75%',
    subtext: 'This week',
    icon: '📈'
  }
];

days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

tasks = [
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
}
