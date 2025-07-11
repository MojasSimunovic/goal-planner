import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { RoutinesService } from '../../../services/routines.service';
import { Routine } from '../../../model/routine';
import { DashboardChartComponent } from "../dashboard-chart/dashboard-chart.component";
import { SectionTitleComponent } from "../../../shared/section-title/section-title.component";
import { ButtonComponent } from "../../../shared/button/button.component";

@Component({
  selector: 'app-dashboard-routines',
  imports: [DashboardChartComponent, SectionTitleComponent, ButtonComponent],
  templateUrl: './dashboard-routines.component.html',
  styleUrl: './dashboard-routines.component.css',
   host: {
    class: 'content-grid'
  }
})
export class DashboardRoutinesComponent implements OnInit {
  routineService = inject(RoutinesService);
  @Output() newRoutine = new EventEmitter();
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  routines = signal<Routine[]>([]);

  ngOnInit(): void {
    this.routineService.checkAndResetWeeklyRoutines();
    this.routineService.initializeGlobalWeeklyReset();
    this.getAllRoutines();
  }
  getAllRoutines() {
    this.routineService.getAllRoutines().subscribe((data)=> {
      this.routines.set(data);
    });
  }
  markAsCompleted(routine: Routine ,index: number) {
    let updatedCompletions = [...routine.completions] as [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
    updatedCompletions[index] = !updatedCompletions[index];
    let updatedRoutine: Routine = { ...routine, completions: updatedCompletions };
    this.routineService.updateRoutine(updatedRoutine).subscribe();
    this.getAllRoutines()
  }
  addRoutine() {
    this.newRoutine.emit();
  }
  onRemoveRoutine(routine: Routine) {
    this.routineService.deleteRoutine(routine);
    this.getAllRoutines();
  }
}
