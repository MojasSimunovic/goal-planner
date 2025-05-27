import { Component, EventEmitter, inject, Output } from '@angular/core';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  loginService = inject(LoginService);

  // @Output() emitLogin = new EventEmitter();
  // @Output() emitRegister = new EventEmitter();

  onClickRegister() {
    this.loginService.emitClick();
  }
  onClickLogin() {
    this.loginService.emitClick();
  }
}
