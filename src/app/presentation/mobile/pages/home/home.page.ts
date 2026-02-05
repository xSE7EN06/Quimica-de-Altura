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

    viewEnergizers() {
        this.router.navigate(['/energizers']);
    }

    viewCategories() {
        this.router.navigate(['/categories']);
    }

    viewMostSearchedPlants() {
        this.router.navigate(['/most-searched-plants']);
    }

    scanPlant() {
        this.router.navigate(['/scan']);
    }
}
