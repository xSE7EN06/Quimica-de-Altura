import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActionBarComponent } from '../../components/action-bar/action-bar.component';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';

interface Disease {
    id: string;
    name: string;
    icdCode: string; // Codigo ICD
    category: string;
    severity: string; // Gravedad
}

@Component({
    selector: 'app-diseases',
    standalone: true,
    imports: [CommonModule, MatIconModule, ActionBarComponent, DataTableComponent],
    templateUrl: './diseases.page.html',
    styleUrls: ['./diseases.page.scss']
})
export class DiseasesPage implements OnInit {

    diseases: Disease[] = [
        { id: 'Darlene Robertson', name: 'Alvarez', icdCode: 'View file', category: 'View file', severity: 'View file' },
        { id: 'Guy Hawkins', name: 'Perez', icdCode: 'View file', category: 'View file', severity: 'View file' },
        { id: 'Esther Howard', name: 'Lara', icdCode: 'View file', category: 'View file', severity: 'View file' },
    ];

    // Dynamic data for the stats section
    diseaseStats = [
        { label: 'Digestivas', percentage: 40, class: 'cat-digestivas', textClass: 'text-white' },
        { label: 'Respiratorias', percentage: 30, class: 'cat-respiratorias', textClass: 'text-white' },
        { label: 'Nerviosas', percentage: 20, class: 'cat-nerviosas', textClass: 'text-dark' }
    ];

    columns: ColumnConfig[] = [];

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('viewFileTpl', { static: true }) viewFileTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    ngOnInit() {
        this.columns = [
            { key: 'id', header: 'ID' },
            { key: 'name', header: 'Nombre', cellTemplate: this.nameTpl },
            { key: 'icdCode', header: 'Código ICD', cellTemplate: this.viewFileTpl },
            { key: 'category', header: 'Categoría', cellTemplate: this.viewFileTpl },
            { key: 'severity', header: 'Gravedad', cellTemplate: this.viewFileTpl },
            { key: 'actions', header: 'Acciones', cellTemplate: this.actionsTpl }
        ];
    }

    onSearch(term: string) {
        console.log('Search disease:', term);
    }

    onAddDisease() {
        console.log('Add disease');
    }
}
