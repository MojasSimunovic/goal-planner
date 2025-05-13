import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements AfterViewInit {
  title = 'goal-planner';

  isLoginFormVisible = signal<boolean>(false);


  ngAfterViewInit(): void {
    console.log('started')
    const modalEl = document.getElementById('loginModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      // modal.show(); // auto-show on page load
    }
  }
}
