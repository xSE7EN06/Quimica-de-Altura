import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, IonItem, IonInput, ModalController, IonSpinner, AlertController, IonHeader, IonToolbar, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mail, lockClosed, keyOutline, closeOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { AuthService } from '../../../../infrastructure/services/auth.service';

@Component({
    selector: 'app-forgot-password-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, IonContent, IonButton, IonIcon, IonItem, IonInput, IonSpinner, IonHeader, IonToolbar, IonButtons],
    templateUrl: './forgot-password-modal.component.html',
    styleUrls: ['./forgot-password-modal.component.scss']
})
export class ForgotPasswordModalComponent implements OnInit {
    step: 'request' | 'reset' = 'request';
    isLoading = false;
    showPassword = false;

    requestForm!: FormGroup;
    resetForm!: FormGroup;

    private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\[\]\\/_+\-=~`]).*$/;

    constructor(
        private fb: FormBuilder,
        private modalCtrl: ModalController,
        private authService: AuthService,
        private alertCtrl: AlertController
    ) {
        addIcons({ mail, lockClosed, keyOutline, closeOutline, eyeOutline, eyeOffOutline });

        this.requestForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.resetForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
            new_password: ['', [Validators.required, Validators.minLength(12), Validators.pattern(this.passwordRegex)]],
            confirm_password: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit() { }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('new_password');
        const confirmPassword = form.get('confirm_password');
        return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
    }

    dismiss(data?: any) {
        this.modalCtrl.dismiss(data);
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    async showAlert(header: string, message: string) {
        const alert = await this.alertCtrl.create({
            header,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }

    onRequestSubmit() {
        if (this.requestForm.invalid) return;

        this.isLoading = true;
        const email = this.requestForm.value.email;

        this.authService.requestPasswordReset({ email }).subscribe({
            next: async (res) => {
                this.isLoading = false;
                await this.showAlert('Código Enviado', 'Si el correo existe, se ha enviado un código de recuperación.');
                this.step = 'reset';
            },
            error: async (err) => {
                this.isLoading = false;
                if (err.status === 429) {
                    await this.showAlert('Demasiados intentos', 'Por favor intenta más tarde.');
                } else if (err.status === 400) {
                    await this.showAlert('Error', 'Por favor verifica la información.');
                } else {
                    await this.showAlert('Error de red', 'No se pudo conectar con el servidor.');
                }
            }
        });
    }

    onResetSubmit() {
        if (this.resetForm.invalid) return;

        this.isLoading = true;
        const email = this.requestForm.value.email;
        const code = this.resetForm.value.code;
        const new_password = this.resetForm.value.new_password;

        this.authService.resetPassword({ email, code, new_password }).subscribe({
            next: async () => {
                this.isLoading = false;
                await this.showAlert('¡Éxito!', 'Contraseña actualizada correctamente.');
                this.dismiss({ success: true });
            },
            error: async (err) => {
                this.isLoading = false;
                if (err.status === 400 || err.status === 403) {
                    await this.showAlert('Error', 'Código inválido o expirado. Por favor, intenta de nuevo.');
                } else {
                    await this.showAlert('Error', 'No se pudo restablecer la contraseña. Revisa tus datos e intenta nuevamente.');
                }
            }
        });
    }

    resendCode() {
        this.onRequestSubmit();
    }
}
