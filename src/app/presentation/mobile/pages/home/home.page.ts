import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { IonContent } from '@ionic/angular/standalone';
import { CameraService } from '../../../../infrastructure/services/camera.service';
import { IdentifyPlantUseCase } from '../../../../application/use-cases/identify-plant.use-case';
import { Router } from '@angular/router';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { PlantCardComponent } from '../../components/plant-card/plant-card.component';

import { Plant } from '../../../../domain/models/plant.entity';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonContent, CommonModule, HeaderComponent, SearchInputComponent, PlantCardComponent],
})
export class HomePage {
    isScanning = false;
    plants: Plant[] = [];

    isSearching: boolean = false;

    constructor(
        private cameraService: CameraService,
        private identifyPlantUseCase: IdentifyPlantUseCase,
        private router: Router,
        private plantRepository: PlantRepository
    ) { }

    ngOnInit() {
        this.plantRepository.getPlants().subscribe(plants => {
            this.plants = plants;
        });
    }

    onSearch(term: string) {
        if (term) {
            this.isSearching = true;
            this.plantRepository.searchPlants(term).subscribe(results => {
                this.plants = results;
            });
        } else {
            this.isSearching = false;
            this.plantRepository.getPlants().subscribe(plants => {
                this.plants = plants;
            });
        }
    }

    onFilter() {
        console.log('Filter clicked');
        // Implement filtering logic here
    }

    viewDetail(id: string = '1') {
        this.router.navigate(['/detail-plant', id]);
    }

    viewCategory(category: string) {
        this.router.navigate(['/category-detail', category]);
    }

    viewEnergizers() {
        this.viewCategory('Energizante');
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
