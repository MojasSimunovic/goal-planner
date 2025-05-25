import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';
import { UserLogin, UserRegister } from './model/user';
import { NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterLink, RouterLinkActive],
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
    this.createParticles();
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
  createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 4 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 3) + 's';       
      container?.appendChild(particle);
    }
  }
}
