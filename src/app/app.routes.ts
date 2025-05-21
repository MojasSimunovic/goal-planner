import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GoalListComponent } from './pages/goal-list/goal-list.component';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { RemindersComponent } from './pages/reminders/reminders.component';
import { NewGoalComponent } from './pages/new-goal/new-goal.component';
import { authGuard, authGuardLoggedIn } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [authGuardLoggedIn],
    component: HomepageComponent
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent
  },
  {
    path: 'goals',
    canActivate: [authGuard],
    component: GoalListComponent
  },
  {
    path: 'new-goal',
    canActivate: [authGuard],
    component: NewGoalComponent
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    component: TaskListComponent
  },
  {
    path: 'reminders',
    canActivate: [authGuard],
    component: RemindersComponent
  },
];
