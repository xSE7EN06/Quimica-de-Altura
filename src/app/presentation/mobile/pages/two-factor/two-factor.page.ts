import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonItem, IonInput, IonLabel, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../../../infrastructure/services/auth.service';

@Component({
    selector: 'app-two-factor',
    template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Autenticación 2FA</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="ion-text-center ion-margin-bottom">
        <h2>Ingresa tu código</h2>
        <p>Abre tu aplicación de autenticación para obtener el código.</p>
      </div>

      <form [formGroup]="twoFactorForm" (ngSubmit)="verify()">
        <ion-item>
          <ion-label position="floating">Código 2FA</ion-label>
          <ion-input type="text" formControlName="code" maxlength="6"></ion-input>
        </ion-item>

        <ion-button expand="block" type="submit" [disabled]="!twoFactorForm.valid" class="ion-margin-top">
          Validar Código
        </ion-button>
        <ion-button expand="block" fill="clear" (click)="cancel()">
          Cancelar
        </ion-button>
      </form>
    </ion-content>
  `,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonItem, IonInput, IonLabel]
})
export class TwoFactorPage implements OnInit {
    twoFactorForm: FormGroup;
    challenge_token: string = '';

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private toastCtrl: ToastController
    ) {
        this.twoFactorForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
        });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.challenge_token = params['token'];
            if (!this.challenge_token) {
                this.router.navigate(['/login']);
            }
        });
    }

    verify() {
        if (this.twoFactorForm.valid) {
            const code = this.twoFactorForm.value.code;
            this.authService.twoFactorChallenge(this.challenge_token, code).subscribe({
                next: async () => {
                    const toast = await this.toastCtrl.create({ message: 'Autenticación exitosa', duration: 2000, color: 'success' });
                    toast.present();
                    this.router.navigate(['/home']);
                },
                error: async (err) => {
                    const toast = await this.toastCtrl.create({ message: err.error?.message || 'Código inválido', duration: 2000, color: 'danger' });
                    toast.present();
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['/login']);
    }
}
