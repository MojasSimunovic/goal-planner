import { Component, inject, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { LoggedUserData } from '../../model/user';
import { Goal, GoalWithoutMilestone } from '../../model/goal';

@Component({
  selector: 'app-goal-list',
  imports: [],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.css'
})
export class GoalListComponent implements OnInit {
  goalsList! : GoalWithoutMilestone[];
  ngOnInit(): void {
    if(this.goalService.user) {
      this.goalService.getAllGoalsFromUser().subscribe((res: any)=> {
        this.goalsList = res;
      })
    }
  }

  router = inject(Router)
  goalService = inject(GoalService);
  navigateToNewGoal() {
    this.router.navigateByUrl('new-goal');
  }
}
