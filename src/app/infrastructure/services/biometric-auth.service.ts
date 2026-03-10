import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NativeBiometric, BiometricOptions } from 'capacitor-native-biometric';
import { Platform } from '@ionic/angular/standalone';

@Injectable({
    providedIn: 'root'
})
export class BiometricAuthService {
    private router = inject(Router);
    private platform = inject(Platform);
    private readonly ACCESS_KEY = 'access_token';

    constructor() { }

    /**
     * Verifica si el dispositivo soporta biometría y si hay credenciales configuradas.
     */
    async isBiometricAvailable(): Promise<boolean> {
        // Si no es un dispositivo móvil (ej. web), a menudo no hay biometría nativa vía este plugin
        if (!this.platform.is('capacitor')) {
            return false;
        }

        try {
            const result = await NativeBiometric.isAvailable();
            return result.isAvailable;
        } catch (error) {
            console.error('Error al verificar disponibilidad biométrica', error);
            return false;
        }
    }

    /**
     * Intenta la autenticación biométrica y maneja la navegación según el resultado.
     */
    async performBiometricAuth(): Promise<boolean> {
        const isAvailable = await this.isBiometricAvailable();

        if (!isAvailable) {
            console.warn('Biometría no disponible o no configurada en este dispositivo.');
            return false; // Fallback normal al login
        }

        const options: BiometricOptions = {
            title: 'Desbloquear aplicación',
            subtitle: 'Autenticación requerida',
            reason: 'Use your fingerprint to unlock the app',
            maxAttempts: 3,
            useFallback: true, // Permite usar PIN o patrón
        };

        try {
            await NativeBiometric.verifyIdentity(options);
            // Biometría exitosa
            return true;
        } catch (error) {
            console.error('Fallo en autenticación biométrica', error);
            // Si falla o el usuario cancela, no hacemos nada extra, solo devolvemos falso
            return false;
        }
    }

    /**
     * Lógica al inicializar la aplicación.
     * Si ya hay un token (y el dispositivo soporta biometría), pediremos la huella.
     * Solo al momento de abrir la app.
     */
    async checkBiometricsOnStartup(): Promise<void> {
        const token = localStorage.getItem(this.ACCESS_KEY);

        if (token) {
            const isAvailable = await this.isBiometricAvailable();
            if (isAvailable) {
                const success = await this.performBiometricAuth();
                if (success) {
                    // Exitoso -> Redirige a Home
                    this.router.navigate(['/home']);
                } else {
                    // Falló o se canceló -> Vamos a Login a que inicie manual
                    this.router.navigate(['/login']);
                }
            } else {
                // Tiene token pero no hay biometría. Se va a Home directamente (o según la lógica normal).
                this.router.navigate(['/home']);
            }
        } else {
            // No hay token, vamos al login
            this.router.navigate(['/login']);
        }
    }
}
