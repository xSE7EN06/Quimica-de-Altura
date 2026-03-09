import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
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

    otpControls: string[] = ['digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6']; // 6 digits
    @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

    private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>\[\]\\/_+\-=~`]).*$/;

    constructor(
        private fb: FormBuilder,
        private modalCtrl: ModalController,
        private authService: AuthService,
        private alertCtrl: AlertController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ mail, lockClosed, keyOutline, closeOutline, eyeOutline, eyeOffOutline });

        this.requestForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });

        const resetFormConfig: any = {
            new_password: ['', [Validators.required, Validators.minLength(12), Validators.pattern(this.passwordRegex)]],
            confirm_password: ['', [Validators.required]]
        };
        this.otpControls.forEach(control => {
            resetFormConfig[control] = ['', [Validators.required, Validators.maxLength(1)]];
        });

        this.resetForm = this.fb.group(resetFormConfig, { validators: this.passwordMatchValidator });
    }

    ngOnInit() { }

    onInputChange(event: any, index: number) {
        const input = event.target;
        const value = input.value;
        if (value && value.length === 1 && index < this.otpControls.length - 1) {
            setTimeout(() => {
                const nextInput = this.otpInputs.toArray()[index + 1].nativeElement;
                nextInput.focus();
            }, 10);
        }
    }

    onKeyDown(event: KeyboardEvent, index: number) {
        if (event.key === 'Backspace' && index > 0) {
            const controlName = this.otpControls[index];
            if (!this.resetForm.get(controlName)?.value) {
                setTimeout(() => {
                    const prevInput = this.otpInputs.toArray()[index - 1].nativeElement;
                    prevInput.focus();
                }, 10);
            }
        }
    }

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
        this.cdr.detectChanges();

        const email = this.requestForm.value.email;

        this.authService.requestPasswordReset({ email }).subscribe({
            next: async (res) => {
                this.isLoading = false;
                this.step = 'reset';
                this.cdr.detectChanges();
                await this.showAlert('Código Enviado', 'Si el correo existe, se ha enviado un código de recuperación.');
            },
            error: async (err) => {
                this.isLoading = false;
                this.cdr.detectChanges();

                const detail = err.error?.detail;
                const msg = typeof detail === 'string' ? detail : (err.error?.message || 'No se pudo conectar con el servidor.');

                if (err.status === 429) {
                    await this.showAlert('Demasiados intentos', 'Por favor intenta más tarde.');
                } else if (err.status === 400 || err.status === 404) {
                    await this.showAlert('Error', msg);
                } else {
                    await this.showAlert('Error de red', msg);
                }
            }
        });
    }

    onResetSubmit() {
        if (this.resetForm.invalid) return;

        this.isLoading = true;
        this.cdr.detectChanges();

        const email = this.requestForm.value.email;
        const code = this.otpControls.map(c => this.resetForm.get(c)?.value).join('');
        const new_password = this.resetForm.value.new_password;

        this.authService.resetPassword({ email, code, new_password }).subscribe({
            next: async () => {
                this.isLoading = false;
                this.cdr.detectChanges();
                await this.showAlert('¡Éxito!', 'Contraseña actualizada correctamente.');
                this.dismiss({ success: true });
            },
            error: async (err) => {
                this.isLoading = false;
                this.cdr.detectChanges();

                const detail = err.error?.detail;
                const msg = typeof detail === 'string' ? detail : (err.error?.message || 'No se pudo restablecer la contraseña.');

                await this.showAlert('Error', msg);
            }
        });
    }

    resendCode() {
        this.onRequestSubmit();
    }
}
