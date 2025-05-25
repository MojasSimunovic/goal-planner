import { Component, computed, Input, OnInit, signal, effect } from '@angular/core';
import { Routine } from '../../../model/routine';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { SectionTitleComponent } from "../../../shared/section-title/section-title.component";

@Component({
  selector: 'app-dashboard-chart',
  imports: [BaseChartDirective, SectionTitleComponent],
  templateUrl: './dashboard-chart.component.html',
  styleUrl: './dashboard-chart.component.css',
  host: {
    class: 'progress-section'
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
        borderColor: '#00d4ff',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#7c3aed',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 3,
        options: {
          responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  font: {
                    weight: 600
                  }
                }
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  font: {
                    weight: 600
                  }
                },
                beginAtZero: true
              }
            },
            elements: {
              point: {
                hoverRadius: 10
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            }
        }
      },
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
