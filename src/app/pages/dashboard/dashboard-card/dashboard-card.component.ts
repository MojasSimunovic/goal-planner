import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  imports: [],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'col-6 col-md-4'
  }
})
export class DashboardCardComponent {
  @Input() card : any;
}
