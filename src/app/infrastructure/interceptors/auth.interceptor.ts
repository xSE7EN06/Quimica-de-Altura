import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const tokenService = inject(TokenService);
    const token = tokenService.getAccessToken();

    let authReq = req;
    const url = req.url;

    const isPublicUrl = url.includes('/login') || url.includes('/register') || url.includes('/verify-email') || url.includes('/2fa/challenge') || url.includes('/resend-verification') || url.includes('/refresh') || url.includes('/validate');

    if (token && !isPublicUrl) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Return and let refresh interceptor handle 401
            return throwError(() => error);
        })
    );
};
