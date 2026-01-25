import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { MostSearchedCardComponent } from '../../components/most-searched-card/most-searched-card.component';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
    selector: 'app-energizers',
    templateUrl: './energizers.page.html',
    styleUrls: ['./energizers.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, HeaderComponent, SearchInputComponent, MostSearchedCardComponent, IonIcon]
})
export class EnergizersPage {

    plants = [
        {
            name: 'Ginseng',
            scientificName: 'Panax ginseng',
            imageUrl: 'https://cdn.shopify.com/s/files/1/0636/8755/7304/files/ginseng-rojo-amoseeds-especialista-superalimentos-bio3.jpg?v=1750933674',
            properties: [
                { name: 'Energía', percentage: 90 },
                { name: 'Concentración', percentage: 85 },
                { name: 'Inmunidad', percentage: 70 }
            ]
        },
        {
            name: 'Maca',
            scientificName: 'Lepidium meyenii',
            imageUrl: 'https://www.almalibreacaihouse.com/wp-content/uploads/2021/11/maca-superalimento-acai-espana.jpg',
            properties: [
                { name: 'Vitalidad', percentage: 88 },
                { name: 'Resistencia', percentage: 80 },
                { name: 'Libido', percentage: 75 }
            ]
        },
        {
            name: 'Guaraná',
            scientificName: 'Paullinia cupana',
            imageUrl: 'https://www.herbalife.com/assets/regional-reusable-assets/amer/samcam/sam/images/Beneficios%20del%20Guaran%C3%A1.jpg',
            properties: [
                { name: 'Estimulante', percentage: 95 },
                { name: 'Metabolismo', percentage: 80 },
                { name: 'Alerta', percentage: 85 }
            ]
        }
    ];

    constructor(private router: Router) {
        addIcons({ alertCircleOutline });
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

    viewDetail() {
        // this.router.navigate(['/detail-plant']);
        console.log('View Detail');
    }

}
