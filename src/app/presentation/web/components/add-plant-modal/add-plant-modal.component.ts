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
            imageUrl: 'data:image/jpeg;base64,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',
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
