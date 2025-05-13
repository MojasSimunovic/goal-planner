import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './services/login.service';
import { UserLogin, UserRegister } from './model/user';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {

  @ViewChild('authModalRef') modalRef!: ElementRef;
  private destroyRef = inject(DestroyRef);
  registerObject : UserRegister = {emailId: "", password: "", mobileNo: "", userId: 0,fullName: ""};
  loginObject : UserLogin = {emailId: "", password: ""};
  loginService = inject(LoginService);
  error = signal('');

  loggedUserData: any;

  isLoggedIn = signal(false);
  ngOnInit(): void {
    const modalEl = document.getElementById('loginModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
    }
    const storedUser: any = localStorage.getItem('goalUser');
    if (storedUser) {
      this.loggedUserData = JSON.parse(storedUser);
      this.isLoggedIn.set(true);
    }
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
  }

  onRegister() {
    const subscription = this.loginService.register('https://api.freeprojectapi.com/api/GoalTracker/register', this.registerObject).subscribe({
      error: (error: Error)=>{
        this.error.set('something went wrong with load, try again')
      },
      complete: ()=> {
        this.closeModal();
        this.isLoggedIn.set(true);
        alert('Registration completed');
      }
    })
    this.destroyRef.onDestroy(()=> {
      subscription.unsubscribe();
    })
  }

  onLogin() {
    const subscription = this.loginService.login('https://api.freeprojectapi.com/api/GoalTracker/login',this.loginObject).subscribe({
      next: (res)=> {
        localStorage.setItem('goalUser', JSON.stringify(res));
        this.loggedUserData = res;
      },
      error: (error: Error)=>{
        this.error.set('something went wrong with load, try again')
      },
      complete: ()=> {
        this.closeModal();  
        this.isLoggedIn.set(true);
        alert('Login completed');
      }
    })
    this.destroyRef.onDestroy(()=> {
      subscription.unsubscribe();
    })
  }

  logout() {
    localStorage.removeItem('goalUser');
    this.isLoggedIn.set(false);
  }
}
