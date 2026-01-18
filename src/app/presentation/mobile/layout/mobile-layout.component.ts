import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonMenuToggle, IonAvatar, IonIcon, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, chatbubblesOutline, flowerOutline, cameraOutline, personCircleOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonMenuToggle, IonAvatar, IonIcon, IonImg],
  template: `
    <ion-app>
      <ion-menu side="end" menuId="mobile-menu" contentId="main-content">
        <ion-content>
          <div class="menu-header">
             <div class="profile-section">
                <ion-avatar class="user-avatar">
                   <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt="Avatar" />
                </ion-avatar>
                <div class="user-info">
                   <h3>Silvia Juarez</h3>
                   <p>Fortín, Veracruz</p>
                </div>
             </div>
          </div>

          <ion-list lines="none" class="menu-items">
            <ion-menu-toggle auto-hide="false">
              
              <ion-item button detail="false" routerLink="/home" class="menu-item">
                <ion-icon slot="start" name="home-outline"></ion-icon>
                <ion-label>Inicio</ion-label>
              </ion-item>

              <ion-item button detail="false" class="menu-item">
                <ion-icon slot="start" name="chatbubbles-outline"></ion-icon>
                <ion-label>Chat con Yolotl</ion-label>
              </ion-item>

              <ion-item button detail="false" class="menu-item">
                <ion-icon slot="start" name="flower-outline"></ion-icon>
                <ion-label>Categorías</ion-label>
              </ion-item>

              <ion-item button detail="false" class="menu-item">
                <ion-icon slot="start" name="camera-outline"></ion-icon>
                <ion-label>Buscar planta por foto</ion-label>
              </ion-item>

              <ion-item button detail="false" class="menu-item">
                <ion-icon slot="start" name="person-circle-outline"></ion-icon>
                <ion-label>Cuenta</ion-label>
              </ion-item>

              <div class="separator"></div>

              <ion-item button detail="false" routerLink="/login" class="menu-item logout">
                <ion-icon slot="start" name="log-out-outline"></ion-icon>
                <ion-label>Cerrar sesión</ion-label>
              </ion-item>

            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-app>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    
    .menu-header {
      background-color: rgba(94, 121, 75, 1); /* #5E794B */
      padding: 60px 20px 40px; /* Extra top padding for status bar area */
      border-bottom-right-radius: 0; 
    }

    .profile-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-avatar {
      width: 60px;
      height: 60px;
      border: 2px solid rgba(255,255,255,0.2);
    }

    .user-info h3 {
      color: white;
      margin: 0 0 5px;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .user-info p {
      color: rgba(255,255,255,0.8);
      margin: 0;
      font-size: 0.9rem;
    }

    .menu-items {
      padding-top: 20px;
    }

    .menu-item {
      --color: #333;
      --min-height: 55px;
      margin-bottom: 5px;
      
      ion-icon {
        color: #5E794B;
        margin-inline-end: 20px;
        font-size: 1.4rem;
      }

      ion-label {
        font-weight: 500;
        font-size: 1rem;
        color: #4a5545;
      }
    }

    .separator {
      height: 1px;
      background: #e0e0e0;
      margin: 15px 20px;
    }

    .logout ion-icon, .logout ion-label {
      color: #7a8a75;
    }
  `]
})
export class MobileLayoutComponent {
  constructor() {
    addIcons({ homeOutline, chatbubblesOutline, flowerOutline, cameraOutline, personCircleOutline, logOutOutline });
  }
}
