import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { isLoginChallenge } from '../../../../domain/models/auth.models';

@Component({
  selector: 'app-web-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class WebLoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;

  loading = signal(false);
  errorMessage = signal('');
  /** Show link to verify-email when login fails with 401 (e.g. unverified email) */
  showVerifyEmailLink = signal(false);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.errorMessage.set('');
    this.showVerifyEmailLink.set(false);

    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor ingresa tu correo y contraseña.');
      return;
    }

    this.loading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (result) => {
        this.loading.set(false);
        if (isLoginChallenge(result)) {
          this.router.navigate(['/two-factor'], {
            queryParams: { challenge: result.challenge_token }
          });
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        const body = err.error ?? {};
        const detail = body.detail && typeof body.detail === 'object' ? body.detail : {};
        const apiMessage = (detail.message ?? (typeof body.detail === 'string' ? body.detail : null) ?? body.message ?? '') as string;
        const msgLower = (apiMessage || '').toLowerCase();
        const hasUnverifiedCode =
          detail.code === 'email_not_verified' ||
          body.code === 'email_not_verified' ||
          /email.*verif|verif.*email|not verified|unverified|never verified|verify your email|please verify/i.test(msgLower);
        // API may return 403 (per doc) or 401 for unverified; redirect when body indicates it
        const isUnverified =
          (err.status === 403 || err.status === 401) && hasUnverifiedCode;

        if (isUnverified) {
          this.router.navigate(['/verify-email'], {
            queryParams: { email: this.email, resend: '1', ...(apiMessage && { message: apiMessage }) }
          });
          return;
        }
        if (err.status === 401) {
          this.errorMessage.set('Credenciales inválidas o correo sin verificar. Verifica tu correo y contraseña.');
          this.showVerifyEmailLink.set(true);
        } else if (err.status === 429) {
          this.errorMessage.set('Demasiados intentos. Espera un momento antes de reintentar.');
        } else {
          this.errorMessage.set('Error de conexión. Intenta de nuevo más tarde.');
        }
      }
    });
  }

  goToVerifyEmail() {
    this.router.navigate(['/verify-email'], {
      queryParams: { email: this.email || undefined, resend: '1' }
    });
  }

  loginWithGoogle() {
    this.authService.getOAuthUrl('google').subscribe({
      next: (res) => {
        sessionStorage.setItem('oauth_state', res.state);
        window.location.href = res.authorization_url;
      },
      error: () => this.errorMessage.set('No se pudo conectar con Google.')
    });
  }

  loginWithGitHub() {
    this.authService.getOAuthUrl('github').subscribe({
      next: (res) => {
        sessionStorage.setItem('oauth_state', res.state);
        window.location.href = res.authorization_url;
      },
      error: () => this.errorMessage.set('No se pudo conectar con GitHub.')
    });
  }
}
