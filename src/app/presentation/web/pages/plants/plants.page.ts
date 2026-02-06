import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActionBarComponent } from '../../components/action-bar/action-bar.component';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { Plant } from '../../../../domain/models/plant.entity';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';

@Component({
    selector: 'app-plants',
    standalone: true,
    imports: [CommonModule, MatIconModule, DataTableComponent],
    templateUrl: './plants.page.html',
    styleUrls: ['./plants.page.scss']
})
export class PlantsPage implements OnInit {
    plants: Plant[] = [];
    columns: ColumnConfig[] = [];

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('propertiesTpl', { static: true }) propertiesTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    constructor(private plantRepository: PlantRepository) { }

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
        console.log('Add Plant');
    }
}
