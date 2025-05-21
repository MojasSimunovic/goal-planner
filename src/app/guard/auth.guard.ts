import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GoalService } from '../services/goal.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AngularFireAuth);
  const router = inject(Router);

  const user = await firstValueFrom(auth.authState);

  if (user) {
    return true;
  } else {
    router.navigateByUrl('home');
    return false;
  }
};

export const authGuardLoggedIn: CanActivateFn = async (route, state) => {
  const auth = inject(AngularFireAuth);
  const router = inject(Router);
  const user = await firstValueFrom(auth.authState);

  if (user) {
    router.navigateByUrl('dashboard'); 
    return false;
  } else {
    return true;
  }
};