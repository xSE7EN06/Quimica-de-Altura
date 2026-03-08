import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { validatePassword } from '../../../../domain/validators/password.validator';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './forgot-password.page.html',
  styleUrls: ['../register/register.page.scss']
})
export class ForgotPasswordPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  step = signal<'request' | 'reset'>('request');
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  showPassword = false;

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  requestReset() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.email) {
      this.errorMessage.set('Ingresa tu correo electrónico.');
      return;
    }

    this.loading.set(true);
    this.authService.requestPasswordReset({ email: this.email }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Si el correo existe, se ha enviado un código de recuperación.');
        this.step.set('reset');
      },
      error: () => {
        this.loading.set(false);
        this.successMessage.set('Si el correo existe, se ha enviado un código de recuperación.');
        this.step.set('reset');
      }
    });
  }

  resetPassword() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.code || this.code.length !== 6) {
      this.errorMessage.set('Ingresa el código de 6 dígitos.');
      return;
    }

    const passwordError = validatePassword(this.newPassword);
    if (passwordError) {
      this.errorMessage.set(passwordError);
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.loading.set(true);
    this.authService.resetPassword({
      email: this.email,
      code: this.code,
      new_password: this.newPassword,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Contraseña restablecida exitosamente. Redirigiendo...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.errorMessage.set('Código inválido o contraseña no válida.');
        } else {
          this.errorMessage.set('Error de conexión. Intenta de nuevo.');
        }
      }
    });
  }
}
