import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';
import { UserLogin} from './model/user';
import { NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "./shared/button/button.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent  implements OnInit {
  private modal: any;
  email = '';
  password = '';
  error: string | null = null;
  @ViewChild('registerTrigger') registerTriggerRef!: ElementRef;
  private destroyRef = inject(DestroyRef);
  loginService = inject(LoginService);
  router = inject(Router);
  userSignal = toSignal(this.loginService.user$);
  registerObject = {
    emailId: '',
    password: ''
  };
  isLoggedIn = signal(false);
  private subscription: Subscription = new Subscription();
  ngOnInit(): void {
    // const modal = new bootstrap.Modal(this.modalRef);
    this.createParticles();
    this.subscription.add(
      this.loginService.click$.subscribe(data => {
        this.registerTriggerRef.nativeElement.click();
      })
    );
  }
  ngAfterViewInit() {
    const modalElement = document.getElementById('authModal');
    if (modalElement) {
      console.log(modalElement)
      this.modal = new (window as any).bootstrap.Modal(modalElement);
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

  openModal() {
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
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
