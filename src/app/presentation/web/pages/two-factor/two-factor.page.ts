import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../infrastructure/services/auth.service';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './two-factor.page.html',
  styleUrls: ['../register/register.page.scss']
})
export class TwoFactorPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  challengeToken = '';
  code = '';
  loading = signal(false);
  sendingEmail = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit() {
    this.challengeToken = this.route.snapshot.queryParams['challenge'] || '';
    if (!this.challengeToken) {
      this.router.navigate(['/login']);
    }
  }

  verify() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.code || this.code.length < 6) {
      this.errorMessage.set('Ingresa el código de verificación.');
      return;
    }

    this.loading.set(true);
    this.authService.challenge2FA({
      challenge_token: this.challengeToken,
      code: this.code,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400 || err.status === 401) {
          this.errorMessage.set('Código inválido. Intenta de nuevo.');
        } else {
          this.errorMessage.set('Error de conexión. Intenta de nuevo.');
        }
      }
    });
  }

  requestEmailCode() {
    this.sendingEmail.set(true);
    this.errorMessage.set('');
    this.authService.requestEmailCode2FA({ challenge_token: this.challengeToken }).subscribe({
      next: () => {
        this.sendingEmail.set(false);
        this.successMessage.set('Se ha enviado un código a tu correo electrónico.');
      },
      error: () => {
        this.sendingEmail.set(false);
        this.errorMessage.set('No se pudo enviar el código por correo.');
      }
    });
  }
}
