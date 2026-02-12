import { Component, Input, Output, EventEmitter, TemplateRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface ColumnConfig {
    key: string;
    header: string;
    cellTemplate?: TemplateRef<any>;
}

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [CommonModule, MatIconModule, FormsModule],
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
    @Input() data: any[] = [];
    @Input() columns: ColumnConfig[] = [];
    @Input() itemsPerPage = 7;
    @Output() rowClick = new EventEmitter<any>();
    @Output() editAction = new EventEmitter<any>();
    @Output() deleteAction = new EventEmitter<any[]>();
    @Output() filterClick = new EventEmitter<void>();

    selectedItems = new Set<any>();
    currentPage = 1;
    showFilterMenu = false;
    sortColumn = '';
    sortDirection: 'asc' | 'desc' = 'asc';

    ngOnInit() {
        if (this.columns.length > 0) {
            this.sortColumn = this.columns[0].key;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            this.currentPage = 1;
            this.selectedItems.clear();
        }
    }

    get paginatedData(): any[] {
        let processedData = [...this.data];

        // Apply Sorting
        if (this.sortColumn) {
            processedData.sort((a, b) => {
                const valA = this.getNestedValue(a, this.sortColumn);
                const valB = this.getNestedValue(b, this.sortColumn);

                let comparison = 0;
                if (typeof valA === 'string') {
                    comparison = valA.localeCompare(valB);
                } else {
                    if (valA < valB) comparison = -1;
                    if (valA > valB) comparison = 1;
                }

                return this.sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return processedData.slice(start, end);
    }

    private getNestedValue(obj: any, path: string): any {
        if (!path) return '';
        return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : ''), obj) || '';
    }

    get totalPages(): number {
        return Math.ceil(this.data.length / this.itemsPerPage) || 1;
    }

    get pageNumbers(): number[] {
        const pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    get displayedColumns(): ColumnConfig[] {
        if (this.columns && this.columns.length > 0) {
            return this.columns;
        }

        if (this.data && this.data.length > 0) {
            const keys = Object.keys(this.data[0]);
            const excludedKeys = ['id', 'imageUrl', 'compounds', 'identifyingFeatures'];
            return keys
                .filter(key => !excludedKeys.includes(key))
                .map(key => ({
                    key,
                    header: this.formatHeader(key)
                }));
        }

        return [];
    }

    private formatHeader(key: string): string {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    }

    toggleSelectAll() {
        const currentData = this.paginatedData;
        const allSelected = currentData.every(item => this.selectedItems.has(item));

        if (allSelected) {
            currentData.forEach(item => this.selectedItems.delete(item));
        } else {
            currentData.forEach(item => this.selectedItems.add(item));
        }
    }

    onRowSelection(event: Event, item: any) {
        event.stopPropagation();
        this.toggleSelection(item);
    }

    onRowClick(item: any) {
        this.rowClick.emit(item);
    }

    toggleSelection(item: any) {
        if (this.selectedItems.has(item)) {
            this.selectedItems.delete(item);
        } else {
            this.selectedItems.add(item);
        }
    }

    isItemSelected(item: any): boolean {
        return this.selectedItems.has(item);
    }

    onEdit() {
        if (this.selectedItems.size === 1) {
            const item = Array.from(this.selectedItems)[0];
            this.editAction.emit(item);
        }
    }

    onDelete() {
        if (this.selectedItems.size > 0) {
            this.deleteAction.emit(Array.from(this.selectedItems));
        }
    }

    @Output() resetFilters = new EventEmitter<void>();

    onFilter() {
        this.showFilterMenu = !this.showFilterMenu;
        this.filterClick.emit();
    }

    onSortChange(column: string) {
        this.sortColumn = column;
        this.currentPage = 1;
    }

    onDirectionChange(direction: 'asc' | 'desc') {
        this.sortDirection = direction;
        this.currentPage = 1;
    }

    onResetFilters() {
        this.sortColumn = this.columns.length > 0 ? this.columns[0].key : '';
        this.sortDirection = 'asc';
        this.resetFilters.emit();
    }
}
