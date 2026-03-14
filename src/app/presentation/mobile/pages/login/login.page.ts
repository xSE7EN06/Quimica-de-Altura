import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonItem, IonInput, IonLabel, IonSegment, IonSegmentButton, IonImg, IonText, ModalController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mail, lockClosed, person, logoGoogle, warning, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { SuccessModalComponent } from '../../components/success-modal/success-modal.component';
import { ForgotPasswordModalComponent } from '../../components/forgot-password-modal/forgot-password-modal.component';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { isLoginChallenge } from '../../../../domain/models/auth.models';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Capacitor } from '@capacitor/core';

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
    submitted = false;

    showLoginPassword = false;
    showRegisterPassword = false;
    // showConfirmPassword se elimina: el botón del ojo en registro controla ambos campos a la vez

    // Misma regex que el formulario de registro
    private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>[\]\\/+\-=~`]).*$/;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private modalCtrl: ModalController,
        private authService: AuthService,
        private alertCtrl: AlertController
    ) {
        addIcons({ mail, lockClosed, person, logoGoogle, warning, eyeOutline, eyeOffOutline });
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\[\]\\/_+\-=~`]).*$/;

        this.registerForm = this.fb.group({
            first_name: ['', [Validators.required, Validators.minLength(2)]],
            last_name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(12), Validators.pattern(this.passwordRegex)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');
        return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
    }

    ngOnInit() {
        SocialLogin.initialize({
            google: {
                webClientId: '505533022595-2dv5elq22rvmc2gi3kt0d6drh8clf9uj.apps.googleusercontent.com',
            }
        });

        // Handle navigation from other pages (like verify-email)
        this.route.queryParams.subscribe((params: Params) => {
            if (params['segment']) {
                this.segmentValue = params['segment'];
                this.loginForm.reset();
                this.registerForm.reset();
            }
        });
    }

    onSegmentChanged(event: any) {
        this.segmentValue = event.detail.value;
        this.submitted = false;
        this.showLoginPassword = false;
        this.showRegisterPassword = false;

        // Clear forms on segment change
        this.loginForm.reset();
        this.registerForm.reset();
    }

    toggleLoginPassword() { this.showLoginPassword = !this.showLoginPassword; }
    toggleRegisterPassword() { this.showRegisterPassword = !this.showRegisterPassword; }

    // ── Helpers de validación para errorText nativo de ion-input ──────────────

    getError(form: FormGroup, field: string): string {
        const ctrl = form.get(field);
        if (!ctrl?.errors) return '';
        if (ctrl.hasError('required')) {
            const msgs: Record<string, string> = {
                email: 'El correo electrónico es obligatorio.',
                password: 'La contraseña es obligatoria.',
                first_name: 'El nombre es obligatorio.',
                last_name: 'Los apellidos son obligatorios.',
                confirmPassword: 'Debes confirmar tu contraseña.'
            };
            return msgs[field] ?? 'Este campo es obligatorio.';
        }
        if (ctrl.hasError('email')) return 'Ingresa un correo electrónico válido.';
        if (ctrl.hasError('minlength')) {
            const min = ctrl.errors['minlength'].requiredLength;
            return field === 'password'
                ? `La contraseña debe tener al menos ${min} caracteres.`
                : `Mínimo ${min} caracteres.`;
        }
        if (ctrl.hasError('pattern')) return 'Debe incluir mayúscula, minúscula, número y carácter especial.';
        return '';
    }

    getConfirmPasswordError(): string {
        const ctrl = this.registerForm.get('confirmPassword');
        if (!ctrl) return '';
        if (ctrl.hasError('required')) return 'Debes confirmar tu contraseña.';
        if (this.registerForm.hasError('mismatch')) return 'Las contraseñas no coinciden.';
        return '';
    }

    isTouched(form: FormGroup, field: string): boolean {
        return (form.get(field)?.touched ?? false) || this.submitted;
    }

    isInvalid(form: FormGroup, field: string): boolean {
        const ctrl = form.get(field);
        return !!ctrl && this.isTouched(form, field) && ctrl.invalid;
    }

    isConfirmPasswordInvalid(): boolean {
        const ctrl = this.registerForm.get('confirmPassword');
        const touched = (ctrl?.touched ?? false) || this.submitted;
        return touched && (!!ctrl?.invalid || this.registerForm.hasError('mismatch'));
    }

    // ──────────────────────────────────────────────────────────────────────────

    async onForgotPassword() {
        const modal = await this.modalCtrl.create({
            component: ForgotPasswordModalComponent,
            initialBreakpoint: 0.75, // Bottom sheet effect, adjusting to take up about 75% height
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
        this.submitted = true;
        if (this.segmentValue === 'login') {
            if (this.loginForm.valid) {
                await this.handleLogin();
            }
        } else if (this.segmentValue === 'register') {
            if (this.registerForm.valid) {
                await this.handleRegister();
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
                    this.loginForm.reset();
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
                    this.loginForm.reset();
                    this.registerForm.reset();
                    this.router.navigate(['/verify-email'], { queryParams: { email } });
                } else {
                    const msg = err.status === 401 ? 'Credenciales incorrectas' : message;
                    await this.showAlert('Error', msg);
                }
            }
        });
    }

    async loginWithGoogle() {
        try {
            const googleUser = await SocialLogin.login({
                provider: 'google',
                options: {
                    scopes: ['email', 'profile']
                }
            });
            if (googleUser && googleUser.result.responseType === 'online' && googleUser.result.accessToken) {
                this.authService.verifyGoogleToken(googleUser.result.accessToken.token).subscribe({
                    next: async (res) => {
                        if (isLoginChallenge(res)) {
                            this.router.navigate(['/two-factor'], { queryParams: { token: res.challenge_token } });
                        } else {
                            await this.showSuccessModal();
                            this.router.navigate(['/home']);
                        }
                    },
                    error: async (err) => {
                        console.error('Backend err:', err);
                        let msg = 'Err: ';
                        if (err?.error?.detail) {
                            msg += typeof err.error.detail === 'string' ? err.error.detail : JSON.stringify(err.error.detail);
                        } else if (err?.error?.message) {
                            msg += err.error.message;
                        } else if (err?.message) {
                            msg += err.message;
                        } else {
                            msg += JSON.stringify(err);
                        }
                        await this.showAlert('Error Backend', msg);
                    }
                });
            } else {
                await this.showAlert('Error', 'No se recibió un token válido de Google. res: ' + JSON.stringify(googleUser));
            }
        } catch (error: any) {
            console.error('Google sign in failed', error);
            await this.showAlert('Error Plugin', 'Fallo plugin: ' + JSON.stringify(error) + ' | ' + String(error));
        }
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
                this.registerForm.reset();
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
            mode: 'ios',
            buttons: ['OK']
        });
        await alert.present();
    }
}
