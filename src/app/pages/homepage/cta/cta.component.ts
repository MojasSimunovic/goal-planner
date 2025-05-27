import { Component, inject } from '@angular/core';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-cta',
  imports: [],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css'
})
export class CtaComponent {
  loginService = inject(LoginService);

  onClickLogin() {
    this.loginService.emitClick();
  }
}
