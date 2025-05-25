import { Component, inject, OnInit, signal } from '@angular/core';
import { Router} from '@angular/router';
import { GoalService } from '../../services/goal.service';
import { Goal } from '../../model/goal';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleComponent } from '../../shared/title/title.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-goal-list',
  imports: [DatePipe, NgClass, FormsModule, TitleComponent, ButtonComponent],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.css',
})
export class GoalListComponent implements OnInit {
  goalList = signal<Goal[]>([]);
  router = inject(Router)
  goalService = inject(GoalService);
  ngOnInit(): void {
    this.goalService.getAllGoalsFromUser().subscribe((data)=> {
      this.goalList.set(data.sort((a, b) => Number(a.isAchieved) - Number(b.isAchieved))
    )
    })
  }
  navigateToNewGoal() {
    this.router.navigateByUrl('new-goal');
  }

  onMilestoneToggled(goal: Goal) {
    if(goal.milestones.length === goal.milestones.filter(m => m.isCompleted).length) {
      goal = { ...goal, isAchieved: true };
      this.goalService.updateGoal(goal).subscribe({
        error: (err: any) => console.error('Failed to update milestone:', err)
      });
    } else {
      goal = { ...goal, isAchieved: false };
      this.goalService.updateGoal(goal).subscribe({
        error: (err: any) => console.error('Failed to update milestone:', err)
      });
    }
  }
  calculateProgress(goal: Goal): number {
    const total = goal.milestones?.length || 0;
    const completed = goal.milestones?.filter(m => m.isCompleted).length || 0;
    return Math.round((completed / total) * 100);
  }
  onEditGoal(goal: Goal) {
    this.router.navigate(['/new-goal'], { queryParams: { id: goal.id } });
  }
  onDeleteGoal(goal: Goal) {
    if (goal.id) {
      this.goalService.deleteGoal(goal.id);
    } else {
      console.error('Goal id is undefined, cannot delete goal.');
    }
  }
}
