import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, throwError, BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { SessionService, UserSession } from './session.service';

const GATEWAY_URL = 'http://localhost:8000'; // Default, you can change this
const BASE_URL = `${GATEWAY_URL}/api/auth/api/v1/auth`;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private tokenService = inject(TokenService);
    private sessionService = inject(SessionService);

    register(data: any): Observable<any> {
        return this.http.post(`${BASE_URL}/register`, data);
    }

    verifyEmail(email: string, code: string): Observable<any> {
        return this.http.post(`${BASE_URL}/verify-email`, { email, code });
    }

    resendVerification(email: string): Observable<any> {
        return this.http.post(`${BASE_URL}/resend-verification`, { email });
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${BASE_URL}/login`, credentials).pipe(
            tap((res: any) => {
                if (res.access_token && res.refresh_token) {
                    this.tokenService.saveTokens(res.access_token, res.refresh_token);
                }
            })
        );
    }

    twoFactorChallenge(challenge_token: string, code: string): Observable<any> {
        return this.http.post(`${BASE_URL}/2fa/challenge`, { challenge_token, code }).pipe(
            tap((res: any) => {
                if (res.access_token && res.refresh_token) {
                    this.tokenService.saveTokens(res.access_token, res.refresh_token);
                }
            })
        );
    }

    refreshToken(): Observable<any> {
        const refresh_token = this.tokenService.getRefreshToken();
        if (!refresh_token) return throwError(() => new Error('No refresh token'));

        return this.http.post(`${BASE_URL}/refresh`, { refresh_token }).pipe(
            tap((res: any) => {
                if (res.access_token && res.refresh_token) {
                    this.tokenService.saveTokens(res.access_token, res.refresh_token);
                }
            })
        );
    }

    logout(): void {
        const refresh_token = this.tokenService.getRefreshToken();
        const access_token = this.tokenService.getAccessToken();

        if (refresh_token || access_token) {
            this.http.post(`${BASE_URL}/logout`, { refresh_token, access_token }).pipe(
                catchError(() => {
                    // even if it fails, we clear session
                    this.sessionService.clearSession();
                    return throwError(() => new Error('Logout failed on server'));
                })
            ).subscribe(() => this.sessionService.clearSession());
        } else {
            this.sessionService.clearSession();
        }
    }

    validateToken(): Observable<UserSession> {
        const token = this.tokenService.getAccessToken();
        if (!token) return throwError(() => new Error('No access token'));

        return this.http.post<UserSession>(`${BASE_URL}/validate`, { token }).pipe(
            tap((user) => {
                this.sessionService.setSession(user);
            })
        );
    }
}
