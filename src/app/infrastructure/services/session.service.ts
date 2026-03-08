import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from './token.service';

export interface UserSession {
    user_id: string;
    email: string;
    role?: string;
    roles?: string[];
    requires_2fa?: boolean;
    email_not_verified?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private currentUserSubject = new BehaviorSubject<UserSession | null>(null);
    public currentUser$: Observable<UserSession | null> = this.currentUserSubject.asObservable();

    constructor(private tokenService: TokenService) { }

    setSession(user: UserSession): void {
        this.currentUserSubject.next(user);
    }

    clearSession(): void {
        this.tokenService.removeTokens();
        this.currentUserSubject.next(null);
    }

    getCurrentUser(): UserSession | null {
        return this.currentUserSubject.value;
    }

    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (user.role === role) return true;
        if (user.roles && user.roles.includes(role)) return true;
        return false;
    }
}
