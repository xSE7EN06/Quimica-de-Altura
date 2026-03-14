import { Component, OnInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonSpinner, ToastController, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosed, checkmark, close as closeIcon } from 'ionicons/icons';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrl: './verify-email.page.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonButton, IonIcon, IonSpinner, IonModal]
})
export class VerifyEmailPage implements OnInit {
  verifyForm: FormGroup;
  email: string = '';
  isLoading: boolean = false;
  isModalOpen: boolean = false;
  modalStatus: 'success' | 'error' = 'success';
  modalTitle: string = '';
  modalMessage: string = '';
  otpControls: string[] = ['digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6']; // 6 digits

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  goToLogin() {
    this.isModalOpen = false;
    if (this.modalStatus === 'success') {
      this.router.navigate(['/login'], { queryParams: { segment: 'login' } });
    }
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ lockClosed, checkmark, close: closeIcon });

    const formGroupConfig: any = {};
    this.otpControls.forEach(control => {
      formGroupConfig[control] = ['', [Validators.required, Validators.maxLength(1)]];
    });
    this.verifyForm = this.fb.group(formGroupConfig);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  onInputChange(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Auto advance focus
    if (value && value.length === 1 && index < this.otpControls.length - 1) {
      setTimeout(() => {
        const nextInput = this.otpInputs.toArray()[index + 1].nativeElement;
        nextInput.focus();
      }, 10);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    // Delete and go back
    if (event.key === 'Backspace' && index > 0) {
      const controlName = this.otpControls[index];
      if (!this.verifyForm.get(controlName)?.value) {
        setTimeout(() => {
          const prevInput = this.otpInputs.toArray()[index - 1].nativeElement;
          prevInput.focus();
        }, 10);
      }
    }
  }

  async verify() {
    if (this.verifyForm.valid) {
      this.isLoading = true;
      this.cdr.detectChanges(); // Fix ExpressionChanged error

      // Concatenate the 6 digits to form the code
      const code = this.otpControls.map(c => this.verifyForm.get(c)?.value).join('');

      this.authService.verifyEmail({ email: this.email, code }).pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      ).subscribe({
        next: async () => {
          this.modalStatus = 'success';
          this.modalTitle = '¡Correo Verificado!';
          this.modalMessage = 'Tu cuenta ha sido verificada correctamente. Ahora puedes disfrutar de nuestros servicios.';
          this.isModalOpen = true;
          this.cdr.detectChanges();
        },
        error: async (err) => {
          const detail = err.error?.detail;
          const message = typeof detail === 'string' ? detail : (err.error?.message || 'Código inválido o ha expirado');
          
          this.modalStatus = 'error';
          this.modalTitle = 'Error de Verificación';
          this.modalMessage = message;
          this.isModalOpen = true;

          // Clear inputs on error
          this.verifyForm.reset();
          if (this.otpInputs && this.otpInputs.length > 0) {
            this.otpInputs.first.nativeElement.focus();
          }
          this.cdr.detectChanges();
        }
      });
    }
  }

  resendCode() {
    this.authService.resendVerification({ email: this.email }).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Código reenviado',
          duration: 2000,
          color: 'dark'
        });
        toast.present();
      },
      error: async (err) => {
        const detail = err.error?.detail;
        const message = typeof detail === 'string' ? detail : (err.error?.message || 'No se pudo reenviar el código');

        const toast = await this.toastCtrl.create({
          message: message,
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
