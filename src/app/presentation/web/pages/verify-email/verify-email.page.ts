import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../infrastructure/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './verify-email.page.html',
  styleUrls: ['../register/register.page.scss']
})
export class VerifyEmailPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  code = '';
  loading = signal(false);
  resending = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  /** True when user was sent here from login because email was not verified */
  fromUnverifiedLogin = signal(false);
  /** Message from API when redirected from login (e.g. "Verify your email to sign in...") */
  apiMessage = signal('');

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    this.email = params['email'] || '';
    this.fromUnverifiedLogin.set(params['resend'] === '1');
    this.apiMessage.set(params['message'] || '');
  }

  verify() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.email || !this.code || this.code.length !== 6) {
      this.errorMessage.set('Ingresa tu correo y el código de 6 dígitos.');
      return;
    }

    this.loading.set(true);

    this.authService.verifyEmail({ email: this.email, code: this.code }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Correo verificado exitosamente. Redirigiendo al login...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.errorMessage.set('Código inválido o expirado. Intenta de nuevo.');
        } else if (err.status === 404) {
          this.errorMessage.set('Usuario no encontrado.');
        } else {
          this.errorMessage.set('Error de conexión. Intenta de nuevo.');
        }
      }
    });
  }

  resendCode() {
    if (!this.email) {
      this.errorMessage.set('Ingresa tu correo electrónico.');
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.resending.set(true);
    this.authService.resendVerification({ email: this.email }).subscribe({
      next: () => {
        this.resending.set(false);
        this.successMessage.set('Se ha enviado un nuevo código a tu correo.');
      },
      error: (err) => {
        this.resending.set(false);
        const msg = err.error?.detail ?? err.error?.message;
        this.errorMessage.set(
          typeof msg === 'string' ? msg : 'No se pudo reenviar el código. Intenta de nuevo.'
        );
      }
    });
  }
}
