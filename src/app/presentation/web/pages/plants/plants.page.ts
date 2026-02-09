import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-plants',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
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
    columns: ColumnConfig[] = [];

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('propertiesTpl', { static: true }) propertiesTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;
    @ViewChild(AddPlantModalComponent) addPlantModal!: AddPlantModalComponent;
    @ViewChild(PlantModalComponent) plantModal!: PlantModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedPlantId?: string;

    constructor(private plantRepository: PlantRepository, private toastController: ToastController) {
        addIcons({ checkmarkCircle, trash, alertCircle });
    }

    ngOnInit() {
        this.loadPlants();
        this.columns = [
            { key: 'commonName', header: 'Planta', cellTemplate: this.nameTpl },
            { key: 'properties', header: 'Propiedades', cellTemplate: this.propertiesTpl },
            { key: 'region', header: 'Región' },
            { key: 'actions', header: 'Acciones', cellTemplate: this.actionsTpl }
        ];
    }

    private loadPlants() {
        this.plantRepository.getPlants().subscribe(data => {
            this.plants = data;
        });
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
        this.plantModal.open('view', plant);
    }

    onEditPlant(plant: Plant) {
        this.plantModal.open('edit', plant);
    }

    onDeletePlant(plant: Plant) {
        this.selectedPlantId = plant.id;
        this.confirmModal.open();
    }

    onConfirmDelete() {
        if (this.selectedPlantId) {
            this.plantRepository.deletePlant(this.selectedPlantId).subscribe(() => {
                this.loadPlants();
                this.showToast('Planta eliminada correctamente', 'trash', 'danger');
                this.selectedPlantId = undefined;
            });
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
