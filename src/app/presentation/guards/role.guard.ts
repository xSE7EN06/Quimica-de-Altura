import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../infrastructure/services/session.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return () => {
        const sessionService = inject(SessionService);
        const router = inject(Router);

        const match = allowedRoles.some(role => sessionService.hasRole(role));

        if (match) {
            return true;
        }

        return router.parseUrl('/home');
    };
};
