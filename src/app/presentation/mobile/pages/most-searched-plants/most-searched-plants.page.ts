import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { MostSearchedCardComponent } from '../../components/most-searched-card/most-searched-card.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';

@Component({
    selector: 'app-most-searched-plants',
    templateUrl: './most-searched-plants.page.html',
    styleUrls: ['./most-searched-plants.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, HeaderComponent, MostSearchedCardComponent, SearchInputComponent]
})
export class MostSearchedPlantsPage {

    plants = [
        {
            name: 'Árnica mexicana',
            scientificName: 'Heterotheca inuloides',
            imageUrl: 'https://cdn.britannica.com/28/140628-050-169547E0/Arnica.jpg',
            properties: [
                { name: 'Antiinflamatorio', percentage: 85 },
                { name: 'Analgésico', percentage: 70 },
                { name: 'Cicatrizante', percentage: 60 }
            ]
        },
        {
            name: 'Epazote',
            scientificName: 'Dysphania ambrosioides',
            imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.Wxoj0W_PTJDFZ6FwcK0PUwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
            properties: [
                { name: 'Antiparasitario', percentage: 90 },
                { name: 'Digestivo', percentage: 75 },
                { name: 'Antiflatulento', percentage: 65 }
            ]
        },
        {
            name: 'Manzanilla',
            scientificName: 'Matricaria chamomilla',
            imageUrl: 'https://www.nutricionysaludblog.com/src/uploads/2016/11/manzanilla.jpg',
            properties: [
                { name: 'Calmante', percentage: 95 },
                { name: 'Digestivo', percentage: 80 },
                { name: 'Antiinflamatorio', percentage: 70 }
            ]
        }
    ];

    constructor() { }


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
