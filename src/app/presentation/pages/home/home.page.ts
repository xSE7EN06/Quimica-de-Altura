import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonFab, IonFabButton, IonImg, IonSpinner, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scan, leaf } from 'ionicons/icons';
import { CameraService } from '../../../infrastructure/services/camera.service';
import { IdentifyPlantUseCase } from '../../../application/use-cases/identify-plant.use-case';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, HeaderComponent, IonTitle, IonToolbar, IonButton, IonIcon, IonFab, IonFabButton, IonImg, IonSpinner, IonText]
})
export class HomePage {
    isScanning = false;

    constructor(
        private cameraService: CameraService,
        private identifyPlantUseCase: IdentifyPlantUseCase,
        private router: Router
    ) {
        addIcons({ scan, leaf });
    }

    async scanPlant() {
        this.isScanning = true;
        const imageData = await this.cameraService.takePicture();

        if (imageData) {
            this.identifyPlantUseCase.execute(imageData).subscribe({
                next: (plant) => {
                    this.isScanning = false;
                    if (plant) {
                        this.router.navigate(['/result', plant.id]);
                    }
                },
                error: (err) => {
                    this.isScanning = false;
                    console.error(err);
                }
            });
        } else {
            this.isScanning = false;
        }
    }
}
