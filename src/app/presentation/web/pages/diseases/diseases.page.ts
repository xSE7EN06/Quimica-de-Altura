import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
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
    imports: [CommonModule, MatIconModule, FormsModule, DataTableComponent],
    templateUrl: './diseases.page.html',
    styleUrls: ['./diseases.page.scss']
})
export class DiseasesPage implements OnInit {

    private originalDiseases: Disease[] = [
        { id: '1', name: 'Gastritis', icdCode: 'K29.7', category: 'Digestivas', severity: 'Leve' },
        { id: '2', name: 'Colitis', icdCode: 'K52.9', category: 'Digestivas', severity: 'Moderada' },
        { id: '3', name: 'Úlcera péptica', icdCode: 'K27.9', category: 'Digestivas', severity: 'Grave' },
        { id: '4', name: 'Bronquitis', icdCode: 'J20.9', category: 'Respiratorias', severity: 'Moderada' },
        { id: '5', name: 'Sinusitis', icdCode: 'J32.9', category: 'Respiratorias', severity: 'Leve' },
        { id: '6', name: 'Asma', icdCode: 'J45.9', category: 'Respiratorias', severity: 'Grave' },
        { id: '7', name: 'Ansiedad', icdCode: 'F41.1', category: 'Nerviosas', severity: 'Moderada' },
        { id: '8', name: 'Insomnio', icdCode: 'G47.0', category: 'Nerviosas', severity: 'Leve' },
        { id: '9', name: 'Migraña', icdCode: 'G43.9', category: 'Nerviosas', severity: 'Grave' },
    ];

    diseases: Disease[] = [];
    activeFilters = {
        category: '',
        severity: ''
    };
    searchTerm = '';

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
        this.applyFilters();
        this.columns = [
            { key: 'id', header: 'ID' },
            { key: 'name', header: 'Nombre', cellTemplate: this.nameTpl },
            { key: 'icdCode', header: 'Código ICD' },
            { key: 'category', header: 'Categoría' },
            { key: 'severity', header: 'Gravedad' }
        ];
    }

    private applyFilters() {
        let filtered = [...this.originalDiseases];

        if (this.activeFilters.category) {
            filtered = filtered.filter(d => d.category === this.activeFilters.category);
        }

        if (this.activeFilters.severity) {
            filtered = filtered.filter(d => d.severity === this.activeFilters.severity);
        }

        this.diseases = filtered;
    }

    onFilterChange(type: 'category' | 'severity', value: string) {
        this.activeFilters[type] = value;
        this.applyFilters();
    }

    onResetFilters() {
        this.activeFilters = { category: '', severity: '' };
        this.applyFilters();
    }

    onSearch(term: string) {
        if (term) {
            this.diseases = this.originalDiseases.filter(d =>
                d.name.toLowerCase().includes(term.toLowerCase()) ||
                d.icdCode.toLowerCase().includes(term.toLowerCase())
            );
        } else {
            this.applyFilters();
        }
    }

    onAddDisease() {
        console.log('Add disease');
    }

    onViewDisease(item: any) {
        console.log('View disease:', item);
    }

    onEditDisease(item: any) {
        console.log('Edit disease:', item);
    }

    onBulkDelete(items: any[]) {
        console.log('Bulk delete diseases:', items);
    }
}
