import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GoalListComponent } from './pages/goal-list/goal-list.component';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { RemindersComponent } from './pages/reminders/reminders.component';
import { NewGoalComponent } from './pages/new-goal/new-goal.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomepageComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'goals',
    component: GoalListComponent
  },
  {
    path: 'new-goal',
    component: NewGoalComponent
  },
  {
    path: 'tasks',
    component: TaskListComponent
  },
  {
    path: 'reminders',
    component: RemindersComponent
  },
];
