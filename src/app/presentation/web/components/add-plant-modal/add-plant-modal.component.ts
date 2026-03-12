import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal, IonSpinner } from '@ionic/angular/standalone';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';

export interface PlantSearchResult {
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

    constructor(
        private plantRepository: PlantRepository,
        private cdr: ChangeDetectorRef
    ) { }

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

        this.plantRepository.searchPlants(this.searchQuery.trim()).subscribe({
            next: (plants) => {
                this.searchResults = plants.map(p => ({
                    id: p.id,
                    commonName: p.commonName,
                    scientificName: p.scientificName,
                    description: p.description ?? '',
                    properties: Array.isArray(p.properties) ? p.properties : [],
                    region: p.region ?? '',
                    imageUrl: p.imageUrl ?? '',
                    selected: false
                }));
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.searchResults = [];
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
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
