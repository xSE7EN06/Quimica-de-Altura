import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
    selector: 'app-mobile-layout',
    standalone: true,
    imports: [IonApp, IonRouterOutlet],
    template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
    styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class MobileLayoutComponent { }
