import { HttpHandlerFn, HttpRequest, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../application/services/loading.service';
import { finalize, Observable } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const loadingService = inject(LoadingService);

    loadingService.show();

    return next(req).pipe(
        finalize(() => {
            loadingService.hide();
        })
    );
};
