import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Form, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../model/goal';
import { LoggedUserData } from '../../model/user';

@Component({
  selector: 'app-new-goal',
  imports: [ReactiveFormsModule],
  templateUrl: './new-goal.component.html',
  styleUrl: './new-goal.component.css'
})
export class NewGoalComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  goalForm : FormGroup = new FormGroup({});

  user!: LoggedUserData;

  milestones! : FormArray;
  goalService = inject(GoalService);

  constructor() {
    this.initializeForm();
    this.createNewMilestoneForm();
  }
  ngOnInit(): void {
    const userData = localStorage.getItem('goalUser');
    this.user = userData ? JSON.parse(userData) : null;
    if (this.user) {
      this.goalForm.get('userId')?.setValue(this.user.userId);
    }
  }

  initializeForm() {
    this.goalForm = new FormGroup({
      goalId: new FormControl(0),
      goalName: new FormControl(''),
      description: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      isAchieved: new FormControl(false),
      userId: new FormControl(0),
      milestones: new FormArray([])
    })
  }

  get milestoneList(): FormArray {
    return this.goalForm.get('milestones') as FormArray;
  }

  createNewMilestoneForm() {
    const newForm = new FormGroup({
      milestoneId: new FormControl(0),
      milestoneName: new FormControl(''),
      description: new FormControl(''),
      targetDate: new FormControl(''),
      isCompleted: new FormControl(false)
    })
    this.milestoneList.push(newForm);
  }

  createGoal() {
    const formValue : Goal = this.goalForm.value;
    console.log(formValue);
    const subscription = this.goalService.saveGoal(formValue).subscribe({
      error: (error: Error) => {
        console.log(error);
      }
    })
    this.destroyRef.onDestroy(()=> {
      subscription.unsubscribe();
    })
  }
 
}
