import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GoalService } from '../services/goal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const goalService = inject(GoalService);
  const router = inject(Router);

  const user = goalService.user;
  if (user) {
    return true;
  } else {
    router.navigate(['home']); // or /login if you have one
    return false;
  }
};