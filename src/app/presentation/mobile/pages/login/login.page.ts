import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonItem, IonInput, IonLabel, IonSegment, IonSegmentButton, IonImg, IonText, ModalController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mail, lockClosed, person } from 'ionicons/icons';
import { SuccessModalComponent } from '../../components/success-modal/success-modal.component';
import { ForgotPasswordModalComponent } from '../../components/forgot-password-modal/forgot-password-modal.component';
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
            password: ['', [Validators.required, Validators.minLength(8)]]
        });

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\[\]\\/_+\-=~`]).*$/;

        this.registerForm = this.fb.group({
            first_name: ['', [Validators.required, Validators.minLength(2)]],
            last_name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(12), Validators.pattern(passwordRegex)]],
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

    async onForgotPassword() {
        const modal = await this.modalCtrl.create({
            component: ForgotPasswordModalComponent,
            initialBreakpoint: 0.50, // Bottom sheet effect, adjusting to take up about 75% height
            breakpoints: [0, 0.75, 1], // Allowed snap points
            backdropDismiss: true
        });

        await modal.present();

        const { data } = await modal.onWillDismiss();

        // Optionally handle data if needed, like showing a success toast, etc
        if (data?.success) {
            console.log('Password reset successfully');
        }
    }

    async onSubmit() {
        if (this.segmentValue === 'login') {
            if (this.loginForm.valid) {
                await this.handleLogin();
            } else {
                await this.showAlert('Datos incompletos', 'Asegúrate de ingresar un correo electrónico válido y una contraseña de al menos 8 caracteres sin espacios.');
            }
        } else if (this.segmentValue === 'register') {
            if (this.registerForm.valid) {
                await this.handleRegister();
            } else {
                await this.showAlert('Contraseña o datos inválidos', 'Por favor, llena todos los campos correctamente. Tu contraseña debe tener al menos 12 caracteres, incluir una mayúscula, una minúscula, un número, un carácter especial y ambas contraseñas deben coincidir.');
            }
        }
    }

    async handleLogin() {
        const { email, password } = this.loginForm.value;

        this.authService.login({ email, password }).subscribe({
            next: async (res) => {
                if (isLoginChallenge(res)) {
                    this.router.navigate(['/two-factor'], { queryParams: { token: res.challenge_token } });
                } else {
                    await this.showSuccessModal();
                    this.router.navigate(['/home']);
                }
            },
            error: async (err) => {
                const detail = err.error?.detail;
                const message = typeof detail === 'string' ? detail : (detail?.message || err.error?.message || 'Credenciales incorrectas');
                const code = detail?.code;

                if (code === 'locked' || err.error?.locked) {
                    await this.showAlert('Cuenta Bloqueada', 'Demasiados intentos. Tu cuenta ha sido bloqueada temporalmente.');
                } else if (code === 'banned' || err.error?.banned) {
                    await this.showAlert('Cuenta Suspendida', 'Tu cuenta ha sido baneada.');
                } else if (code === 'email_not_verified' || err.error?.email_not_verified) {
                    this.router.navigate(['/verify-email'], { queryParams: { email } });
                } else {
                    const msg = err.status === 401 ? 'Credenciales incorrectas' : message;
                    await this.showAlert('Error', msg);
                }
            }
        });
    }

    async handleRegister() {
        const formValue = this.registerForm.value;
        const newUser = {
            first_name: formValue.first_name,
            last_name: formValue.last_name,
            email: formValue.email,
            password: formValue.password
        };

        this.authService.register(newUser).subscribe({
            next: async (res) => {
                await this.showAlert('Registro exitoso', 'Por favor verifica tu correo para continuar.');
                this.router.navigate(['/verify-email'], { queryParams: { email: newUser.email } });
            },
            error: async (err) => {
                const msg = err.status === 409 ? 'Este correo ya está registrado' : (err.error?.message || 'No se pudo registrar');
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
