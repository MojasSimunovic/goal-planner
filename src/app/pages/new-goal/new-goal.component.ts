import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../model/goal';
import { LoggedUserData } from '../../model/user';
import { Router } from '@angular/router';
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
  goalService = inject(GoalService);
  router = inject (Router);
  constructor() {}
  ngOnInit(): void {
   
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
