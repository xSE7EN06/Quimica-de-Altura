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
}
