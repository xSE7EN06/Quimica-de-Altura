import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActionBarComponent } from '../../components/action-bar/action-bar.component';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';

interface Compound {
    id: string;
    commonName: string; // Nombre común
    type: string;       // Tipo
    formula: string;    // Fórmula
}

@Component({
    selector: 'app-compounds',
    standalone: true,
    imports: [CommonModule, MatIconModule, ActionBarComponent, DataTableComponent],
    templateUrl: './compounds.page.html',
    styleUrls: ['./compounds.page.scss']
})
export class CompoundsPage implements OnInit {

    compounds: Compound[] = [
        { id: 'Darlene Robertson', commonName: 'Alvarez', type: 'View file', formula: 'View file' },
        { id: 'Guy Hawkins', commonName: 'Perez', type: 'View file', formula: 'View file' },
        { id: 'Esther Howard', commonName: 'Lara', type: 'View file', formula: 'View file' },
    ];

    columns: ColumnConfig[] = [];

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('viewFileTpl', { static: true }) viewFileTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    ngOnInit() {
        this.columns = [
            { key: 'id', header: 'ID' },
            { key: 'commonName', header: 'Nombre común', cellTemplate: this.nameTpl },
            { key: 'type', header: 'Tipo', cellTemplate: this.viewFileTpl },
            { key: 'formula', header: 'Fórmula', cellTemplate: this.viewFileTpl },
            { key: 'actions', header: 'Acciones', cellTemplate: this.actionsTpl }
        ];
    }

    onSearch(term: string) {
        console.log('Search compound:', term);
    }

    onAddCompound() {
        console.log('Add compound');
    }
}
