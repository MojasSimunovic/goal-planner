import { Component } from '@angular/core';
import { LandingComponent } from './landing/landing.component';
import { FeaturesComponent } from "./features/features.component";
import { CtaComponent } from './cta/cta.component';

@Component({
  selector: 'app-homepage',
  imports: [LandingComponent, FeaturesComponent,CtaComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
