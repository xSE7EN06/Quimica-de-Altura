import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal, IonInput, IonSpinner } from '@ionic/angular/standalone';

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

type ModalState = 'search' | 'loading' | 'results';

@Component({
    selector: 'app-add-plant-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        IonModal,
        IonInput,
        IonSpinner
    ],
    templateUrl: './add-plant-modal.component.html',
    styleUrls: ['./add-plant-modal.component.scss']
})
export class AddPlantModalComponent {
    isOpen = false;
    plantName = '';
    currentState: ModalState = 'search';
    searchResults: PlantSearchResult[] = [];

    @Output() plantsAdded = new EventEmitter<PlantSearchResult[]>();

    // Datos estáticos de ejemplo
    private mockPlants: PlantSearchResult[] = [
        {
            id: '1',
            commonName: 'Aloe Vera',
            scientificName: 'Aloe barbadensis miller',
            description: 'Planta suculenta conocida por sus propiedades curativas para la piel y el sistema digestivo.',
            properties: ['Antiinflamatorio', 'Cicatrizante', 'Hidratante'],
            region: 'Regiones tropicales y subtropicales',
            imageUrl: 'assets/mock-images/aloe.jpg',
            selected: false
        },
        {
            id: '2',
            commonName: 'Manzanilla',
            scientificName: 'Matricaria chamomilla',
            description: 'Hierba aromática utilizada tradicionalmente para problemas digestivos y como calmante suave.',
            properties: ['Antiespasmódico', 'Sedante suave', 'Digestivo'],
            region: 'Europa y Asia templada',
            imageUrl: 'assets/mock-images/chamomile.jpg',
            selected: false
        },
        {
            id: '3',
            commonName: 'Árnica',
            scientificName: 'Arnica montana',
            description: 'Planta medicinal valorada por sus potentes efectos analgésicos y antiinflamatorios externos.',
            properties: ['Analgésico', 'Antiinflamatorio', 'Antiequimótico'],
            region: 'Zonas montañosas de Europa',
            imageUrl: 'assets/mock-images/arnica.jpg',
            selected: false
        },
        {
            id: '4',
            commonName: 'Lavanda',
            scientificName: 'Lavandula angustifolia',
            description: 'Planta aromática con propiedades relajantes y antisépticas ampliamente utilizada en aromaterapia.',
            properties: ['Relajante', 'Antiséptico', 'Aromático'],
            region: 'Región mediterránea',
            imageUrl: 'assets/mock-images/lavender.jpg',
            selected: false
        },
        {
            id: '5',
            commonName: 'Caléndula',
            scientificName: 'Calendula officinalis',
            description: 'Planta con flores naranjas brillantes, conocida por sus propiedades curativas en la piel.',
            properties: ['Cicatrizante', 'Antiinflamatorio', 'Antimicrobiano'],
            region: 'Sur de Europa',
            imageUrl: 'assets/mock-images/calendula.jpg',
            selected: false
        }
    ];

    constructor(private cdr: ChangeDetectorRef) { }

    open() {
        this.isOpen = true;
        this.plantName = '';
        this.currentState = 'search';
        this.searchResults = [];
    }

    onDidDismiss() {
        this.isOpen = false;
        this.plantName = '';
        this.currentState = 'search';
        this.searchResults = [];
    }

    close() {
        this.isOpen = false;
    }

    onSubmit() {
        if (this.plantName.trim()) {
            this.searchPlants();
        }
    }

    searchPlants() {
        this.currentState = 'loading';

        setTimeout(() => {
            this.searchResults = this.mockPlants.map(plant => ({ ...plant, selected: false }));
            this.currentState = 'results';
            console.log(this.searchResults);
            this.cdr.detectChanges();
        }, 3500);

    }

    togglePlantSelection(plant: PlantSearchResult) {
        plant.selected = !plant.selected;
    }

    get selectedCount(): number {
        return this.searchResults.filter(p => p.selected).length;
    }

    get hasSelection(): boolean {
        return this.selectedCount > 0;
    }

    onBackToSearch() {
        this.currentState = 'search';
        this.searchResults = [];
    }

    onAddSelectedPlants() {
        const selected = this.searchResults.filter(p => p.selected);
        if (selected.length > 0) {
            this.plantsAdded.emit(selected);
            this.close();
        }
    }

    onCancel() {
        this.close();
    }
}
