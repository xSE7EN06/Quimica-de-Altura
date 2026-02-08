import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { AddPlantModalComponent } from '../../components/add-plant-modal/add-plant-modal.component';
import { Plant } from '../../../../domain/models/plant.entity';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
@Component({
    selector: 'app-plants',
    standalone: true,
    imports: [CommonModule, MatIconModule, DataTableComponent, AddPlantModalComponent],
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

    constructor(private plantRepository: PlantRepository, private toastController: ToastController) { addIcons({ checkmarkCircle }); }

    ngOnInit() {
        this.loadPlants();
        this.columns = [
            /* Se omite el ID por solicitud del usuario */
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

    async onPlantsAdded(newPlants: any[]) {
        this.loadPlants();

        const toast = await this.toastController.create({
            header: '¡Éxito!',
            message: `${newPlants.length} planta(s) guardada(s) correctamente.`,
            duration: 3000,
            position: 'bottom',
            color: 'dark',
            icon: 'checkmark-circle',
            cssClass: 'custom-success-toast',

            buttons: [
                {
                    side: 'end',
                    icon: 'close',
                    role: 'cancel'
                }
            ]
        });

        await toast.present();
    }
}
