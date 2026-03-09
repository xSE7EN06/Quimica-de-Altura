import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  LoginRequest, LoginResult, LoginResponse, isLoginChallenge,
  RegisterRequest, RegisterResponse,
  RefreshRequest, LogoutRequest,
  ValidateTokenRequest, ValidateTokenResponse,
  VerifyEmailRequest, ResendVerificationRequest,
  PasswordResetRequest, PasswordResetConfirm,
  TwoFactorSetupResponse, TwoFactorVerifySetupRequest, TwoFactorVerifySetupResponse,
  TwoFactorChallengeRequest, TwoFactorEmailCodeRequest, TwoFactorDisableRequest,
  BackupCodesResponse, RegenerateBackupCodesResponse,
  Session, OAuthAuthorizeResponse,
  AuthUser, JwtPayload, ApiMessage
} from '../../domain/models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly BASE = `${environment.gatewayUrl}/api/auth/api/v1/auth`;
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';
  /** Refresh ~5 min before expiry; min 60s from now */
  private readonly REFRESH_BUFFER_SEC = 300;
  private refreshTimerId: ReturnType<typeof setTimeout> | null = null;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.loadStoredUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isAuthenticated$ = this.currentUser$.pipe(map(u => !!u));

  get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  // ─── Authentication ───────────────────────────────────────────────

  login(credentials: LoginRequest): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${this.BASE}/login`, credentials).pipe(
      tap(result => {
        if (!isLoginChallenge(result)) {
          this.storeTokens(result);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.BASE}/register`, data);
  }

  /** Validate access token; returns user_id, email, role, roles for guards and UI. */
  validateToken(): Observable<ValidateTokenResponse> {
    const token = this.accessToken;
    if (!token) {
      return throwError(() => new Error('No access token'));
    }
    return this.http.post<ValidateTokenResponse>(`${this.BASE}/validate`, { token } as ValidateTokenRequest);
  }

  refreshAccessToken(): Observable<LoginResponse> {
    const refresh_token = this.refreshToken;
    if (!refresh_token) {
      return throwError(() => new Error('No refresh token'));
    }
    return this.http.post<LoginResponse>(`${this.BASE}/refresh`, { refresh_token } as RefreshRequest).pipe(
      tap(tokens => this.storeTokens(tokens)),
      catchError(err => {
        this.clearSession();
        this.router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<void> {
    const body: LogoutRequest = {
      refresh_token: this.refreshToken || '',
      access_token: this.accessToken || undefined,
    };
    const obs = this.http.post<void>(`${this.BASE}/logout`, body).pipe(
      catchError(() => of(undefined as unknown as void))
    );
    obs.subscribe(() => {
      this.clearSession();
      this.router.navigate(['/login']);
    });
    return obs;
  }

  // ─── Email Verification ───────────────────────────────────────────

  verifyEmail(data: VerifyEmailRequest): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.BASE}/verify-email`, data);
  }

  resendVerification(data: ResendVerificationRequest): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.BASE}/resend-verification`, data);
  }

  // ─── Password Reset ───────────────────────────────────────────────

  requestPasswordReset(data: PasswordResetRequest): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.BASE}/password/reset-request`, data);
  }

  resetPassword(data: PasswordResetConfirm): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.BASE}/password/reset`, data);
  }

  // ─── Two-Factor Authentication ────────────────────────────────────

  setup2FA(user_id: string): Observable<TwoFactorSetupResponse> {
    return this.http.post<TwoFactorSetupResponse>(`${this.BASE}/2fa/setup`, { user_id });
  }

  verifySetup2FA(data: TwoFactorVerifySetupRequest): Observable<TwoFactorVerifySetupResponse> {
    return this.http.post<TwoFactorVerifySetupResponse>(`${this.BASE}/2fa/verify-setup`, data);
  }

  challenge2FA(data: TwoFactorChallengeRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE}/2fa/challenge`, data).pipe(
      tap(tokens => this.storeTokens(tokens))
    );
  }

  requestEmailCode2FA(data: TwoFactorEmailCodeRequest): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.BASE}/2fa/request-email-code`, data);
  }

  disable2FA(data: TwoFactorDisableRequest): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.BASE}/2fa/disable`, data);
  }

  getBackupCodesCount(user_id: string): Observable<BackupCodesResponse> {
    const params = new HttpParams().set('user_id', user_id);
    return this.http.get<BackupCodesResponse>(`${this.BASE}/2fa/backup-codes`, { params });
  }

  regenerateBackupCodes(user_id: string, password: string): Observable<RegenerateBackupCodesResponse> {
    const params = new HttpParams().set('user_id', user_id).set('password', password);
    return this.http.post<RegenerateBackupCodesResponse>(
      `${this.BASE}/2fa/regenerate-backup-codes`, null, { params }
    );
  }

  // ─── Sessions ─────────────────────────────────────────────────────

  listSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.BASE}/sessions/`);
  }

  revokeSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/sessions/${sessionId}`);
  }

  revokeAllSessions(): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/sessions/all`);
  }

  trustDevice(sessionId: string): Observable<void> {
    return this.http.post<void>(`${this.BASE}/sessions/devices/trust/${sessionId}`, null);
  }

  untrustDevice(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/sessions/devices/trust/${sessionId}`);
  }

  listTrustedDevices(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.BASE}/sessions/devices`);
  }

  // ─── OAuth ────────────────────────────────────────────────────────

  getOAuthUrl(provider: 'google' | 'github'): Observable<OAuthAuthorizeResponse> {
    return this.http.get<OAuthAuthorizeResponse>(`${this.BASE}/oauth/${provider}/authorize`);
  }

  handleOAuthCallback(provider: 'google' | 'github', code: string, state: string): Observable<LoginResponse> {
    const params = new HttpParams().set('code', code).set('state', state);
    return this.http.get<LoginResponse>(`${this.BASE}/oauth/${provider}/callback`, { params }).pipe(
      tap(tokens => this.storeTokens(tokens))
    );
  }

  // ─── Token & Session Helpers ──────────────────────────────────────

  storeTokens(tokens: LoginResponse): void {
    localStorage.setItem(this.ACCESS_KEY, tokens.access_token);
    localStorage.setItem(this.REFRESH_KEY, tokens.refresh_token);

    const user = this.decodeUser(tokens.access_token);
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    }

    this.scheduleRefresh(tokens.expires_in);
  }

  /** Schedule proactive refresh when ~5 min left (using expires_in from API). */
  private scheduleRefresh(expiresInSeconds: number): void {
    if (this.refreshTimerId != null) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
    const bufferSec = Math.min(this.REFRESH_BUFFER_SEC, Math.max(0, expiresInSeconds - 60));
    const delayMs = (expiresInSeconds - bufferSec) * 1000;
    if (delayMs < 1000) return;
    this.refreshTimerId = setTimeout(() => {
      this.refreshTimerId = null;
      this.refreshAccessToken().subscribe({
        error: () => { /* clearSession + redirect handled by interceptor or refresh error */ }
      });
    }, delayMs);
  }

  clearSession(): void {
    if (this.refreshTimerId != null) {
      clearTimeout(this.refreshTimerId);
      this.refreshTimerId = null;
    }
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isTokenExpired(): boolean {
    const token = this.accessToken;
    if (!token) return true;
    try {
      const payload = this.decodeJwt(token);
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private loadStoredUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private decodeUser(token: string): AuthUser | null {
    try {
      const payload = this.decodeJwt(token);
      return {
        id: payload.sub,
        email: payload.email,
        first_name: '',
        last_name: '',
        roles: payload.roles || [],
      };
    } catch {
      return null;
    }
  }

  private decodeJwt(token: string): JwtPayload {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT');
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  }
}
