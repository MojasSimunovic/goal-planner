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
        data: this.calculateDailySuccess(this.routines()),
        label: 'Weekly Progress',
        fill: true,
        tension: 0.1,
        borderColor: '#20c997',
        backgroundColor: 'rgba(39, 43, 46, 0.3)'
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
    const perDayCounts = routines
      .map(r => r.completions.map(v => v ? 1 : 0))
      .reduce((acc, curr) => acc.map((val, i) => val + curr[i]), Array(7).fill(0));
    const dailyPercentages = perDayCounts.map(count => Math.round((count / total) * 100));
    const cumulative = dailyPercentages.reduce((acc: number[], val, i) => {
      acc[i] = (acc[i - 1] || 0) + val;
      return acc;
    }, []);
    return cumulative;
  }
}
