import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { MostSearchedCardComponent } from '../../components/most-searched-card/most-searched-card.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';

@Component({
    selector: 'app-most-searched-plants',
    templateUrl: './most-searched-plants.page.html',
    styleUrls: ['./most-searched-plants.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, HeaderComponent, MostSearchedCardComponent, SearchInputComponent]
})
export class MostSearchedPlantsPage {

    plants: any[] = [];

    constructor(
        private plantRepository: PlantRepository,
        private router: Router
    ) { }

    ngOnInit() {
        this.plantRepository.getPlants().subscribe(plants => {
            this.plants = plants.map(plant => ({
                id: plant.id,
                name: plant.commonName,
                scientificName: plant.scientificName,
                imageUrl: plant.imageUrl,
                properties: plant.properties.map(prop => ({
                    name: prop,
                    percentage: Math.floor(Math.random() * 40) + 60 // Random percentage between 60 and 100
                }))
            }));
        });
    }

    viewDetail(id: string) {
        this.router.navigate(['/detail-plant', id]);
    }

    onSearch(term: string) {
        console.log('Search:', term);
    }

    onFilter() {
        console.log('Filter');
    }

    scanPlant() {
        console.log('Scan Plant');
    }

}
