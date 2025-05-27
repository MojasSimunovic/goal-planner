import { Component } from '@angular/core';
import { LandingComponent } from './landing/landing.component';

@Component({
  selector: 'app-homepage',
  imports: [LandingComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
