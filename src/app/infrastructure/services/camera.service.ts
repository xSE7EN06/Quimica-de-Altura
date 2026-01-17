import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
    providedIn: 'root'
})
export class CameraService {
    async takePicture(): Promise<string | undefined> {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera,
                promptLabelHeader: 'Escanear Planta',
                promptLabelPhoto: 'Desde Galería',
                promptLabelPicture: 'Tomar Foto'
            });

            if (image.base64String) {
                return `data:image/jpeg;base64,${image.base64String}`;
            }
            return undefined;
        } catch (e) {
            // User cancelled or error
            return undefined;
        }
    }
}
