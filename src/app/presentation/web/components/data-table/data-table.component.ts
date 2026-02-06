import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface ColumnConfig {
    key: string;
    header: string;
    cellTemplate?: TemplateRef<any>;
}

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
    @Input() data: any[] = [];
    @Input() columns: ColumnConfig[] = [];

    get displayedColumns(): ColumnConfig[] {
        if (this.columns && this.columns.length > 0) {
            return this.columns;
        }

        if (this.data && this.data.length > 0) {
            // Auto-generate columns from data keys, excluding sensitive or irrelevant ones
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
}
