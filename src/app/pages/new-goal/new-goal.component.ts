import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../model/goal';
import { LoggedUserData } from '../../model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-new-goal',
  imports: [ReactiveFormsModule, FormsModule, NgFor],
  templateUrl: './new-goal.component.html',
  styleUrl: './new-goal.component.css'
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
          isCompleted: false
        }
      ]
  }
  route = inject(ActivatedRoute);
  goalService = inject(GoalService);
  router = inject (Router);

  editing: boolean = false;
  constructor() {}
  ngOnInit(): void {
     this.route.queryParams.subscribe(params => {
      const goalId = params['id'];
      if (goalId) {
        this.editing = !this.editing;
        this.goalService.getGoalById(goalId).then(goal => {
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
      isCompleted: false
    });
  }
  createGoal() {
    if(this.editing) {
      this.goalService.updateGoal(this.goal).subscribe({
      next: () => {
        this.router.navigate(['goals']);
      },
      error: (err) => {
        console.error('Error creating goal:', err);
      }
    });
    } else {
      this.goalService.createNewGoal(this.goal).subscribe({
        next: () => {
          this.router.navigate(['goals']);
        },
        error: (err) => {
          console.error('Error creating goal:', err);
        }
      });
    }
  }
}
