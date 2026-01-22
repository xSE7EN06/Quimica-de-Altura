import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonText, IonButton, IonSpinner, ModalController } from '@ionic/angular/standalone';
import { CameraService } from '../../../../infrastructure/services/camera.service';
import { IdentifyPlantUseCase } from '../../../../application/use-cases/identify-plant.use-case';
import { Router } from '@angular/router';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { PlantCardComponent } from '../../components/plant-card/plant-card.component';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonText, IonButton, IonSpinner, CommonModule, HeaderComponent, SearchInputComponent, PlantCardComponent],
})
export class HomePage {
    isScanning = false;

    constructor(
        private cameraService: CameraService,
        private identifyPlantUseCase: IdentifyPlantUseCase,
        private router: Router
    ) { }

    onSearch(term: string) {
        console.log('Searching for:', term);
        // Implement search logic here
    }

    onFilter() {
        console.log('Filter clicked');
        // Implement filtering logic here
    }

    viewDetail() {
        this.router.navigate(['/detail-plant']);
    }

    viewCategories() {
        this.router.navigate(['/categories']);
    }

    async scanPlant() {
        this.isScanning = true;

        // Simulating scan or using actual service
        // const imageData = await this.cameraService.takePicture(); 

        // For now, let's just log or keep the existing logic if it was working
        // Re-enabling the logic:
        try {
            // Note: Ensure CameraService is correctly implemented for the platform
            const imageData = await this.cameraService.takePicture();
            if (imageData) {
                this.identifyPlantUseCase.execute(imageData).subscribe({
                    next: (plant) => {
                        this.isScanning = false;
                        if (plant) {
                            this.router.navigate(['/result', plant.id]); // Assuming plant.id exists
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
        } catch (error) {
            console.error('Error scanning:', error);
            this.isScanning = false;
        }
    }
}
