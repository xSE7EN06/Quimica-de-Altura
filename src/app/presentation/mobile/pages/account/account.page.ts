import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../components/header/header.component';
import { MostSearchedCardComponent } from '../../components/most-searched-card/most-searched-card.component';
import { addIcons } from 'ionicons';
import { createOutline, leafOutline } from 'ionicons/icons';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HeaderComponent, MostSearchedCardComponent]
})
export class AccountPage {
    // User Data
    user = {
        name: 'Angel Gabriel',
        subtitle: 'Andrade Amezcua',
        fullName: 'Angel Gabriel Andrade Amezcua',
        age: 19,
        dob: '19/09/2005',
        nationality: 'Mexicana',
        address: 'Fortín, Veracruz',
        imageUrl: 'assets/images/avatar-placeholder.png' // Utilizing a placeholder or the specific image if available
    };

    categories = [
        { name: 'Energizantes', active: true },
        { name: 'Relajantes', active: false },
        { name: 'Dolencia', active: false },
        { name: 'Digestivas', active: false },
        { name: 'Antibacterianas', active: false }
    ];

    selectedCategory = 'Energizantes';

    allSavedPlants = [
        {
            name: 'Ginseng',
            scientificName: 'Panax ginseng',
            imageUrl: 'https://cdn.shopify.com/s/files/1/0636/8755/7304/files/ginseng-rojo-amoseeds-especialista-superalimentos-bio3.jpg?v=1750933674',
            category: 'Energizantes',
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
            category: 'Energizantes',
            properties: [
                { name: 'Vitalidad', percentage: 88 },
                { name: 'Resistencia', percentage: 80 },
                { name: 'Libido', percentage: 75 }
            ]
        },
        {
            name: 'Manzanilla',
            scientificName: 'Matricaria chamomilla',
            imageUrl: 'https://images.ecestaticos.com/lZ6gT-pQW34vE5G7tW5o5g/0x0:999x999/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com/original/842/85a/2aa/84285a2aa77777777777777777777777.jpg',
            category: 'Relajantes',
            properties: [
                { name: 'Relajación', percentage: 95 },
                { name: 'Sueño', percentage: 90 },
                { name: 'Ansiedad', percentage: 85 }
            ]
        }
    ];

    savedPlants: any[] = [];

    constructor() {
        addIcons({ createOutline, leafOutline });
        this.filterPlants();
    }

    selectCategory(categoryName: string) {
        this.selectedCategory = categoryName;
        this.categories.forEach(cat => cat.active = cat.name === categoryName);
        this.filterPlants();
    }

    filterPlants() {
        this.savedPlants = this.allSavedPlants.filter(p => p.category === this.selectedCategory);
    }

    onEditProfile() {
        console.log('Edit profile clicked');
    }

    onViewDetail(plant: any) {
        console.log('View detail clicked', plant);
    }
}
