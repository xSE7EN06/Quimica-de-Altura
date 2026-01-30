import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon, ModalController, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark } from 'ionicons/icons';

@Component({
    selector: 'app-success-modal',
    standalone: true,
    imports: [CommonModule, IonContent, IonButton, IonIcon, IonText],
    template: `
    <div class="modal-content">
      <div class="icon-circle">
        <ion-icon name="checkmark"></ion-icon>
      </div>

      <h2 class="title">Yeay! Bienvenido de nuevo</h2>
      
      <p class="subtitle">
        Una vez más has iniciado sesión correctamente en MontañasAltas
      </p>

      <ion-button expand="block" shape="round" class="action-btn" (click)="dismiss()" mode="ios">
        Ir a inicio
      </ion-button>
    </div>
  `,
    styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      --background: transparent;
    }

    .modal-content {
      background: white;
      border-radius: 40px;
      padding: 40px 30px;
      text-align: center;
      width: 90%;
      max-width: 350px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    .icon-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #f4f8f4; /* Very light green */
      display: flex;
      align-items: center;
      justify-content: center;
      border: 6px solid #5d7554; /* Olive green based on previous files */
      margin-bottom: 25px;

      ion-icon {
        font-size: 50px;
        color: #5d7554;
        --ionicon-stroke-width: 40px;
      }
    }

    .title {
      color: #5d7554;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 15px;
      line-height: 1.3;
    }

    .subtitle {
      color: #666;
      font-size: 15px;
      margin-bottom: 35px;
      line-height: 1.5;
    }

    .action-btn {
      --background: #5d7554;
      --color: white;
      width: 100%;
      height: 50px;
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      --box-shadow: none;
    }
  `]
})
export class SuccessModalComponent {

    constructor(private modalCtrl: ModalController) {
        addIcons({ checkmark });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
