import { Injectable } from '@angular/core';
import { PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular/standalone';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationService {
    constructor(private platform: Platform) { }

    async initPushNotifications() {
        if (this.platform.is('capacitor')) {
            this.registerNotifications();
        }
    }

    private async registerNotifications() {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            throw new Error('User denied permissions!');
        }

        await PushNotifications.register();

        PushNotifications.addListener('registration', (token: Token) => {
            console.log('Push registration success, token: ' + token.value);
        });

        PushNotifications.addListener('registrationError', (error: any) => {
            console.error('Error on registration: ' + JSON.stringify(error));
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push received: ' + JSON.stringify(notification));
            // Notify about login, locked account, expired session, etc.
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
            console.log('Push action performed: ' + JSON.stringify(notification));
        });
    }
}
