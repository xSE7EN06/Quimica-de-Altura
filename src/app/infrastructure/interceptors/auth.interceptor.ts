import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const skipUrls = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/validate', '/auth/verify-email',
    '/auth/resend-verification', '/auth/password/', '/auth/2fa/challenge',
    '/auth/2fa/request-email-code', '/auth/oauth/'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));

  if (shouldSkip || !auth.accessToken) {
    return next(req);
  }

  const authed = req.clone({
    setHeaders: { Authorization: `Bearer ${auth.accessToken}` }
  });

  return next(authed).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing && !req.url.includes('/auth/refresh')) {
        isRefreshing = true;
        return auth.refreshAccessToken().pipe(
          switchMap(tokens => {
            isRefreshing = false;
            const retried = req.clone({
              setHeaders: { Authorization: `Bearer ${tokens.access_token}` }
            });
            return next(retried);
          }),
          catchError(() => {
            isRefreshing = false;
            auth.clearSession();
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
