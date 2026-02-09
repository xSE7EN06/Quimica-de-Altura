import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { MostSearchedCardComponent } from '../../components/most-searched-card/most-searched-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';

@Component({
    selector: 'app-energizers',
    templateUrl: './energizers.page.html',
    styleUrls: ['./energizers.page.scss'],
    standalone: true,
    imports: [IonContent, CommonModule, FormsModule, HeaderComponent, SearchInputComponent, MostSearchedCardComponent, IonIcon]
})
export class EnergizersPage implements OnInit {
    categoryName: string = '';
    plants: any[] = [];
    description: string = '';

    constructor(
        private route: ActivatedRoute,
        private plantRepository: PlantRepository,
        private router: Router
    ) {
        addIcons({ alertCircleOutline });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.categoryName = params.get('categoryName') || '';
            this.loadCategoryData();
        });
    }

    loadCategoryData() {
        this.description = this.getCategoryDescription(this.categoryName);
        this.plantRepository.getPlantsByCategory(this.categoryName).subscribe(plants => {
            this.plants = plants.map(plant => ({
                id: plant.id,
                name: plant.commonName,
                scientificName: plant.scientificName,
                imageUrl: plant.imageUrl,
                properties: plant.properties.map(prop => ({
                    name: prop,
                    percentage: Math.floor(Math.random() * 40) + 60
                }))
            }));
        });
    }

    getCategoryDescription(category: string): string {
        switch (category) {
            case 'Energizante':
            case 'Energizantes': return 'Plantas que ayudan a aumentar la energía y reducir la fatiga de forma natural.';
            case 'Relajante':
            case 'Relajantes': return 'Plantas que ayudan a reducir el estrés y conciliar el sueño.';
            case 'Dolor':
            case 'Dolencia': return 'Plantas con propiedades analgésicas y antiinflamatorias.';
            case 'Respiratorio':
            case 'Antibacterianas': return 'Plantas con propiedades antibacterianas y respiratorias.';
            case 'Digestivo':
            case 'Digestivas': return 'Plantas que ayudan a la digestión.';
            default: return 'Plantas medicinales de la región.';
        }
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

    viewDetail(id: string) {
        this.router.navigate(['/detail-plant', id]);
    }

}
