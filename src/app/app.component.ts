import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';
import { UserLogin, UserRegister } from './model/user';
import { NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {
  email = '';
  password = '';
  error: string | null = null;
  @ViewChild('authModalRef') modalRef!: ElementRef;
  private destroyRef = inject(DestroyRef);
  loginService = inject(LoginService);
  router = inject(Router);
  userSignal = toSignal(this.loginService.user$);
  registerObject = {
    emailId: '',
    password: ''
  };
  isLoggedIn = signal(false);
  ngOnInit(): void {
    const modalEl = document.getElementById('loginModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
    }
  }
  async onLogin() {
    try {
      await this.loginService.login(this.email, this.password);
      this.closeModal();
      setTimeout(()=> {
        this.router.navigate(['/dashboard']);
      }, 1000)
    } catch (err: any) {
      this.error = err.message;
    }
  }
  async onRegister() {
    this.error = null;
    try {
      await this.loginService.register(this.registerObject.emailId, this.registerObject.password);
      this.closeModal();
      setTimeout(()=> {
        this.router.navigate(['/dashboard']);
      }, 1000)
    } catch (err: any) {
      this.error = err.message;
    }
  }
  async onLogout() {
    this.error = null;
    try {
      await this.loginService.logout()
    } catch (err: any) {
      this.error = err.message;
    }
  }
  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
  }
}
