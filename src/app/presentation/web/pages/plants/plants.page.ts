import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActionBarComponent } from '../../components/action-bar/action-bar.component';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';

interface Plant {
    id: string;
    name: string;
    category: string;
    description: string;
}

@Component({
    selector: 'app-plants',
    standalone: true,
    imports: [CommonModule, MatIconModule, ActionBarComponent, DataTableComponent],
    templateUrl: './plants.page.html',
    styleUrls: ['./plants.page.scss']
})
export class PlantsPage {
    plants: Plant[] = [
        { id: 'Darlene Robertson', name: 'Alvarez', category: 'View file', description: '' },
        { id: 'Guy Hawkins', name: 'Perez', category: 'View file', description: '' },
        { id: 'Esther Howard', name: 'Lara', category: 'View file', description: '' },
    ];

    columns: ColumnConfig[] = [];

    // We will initialize columns in AfterViewInit if we need access to templates, 
    // or we can references them in the HTML directly if we pass TemplateRefs.
    // However, since ColumnConfig needs TemplateRef, we usually get them via @ViewChild.

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('descTpl', { static: true }) descTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    ngOnInit() {
        this.columns = [
            { key: 'id', header: 'ID' },
            { key: 'name', header: 'Nombre', cellTemplate: this.nameTpl },
            { key: 'category', header: 'Descripción', cellTemplate: this.descTpl }, // Using category field for Description col based on previous mocks
            { key: 'actions', header: 'Acciones', cellTemplate: this.actionsTpl }
        ];
    }

    onSearch(term: string) {
        console.log('Search:', term);
    }

    onAddPlant() {
        console.log('Add Plant');
    }
}
