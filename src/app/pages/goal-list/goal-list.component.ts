import { Component, inject } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-goal-list',
  imports: [],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.css'
})
export class GoalListComponent {

  router = inject(Router)
  navigateToNewGoal() {
    this.router.navigateByUrl('new-goal');
  }
}
