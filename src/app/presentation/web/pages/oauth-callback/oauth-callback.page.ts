import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../infrastructure/services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="callback-wrapper">
      @if (loading()) {
        <mat-spinner diameter="48"></mat-spinner>
        <p>Completando autenticación...</p>
      }
      @if (errorMessage()) {
        <div class="callback-error">
          <mat-icon>error_outline</mat-icon>
          <p>{{ errorMessage() }}</p>
          <button (click)="goToLogin()">Volver al Login</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .callback-wrapper {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      height: 100vh; gap: 20px; font-family: 'Outfit', sans-serif;
      p { color: #597a4d; font-size: 1.1rem; font-weight: 600; }
    }
    .callback-error {
      text-align: center;
      mat-icon { font-size: 48px; width: 48px; height: 48px; color: #d32f2f; }
      p { color: #b71c1c; margin: 12px 0 20px; }
      button {
        padding: 12px 28px; background: #cba052; color: white; border: none;
        border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 0.95rem;
        &:hover { opacity: 0.9; }
      }
    }
  `]
})
export class OAuthCallbackPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    const code = this.route.snapshot.queryParams['code'];
    const state = this.route.snapshot.queryParams['state'];
    const provider = this.route.snapshot.params['provider'] as 'google' | 'github';

    if (!code || !provider) {
      this.loading.set(false);
      this.errorMessage.set('Parámetros de autenticación inválidos.');
      return;
    }

    this.authService.handleOAuthCallback(provider, code, state || '').subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Error al completar la autenticación. Intenta de nuevo.');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
