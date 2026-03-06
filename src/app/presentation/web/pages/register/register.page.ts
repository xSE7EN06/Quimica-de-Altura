import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { validatePassword } from '../../../../domain/validators/password.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  register() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.errorMessage.set('Todos los campos son obligatorios.');
      return;
    }

    const passwordError = validatePassword(this.password);
    if (passwordError) {
      this.errorMessage.set(passwordError);
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }

    this.loading.set(true);

    this.authService.register({
      email: this.email,
      password: this.password,
      first_name: this.firstName,
      last_name: this.lastName,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Cuenta creada exitosamente. Revisa tu correo para verificar tu cuenta.');
        setTimeout(() => this.router.navigate(['/verify-email'], { queryParams: { email: this.email } }), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.errorMessage.set('Este correo ya está registrado.');
        } else if (err.status === 400) {
          this.errorMessage.set('Datos inválidos. Revisa los campos e intenta de nuevo.');
        } else {
          this.errorMessage.set('Error de conexión. Intenta de nuevo más tarde.');
        }
      }
    });
  }
}
