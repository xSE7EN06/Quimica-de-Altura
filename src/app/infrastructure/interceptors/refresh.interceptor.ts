import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const refreshInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshTokenSubject.next(null);

                    return authService.refreshAccessToken().pipe(
                        switchMap((tokenResponse: any) => {
                            isRefreshing = false;
                            refreshTokenSubject.next(tokenResponse.access_token);
                            const clonedRequest = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${tokenResponse.access_token}`
                                }
                            });
                            return next(clonedRequest);
                        }),
                        catchError((err) => {
                            isRefreshing = false;
                            authService.logout();
                            return throwError(() => err);
                        })
                    );
                } else {
                    return refreshTokenSubject.pipe(
                        filter(token => token !== null),
                        take(1),
                        switchMap(token => {
                            const clonedRequest = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            return next(clonedRequest);
                        })
                    );
                }
            }
            return throwError(() => error);
        })
    );
};
