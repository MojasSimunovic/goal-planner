import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="title-container">
      <h1>
        <ng-content></ng-content>
      </h1>
    </div>
  `,
  styles: [`
    .title-container {
      flex: 1;
      min-width: 0; /* Prevents flex item from overflowing */
      margin-right: 1rem;
    }

    h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #ffffff, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: left;
      animation: slideInDown 0.8s ease;
      word-break: break-word;
      max-width: 100%;
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
    }

    @media (max-width: 576px) {
      h1 {
        font-size: 1.75rem;
      }
    }

    @keyframes slideInDown {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class TitleComponent {}
