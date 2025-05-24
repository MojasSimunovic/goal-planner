import { Component, computed, Input, OnInit, signal, effect } from '@angular/core';
import { Routine } from '../../../model/routine';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard-chart',
  imports: [BaseChartDirective],
  templateUrl: './dashboard-chart.component.html',
  styleUrl: './dashboard-chart.component.css',
  host: {
    class: 'col-12 col-md-5'
  }
})
export class DashboardChartComponent {
  @Input({ required: true }) routines = signal<Routine[]>([]);
  lineChartData = computed(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: this.calculateDailySuccess(this.routines()), // This will automatically update
        label: 'Routine Progress',
        fill: true,
        tension: 0.1,
        borderColor: 'black',
        backgroundColor: 'rgba(204, 201, 154, 0.3)'
      }
    ]
  }));
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;
  calculateDailySuccess(routines: Routine[]): any {
   const total = routines.length * 7;

    if (total === 0) return Array(7).fill(0);
    // Step 1: Count trues per day
    const perDayCounts = routines
      .map(r => r.completions.map(v => v ? 1 : 0))
      .reduce((acc, curr) => acc.map((val, i) => val + curr[i]), Array(7).fill(0));
    // Step 2: Convert to percentages
    const dailyPercentages = perDayCounts.map(count => Math.round((count / total) * 100));
    // Step 3: Make cumulative
    const cumulative = dailyPercentages.reduce((acc: number[], val, i) => {
      acc[i] = (acc[i - 1] || 0) + val;
      return acc;
    }, []);
    return cumulative;
  }

}
