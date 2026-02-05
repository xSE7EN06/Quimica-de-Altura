import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActionBarComponent } from '../../components/action-bar/action-bar.component';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';

interface Plant {
    id: string;
    name: string;
    scientificName: string;
    category: string;
    status: 'Active' | 'Pending' | 'Inactive';
    date: string;
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
        { id: '#PL-001', name: 'Manzanilla', scientificName: 'Matricaria chamomilla', category: 'Medicinal', status: 'Active', date: '2023-10-15' },
        { id: '#PL-002', name: 'Aloe Vera', scientificName: 'Aloe barbadensis miller', category: 'Cosmética', status: 'Active', date: '2023-10-18' },
        { id: '#PL-003', name: 'Menta', scientificName: 'Mentha piperita', category: 'Aromática', status: 'Pending', date: '2023-10-20' },
        { id: '#PL-004', name: 'Lavanda', scientificName: 'Lavandula angustifolia', category: 'Aromática', status: 'Active', date: '2023-10-22' },
        { id: '#PL-005', name: 'Romero', scientificName: 'Salvia rosmarinus', category: 'Culinaria', status: 'Inactive', date: '2023-10-25' },
        { id: '#PL-006', name: 'Tomillo', scientificName: 'Thymus vulgaris', category: 'Culinaria', status: 'Active', date: '2023-10-26' },
    ];

    columns: ColumnConfig[] = [];

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    ngOnInit() {
        this.columns = [
            { key: 'name', header: 'Nombre Común', cellTemplate: this.nameTpl },
            { key: 'category', header: 'Categoría' },
            { key: 'date', header: 'Fecha Registro' },
            { key: 'status', header: 'Estado', cellTemplate: this.statusTpl },
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
