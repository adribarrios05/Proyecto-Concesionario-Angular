import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { CustomerService } from '../services/impl/customer.service';
import { filter, switchMap, map, take, of, catchError } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(BaseAuthenticationService);
  const customerService = inject(CustomerService);
  const router = inject(Router);

  return authService.ready$.pipe(
    filter((isReady) => isReady),
    take(1),
    switchMap(() => authService.authState$),
    switchMap((user) => {
      if (!user?.id) {
        console.log("No hay user")
        router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
        return of(false);
      }

      return customerService.getById(user.id).pipe(
        map((customer) => {
          const isAdmin = !!customer?.role?.includes('admin');
          if (!isAdmin) {
            router.navigate(['/home']);
          }
          return isAdmin;
        }),
        catchError((err) => {
          console.error('❌ Error al comprobar rol admin:', err);
          router.navigate(['/home']);
          return of(false);
        })
      );
    })
  );
};
