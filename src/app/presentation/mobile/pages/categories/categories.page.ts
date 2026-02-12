import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.page.html',
    styleUrls: ['./categories.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, HeaderComponent, SearchInputComponent, IonContent, IonGrid, IonRow, IonCol, IonIcon]
})
export class CategoriesPage implements OnInit {

    categories = [
        {
            name: 'Energizantes',
            description: 'Aumenta tu energía naturalmente.',
            image: 'https://img.freepik.com/premium-vector/man-running-park-morning_165429-792.jpg'
        },
        {
            name: 'Relajantes',
            description: 'Relájate y duerme mejor.',
            image: 'https://img.freepik.com/free-vector/meditating-concept-illustration_114360-2972.jpg'
        },
        {
            name: 'Dolencia',
            description: 'Alivio natural para el dolor.',
            image: 'https://img.freepik.com/free-vector/flat-person-having-headache_23-2148924043.jpg'
        },
        {
            name: 'Antibacterianas',
            description: 'Combate infecciones y virus.',
            image: 'https://img.freepik.com/free-vector/itchy-skin-concept-illustration_114360-14330.jpg'
        },
        {
            name: 'Digestivas',
            description: 'Mejora tu salud digestiva.',
            image: 'https://img.freepik.com/free-vector/stomach-ache-concept-illustration_114360-1558.jpg'
        }
    ];

    constructor(private router: Router) {
        addIcons({ alertCircleOutline });
    }

    ngOnInit() {
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

    viewCategory(category: string) {
        this.router.navigate(['/category-detail', category]);
    }

}
