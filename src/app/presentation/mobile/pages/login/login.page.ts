import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonItem, IonInput, IonLabel, IonSegment, IonSegmentButton, IonImg, IonText, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mail, lockClosed } from 'ionicons/icons';
import { SuccessModalComponent } from '../../components/success-modal/success-modal.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonItem, IonInput, IonLabel, IonSegment, IonSegmentButton, IonImg, IonText]
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    segmentValue: 'login' | 'register' = 'login';
    logoUrl = 'assets/icon/logo-placeholder.png'; // We'll need to figure out the logo or use a placeholder

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private modalCtrl: ModalController
    ) {
        addIcons({ mail, lockClosed });
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit() { }

    onSegmentChanged(event: any) {
        this.segmentValue = event.detail.value;
    }

    async onSubmit() {
        if (this.loginForm.valid) {
            // Show success modal as requested by user
            const modal = await this.modalCtrl.create({
                component: SuccessModalComponent,
                cssClass: 'auto-height-modal', // We might need to add this globally or handle sizing in component
                backdropDismiss: false,
                componentProps: {}
            });

            await modal.present();

            // Wait for the modal to be dismissed before navigating
            await modal.onWillDismiss();

            this.router.navigate(['/home']);
        }
    }
}
