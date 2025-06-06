import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../model/goal';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { AutoOpenDatePickerDirective } from '../../directives/open-date-picker.directive';

@Component({
  selector: 'app-new-goal',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    AutoOpenDatePickerDirective,
  ],
  templateUrl: './new-goal.component.html',
  styleUrl: './new-goal.component.css',
})
export class NewGoalComponent implements OnInit {
  goal: Goal = {
    goalName: '',
    description: '',
    startDate: '',
    endDate: '',
    isAchieved: false,
    milestones: [
      {
        milestoneName: '',
        description: '',
        targetDate: '',
        isCompleted: false,
      },
    ],
  };
  route = inject(ActivatedRoute);
  goalService = inject(GoalService);
  router = inject(Router);

  editing: boolean = false;
  constructor() {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const goalId = params['id'];
      if (goalId) {
        this.editing = !this.editing;
        this.goalService.getGoalById(goalId).then((goal) => {
          if (goal) {
            this.goal = goal;
          } else {
            return;
          }
        });
      }
    });
  }

  addMilestone() {
    this.goal.milestones?.push({
      milestoneName: '',
      description: '',
      targetDate: '',
      isCompleted: false,
    });
  }
  createGoal() {
    if (this.editing) {
      this.goalService.updateGoal(this.goal).subscribe({
        next: () => {
          this.router.navigate(['goals']);
        },
        error: (err) => {
          console.error('Error creating goal:', err);
        },
      });
    } else {
      this.goalService.createNewGoal(this.goal).subscribe({
        next: () => {
          this.router.navigate(['goals']);
        },
        error: (err) => {
          console.error('Error creating goal:', err);
        },
      });
    }
  }
}
