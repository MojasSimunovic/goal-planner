import { Component } from '@angular/core';
import { Form, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-goal',
  imports: [ReactiveFormsModule],
  templateUrl: './new-goal.component.html',
  styleUrl: './new-goal.component.css'
})
export class NewGoalComponent {

  goalForm : FormGroup = new FormGroup({});

  milestones! : FormArray;

  constructor() {
    this.initializeForm();
    this.createNewMilestoneForm();
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
}
