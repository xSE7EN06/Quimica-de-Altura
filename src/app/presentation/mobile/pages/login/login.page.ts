import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonItem, IonInput, IonLabel, IonSegment, IonSegmentButton, IonImg, IonText, ModalController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mail, lockClosed, person } from 'ionicons/icons';
import { SuccessModalComponent } from '../../components/success-modal/success-modal.component';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { isLoginChallenge } from '../../../../domain/models/auth.models';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonItem, IonInput, IonLabel, IonSegment, IonSegmentButton]
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    registerForm: FormGroup;
    segmentValue: 'login' | 'register' = 'login';
    logoUrl = 'assets/shared/images/logo.jpg';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private modalCtrl: ModalController,
        private authService: AuthService,
        private alertCtrl: AlertController
    ) {
        addIcons({ mail, lockClosed, person });
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.registerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');
        return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
    }

    ngOnInit() { }

    onSegmentChanged(event: any) {
        this.segmentValue = event.detail.value;
    }

    async onSubmit() {
        if (this.segmentValue === 'login' && this.loginForm.valid) {
            await this.handleLogin();
        } else if (this.segmentValue === 'register' && this.registerForm.valid) {
            await this.handleRegister();
        }
    }

    async handleLogin() {
        const { email, password } = this.loginForm.value;

        this.authService.login({ email, password }).subscribe({
            next: async (result) => {
                if (isLoginChallenge(result)) {
                    await this.showAlert('2FA', 'Se requiere verificación de dos factores. Usa la versión web.');
                } else {
                    await this.showSuccessModal();
                    this.router.navigate(['/home']);
                }
            },
            error: async (err) => {
                const msg = err.status === 401 ? 'Credenciales incorrectas' : 'Error de conexión';
                await this.showAlert('Error', msg);
            }
        });
    }

    async handleRegister() {
        const formValue = this.registerForm.value;

        this.authService.register({
            email: formValue.email,
            password: formValue.password,
            first_name: formValue.firstName,
            last_name: formValue.lastName,
        }).subscribe({
            next: async () => {
                await this.showSuccessModal();
                await this.showAlert('Verificación', 'Revisa tu correo para verificar tu cuenta.');
            },
            error: async (err) => {
                const msg = err.status === 409 ? 'Este correo ya está registrado' : 'No se pudo registrar';
                await this.showAlert('Error', msg);
            }
        });
    }

    async showSuccessModal() {
        const modal = await this.modalCtrl.create({
            component: SuccessModalComponent,
            cssClass: 'auto-height-modal',
            backdropDismiss: false,
            componentProps: {}
        });

        await modal.present();
        await modal.onWillDismiss();
    }

    async showAlert(header: string, message: string) {
        const alert = await this.alertCtrl.create({
            header,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }
}
