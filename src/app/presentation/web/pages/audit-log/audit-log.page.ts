import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { AuditLogModalComponent } from '../../components/audit-log-modal/audit-log-modal.component';
import { AuditLog } from '../../../../domain/models/audit-log.entity';
import { AuditLogRepository } from '../../../../domain/repositories/audit-log.repository';

@Component({
    selector: 'app-audit-log',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        AuditLogModalComponent
    ],
    templateUrl: './audit-log.page.html',
    styleUrls: ['./audit-log.page.scss']
})
export class AuditLogPage implements OnInit {
    items: AuditLog[] = [];
    private originalItems: AuditLog[] = [];
    columns: ColumnConfig[] = [];
    tableLoading = true;
    searchTerm = '';

    selectedAction = '';
    selectedResource = '';
    activeFilters = { action: '', resource: '' };

    availableResources: string[] = [];

    @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;
    @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
    @ViewChild(AuditLogModalComponent) itemModal!: AuditLogModalComponent;

    selectedItem?: AuditLog;

    constructor(
        private repository: AuditLogRepository,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadItems();
        this.columns = [
            { key: 'userName', header: 'Usuario' },
            { key: 'action', header: 'Acción', cellTemplate: this.actionTpl },
            { key: 'resource', header: 'Recurso' },
            { key: 'resourceId', header: 'ID Recurso' },
            { key: 'timestamp', header: 'Fecha/Hora' },
            { key: 'ipAddress', header: 'IP' }
        ];
    }

    private loadItems() {
        this.tableLoading = true;
        this.repository.getAll().subscribe(data => {
            this.originalItems = data;
            this.availableResources = [...new Set(data.map(i => i.resource))];
            this.applyFilters();
            setTimeout(() => {
                this.tableLoading = false;
                this.cdr.detectChanges();
            }, 800);
        });
    }

    private applyFilters() {
        let filtered = [...this.originalItems];
        if (this.activeFilters.action) {
            filtered = filtered.filter(i => i.action === this.activeFilters.action);
        }
        if (this.activeFilters.resource) {
            filtered = filtered.filter(i => i.resource === this.activeFilters.resource);
        }
        this.items = filtered;
    }

    onSearch(term: string) {
        if (term) {
            const t = term.toLowerCase();
            this.items = this.originalItems.filter(i =>
                i.userName.toLowerCase().includes(t) ||
                i.resource.toLowerCase().includes(t) ||
                i.resourceId.toLowerCase().includes(t)
            );
        } else {
            this.applyFilters();
        }
    }

    onViewItem(item: AuditLog) {
        this.selectedItem = item;
        this.itemModal.open('view', item);
    }

    onFilterChange(type: string, value: string) {
        if (type === 'action') {
            this.activeFilters.action = value;
        } else if (type === 'resource') {
            this.activeFilters.resource = value;
        }
        this.applyFilters();
    }

    onResetFilters() {
        this.activeFilters = { action: '', resource: '' };
        this.selectedAction = '';
        this.selectedResource = '';
        this.applyFilters();
    }

    getActionBadgeClass(action: string): string {
        const map: Record<string, string> = {
            'create': 'badge-green',
            'update': 'badge-blue',
            'delete': 'badge-red',
            'approve': 'badge-teal',
            'reject': 'badge-orange'
        };
        return map[action] || '';
    }
}
