import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../../infrastructure/services/token.service';

export const authGuard: CanActivateFn = () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);

    if (tokenService.hasAccessToken()) {
        return true;
    }

    return router.parseUrl('/login');
};
