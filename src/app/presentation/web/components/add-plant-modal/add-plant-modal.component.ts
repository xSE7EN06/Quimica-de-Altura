import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal, IonSpinner } from '@ionic/angular/standalone';

interface PlantSearchResult {
    id: string;
    commonName: string;
    scientificName: string;
    description: string;
    properties: string[];
    region: string;
    imageUrl: string;
    selected?: boolean;
}

@Component({
    selector: 'app-add-plant-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        IonModal,
        IonSpinner
    ],
    templateUrl: './add-plant-modal.component.html',
    styleUrls: ['./add-plant-modal.component.scss']
})
export class AddPlantModalComponent {
    @Output() plantsAdded = new EventEmitter<PlantSearchResult[]>();

    isOpen = false;
    searchQuery = '';
    isLoading = false;
    hasSearched = false;
    searchResults: PlantSearchResult[] = [];

    // Datos estáticos de ejemplo
    private mockPlants: PlantSearchResult[] = [
        {
            id: '1',
            commonName: 'Aloe Vera',
            scientificName: 'Aloe barbadensis miller',
            description: 'Planta suculenta conocida por sus propiedades curativas para la piel y el sistema digestivo.',
            properties: ['Antiinflamatorio', 'Cicatrizante', 'Hidratante'],
            region: 'Regiones tropicales y subtropicales',
            imageUrl: 'https://cdn.pixabay.com/photo/2018/04/02/07/42/aloe-vera-3283116_1280.jpg',
            selected: false
        },
        {
            id: '2',
            commonName: 'Manzanilla',
            scientificName: 'Matricaria chamomilla',
            description: 'Hierba aromática utilizada tradicionalmente para problemas digestivos y como calmante suave.',
            properties: ['Antiespasmódico', 'Sedante suave', 'Digestivo'],
            region: 'Europa y Asia templada',
            imageUrl: 'https://cdn.pixabay.com/photo/2017/08/01/08/32/chamomile-2563386_1280.jpg',
            selected: false
        },
        {
            id: '3',
            commonName: 'Árnica',
            scientificName: 'Arnica montana',
            description: 'Planta medicinal valorada por sus potentes efectos analgésicos y antiinflamatorios externos.',
            properties: ['Analgésico', 'Antiinflamatorio', 'Antiequimótico'],
            region: 'Zonas montañosas de Europa',
            imageUrl: 'https://cdn.pixabay.com/photo/2016/05/26/14/43/arnica-1417282_1280.jpg',
            selected: false
        },
        {
            id: '4',
            commonName: 'Lavanda',
            scientificName: 'Lavandula angustifolia',
            description: 'Planta aromática con propiedades relajantes y antisépticas ampliamente utilizada en aromaterapia.',
            properties: ['Relajante', 'Antiséptico', 'Aromático'],
            region: 'Región mediterránea',
            imageUrl: 'https://cdn.pixabay.com/photo/2016/07/23/21/51/lavender-1537492_1280.jpg',
            selected: false
        },
        {
            id: '5',
            commonName: 'Caléndula',
            scientificName: 'Calendula officinalis',
            description: 'Planta con flores naranjas brillantes, conocida por sus propiedades curativas en la piel.',
            properties: ['Cicatrizante', 'Antiinflamatorio', 'Antimicrobiano'],
            region: 'Sur de Europa',
            imageUrl: 'https://cdn.pixabay.com/photo/2016/07/21/11/34/calendula-1532311_1280.jpg',
            selected: false
        }
    ];

    constructor(private cdr: ChangeDetectorRef) { }

    open() {
        this.isOpen = true;
        this.reset();
    }

    close() {
        this.isOpen = false;
    }

    private reset() {
        this.searchQuery = '';
        this.isLoading = false;
        this.hasSearched = false;
        this.searchResults = [];
    }

    onSearch() {
        if (!this.searchQuery.trim()) return;

        this.isLoading = true;
        this.hasSearched = true;
        this.searchResults = [];

        // Simulación de búsqueda
        setTimeout(() => {
            const query = this.searchQuery.toLowerCase();
            this.searchResults = this.mockPlants
                .filter(p =>
                    p.commonName.toLowerCase().includes(query) ||
                    p.scientificName.toLowerCase().includes(query)
                )
                .map(plant => ({ ...plant, selected: false }));

            this.isLoading = false;
            this.cdr.detectChanges();
        }, 2000);
    }

    onSelect(plant: PlantSearchResult) {
        plant.selected = !plant.selected;
    }

    isSelected(plant: PlantSearchResult): boolean {
        return !!plant.selected;
    }

    get selectedCount(): number {
        return this.searchResults.filter(p => p.selected).length;
    }

    onConfirm() {
        const selected = this.searchResults.filter(p => p.selected);
        if (selected.length > 0) {
            this.plantsAdded.emit(selected);
            this.close();
        }
    }
}
