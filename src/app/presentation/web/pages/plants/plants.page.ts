import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { AddPlantModalComponent } from '../../components/add-plant-modal/add-plant-modal.component';
import { PlantModalComponent } from '../../components/plant-modal/plant-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { Plant } from '../../../../domain/models/plant.entity';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-plants',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        AddPlantModalComponent,
        PlantModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './plants.page.html',
    styleUrls: ['./plants.page.scss']
})
export class PlantsPage implements OnInit {
    plants: Plant[] = [];
    private originalPlants: Plant[] = [];
    columns: ColumnConfig[] = [];
    activeFilters = {
        property: [] as string[]
    };
    selectedProperty = '';
    searchTerm = '';
    tableLoading = true;

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('propertiesTpl', { static: true }) propertiesTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;
    @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
    @ViewChild(AddPlantModalComponent) addPlantModal!: AddPlantModalComponent;
    @ViewChild(PlantModalComponent) plantModal!: PlantModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedPlantId?: string;
    currentIndex = -1;
    selectedPlant?: Plant;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.plants.length - 1; }

    constructor(
        private plantRepository: PlantRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ checkmarkCircle, trash, alertCircle });
    }

    ngOnInit() {
        this.loadPlants();
        this.columns = [
            { key: 'commonName', header: 'Planta', cellTemplate: this.nameTpl },
            { key: 'properties', header: 'Propiedades', cellTemplate: this.propertiesTpl },
            { key: 'region', header: 'Región' }
        ];
    }

    private loadPlants() {
        this.tableLoading = true;
        this.plantRepository.getPlants().subscribe(data => {
            this.originalPlants = data;
            this.applyFilters();
            setTimeout(() => {
                this.tableLoading = false;
                this.cdr.detectChanges();
            }, 2000);
        });
    }

    private applyFilters() {
        let filtered = [...this.originalPlants];

        if (this.activeFilters.property.length > 0) {
            // Filter plants that have ALL of the selected properties
            filtered = filtered.filter(p => 
                this.activeFilters.property.every(prop => p.properties.includes(prop))
            );
        }

        this.plants = filtered;
    }

    onSearch(term: string) {
        if (term) {
            this.plantRepository.searchPlants(term).subscribe(data => this.plants = data);
        } else {
            this.loadPlants();
        }
    }

    onAddPlant() {
        this.addPlantModal.open();
    }

    onViewPlant(plant: Plant) {
        this.selectedPlant = plant;
        this.currentIndex = this.plants.indexOf(plant);
        this.plantModal.open('view', plant);
    }

    onEditPlant(plant: Plant) {
        this.selectedPlant = plant;
        this.currentIndex = this.plants.indexOf(plant);
        this.plantModal.open('edit', plant);
    }

    onPrevPlant() {
        if (this.hasPrevious) {
            this.currentIndex--;
            this.selectedPlant = this.plants[this.currentIndex];
        }
    }

    onNextPlant() {
        if (this.hasNext) {
            this.currentIndex++;
            this.selectedPlant = this.plants[this.currentIndex];
        }
    }

    onDeletePlant(plant: Plant) {
        this.selectedPlantId = plant.id;
        this.confirmModal.open();
    }

    onBulkDelete(items: Plant[]) {
        // For now, let's just confirm for the first one or a generic message
        this.confirmModal.title = `Eliminar ${items.length} plantas`;
        this.confirmModal.message = `¿Estás seguro de que deseas eliminar las ${items.length} plantas seleccionadas?`;
        // We might need a better bulk delete logic, but for simplicity:
        this.selectedPlantId = items.map(i => i.id).join(','); // Hacky for this demo
        this.confirmModal.open();
    }

    onConfirmDelete() {
        if (this.selectedPlantId) {
            const ids = this.selectedPlantId.split(',');
            // If multiple, normally we'd call a bulk delete API. 
            // For now, let's just do one by one or the first one.
            ids.forEach(id => {
                this.plantRepository.deletePlant(id).subscribe(() => {
                    this.loadPlants();
                });
            });
            this.showToast(`${ids.length} planta(s) eliminada(s) correctamente`, 'trash', 'danger');
            this.selectedPlantId = undefined;
        }
        this.loadPlants();
    }

    onSavePlant(plant: Plant) {
        if (plant.id) {
            this.plantRepository.updatePlant(plant).subscribe(() => {
                this.loadPlants();
                this.showToast('Planta actualizada correctamente', 'checkmark-circle');
            });
        } else {
            this.plantRepository.addPlant(plant).subscribe(() => {
                this.loadPlants();
                this.showToast('Planta agregada correctamente', 'checkmark-circle');
            });
        }
    }

    async onPlantsAdded(newPlants: any[]) {
        // En un caso real, guardaríamos cada planta en el repositorio
        newPlants.forEach(plant => {
            const plantData: Plant = {
                id: '', // Se generará en el repositorio
                commonName: plant.commonName,
                scientificName: plant.scientificName,
                description: plant.description,
                region: plant.region,
                imageUrl: plant.imageUrl,
                properties: plant.properties || [],
                identifyingFeatures: plant.identifyingFeatures || [],
                compounds: []
            };
            this.plantRepository.addPlant(plantData).subscribe(() => {
                this.loadPlants();
            });
        });

        this.showToast(`${newPlants.length} planta(s) agregada(s) correctamente.`, 'checkmark-circle');
    }

    onFilterChange(type: string, value: any) {
        if (type === 'property') {
            // Handle single selection from dropdown - add to array if not already present
            if (value && value !== '' && !this.activeFilters.property.includes(value)) {
                this.activeFilters.property.push(value);
                this.applyFilters();
            }
            // Reset dropdown selection after adding
            this.selectedProperty = '';
            this.cdr.detectChanges();
        }
    }

    getAvailableProperties(): string[] {
        const allProperties = ['Antioxidante', 'Antiinflamatorio', 'Antiséptico', 'Sedante'];
        return allProperties.filter(prop => !this.activeFilters.property.includes(prop));
    }

    onPropertyTagClick(event: Event, property: string) {
        event.stopPropagation(); // Prevent row click
        // Toggle filter: if property is in array, remove it; otherwise, add it
        const index = this.activeFilters.property.indexOf(property);
        if (index > -1) {
            this.activeFilters.property.splice(index, 1);
        } else {
            this.activeFilters.property.push(property);
        }
        this.applyFilters();
        // Open the filter sidebar to show active filters
        if (this.dataTable) {
            this.dataTable.openFilterMenu();
        }
    }

    removePropertyFilter(property: string) {
        const index = this.activeFilters.property.indexOf(property);
        if (index > -1) {
            this.activeFilters.property.splice(index, 1);
            this.applyFilters();
        }
    }

    isPropertyFiltered(property: string): boolean {
        return this.activeFilters.property.includes(property);
    }

    onResetFilters() {
        this.activeFilters.property = [];
        this.applyFilters();
    }

    private async showToast(message: string, icon: string, color: string = 'dark') {
        const toast = await this.toastController.create({
            header: '¡Éxito!',
            message: message,
            duration: 3000,
            position: 'bottom',
            color: color,
            icon: icon,
            cssClass: 'custom-success-toast',
            buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
        });
        await toast.present();
    }
}
