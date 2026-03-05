import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { DataPipelineModalComponent } from '../../components/data-pipeline-modal/data-pipeline-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { DataPipeline } from '../../../../domain/models/data-pipeline.entity';
import { DataPipelineRepository } from '../../../../domain/repositories/data-pipeline.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
    selector: 'app-data-pipelines',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        DataPipelineModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './data-pipelines.page.html',
    styleUrls: ['./data-pipelines.page.scss']
})
export class DataPipelinesPage implements OnInit {
    items: DataPipeline[] = [];
    private originalItems: DataPipeline[] = [];
    columns: ColumnConfig[] = [];
    activeFilters: Record<string, string[]> = { status: [], source: [] };
    searchTerm = '';
    tableLoading = true;

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('recordsTpl', { static: true }) recordsTpl!: TemplateRef<any>;
    @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
    @ViewChild(DataPipelineModalComponent) itemModal!: DataPipelineModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedItemId?: string;
    currentIndex = -1;
    selectedItem?: DataPipeline;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

    constructor(
        private repo: DataPipelineRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ checkmarkCircle, trash, alertCircle });
    }

    ngOnInit() {
        this.loadData();
        this.columns = [
            { key: 'name', header: 'Pipeline / Estado', cellTemplate: this.nameTpl },
            { key: 'source', header: 'Fuente' },
            { key: 'recordsSynced', header: 'Registros Sincronizados', cellTemplate: this.recordsTpl },
            { key: 'lastSync', header: 'Última Sincronización' },
            { key: 'nextSync', header: 'Próxima Sincronización' }
        ];
    }

    private loadData() {
        this.tableLoading = true;
        this.repo.getAll().subscribe(data => {
            this.originalItems = data;
            this.applyFilters();
            setTimeout(() => {
                this.tableLoading = false;
                this.cdr.detectChanges();
            }, 2000);
        });
    }

    private applyFilters() {
        let filtered = [...this.originalItems];
        if (this.activeFilters['status']?.length > 0) {
            filtered = filtered.filter(item => this.activeFilters['status'].includes(item.status));
        }
        if (this.activeFilters['source']?.length > 0) {
            filtered = filtered.filter(item => this.activeFilters['source'].includes(item.source));
        }
        this.items = filtered;
    }

    onAddItem() { this.itemModal.open('add'); }

    onViewItem(item: DataPipeline) {
        this.selectedItem = item;
        this.currentIndex = this.items.indexOf(item);
        this.itemModal.open('view', item);
    }

    onEditItem(item: DataPipeline) {
        this.selectedItem = item;
        this.currentIndex = this.items.indexOf(item);
        this.itemModal.open('edit', item);
    }

    onPrevItem() {
        if (this.hasPrevious) {
            this.currentIndex--;
            this.selectedItem = this.items[this.currentIndex];
            this.itemModal.open('view', this.selectedItem);
        }
    }

    onNextItem() {
        if (this.hasNext) {
            this.currentIndex++;
            this.selectedItem = this.items[this.currentIndex];
            this.itemModal.open('view', this.selectedItem);
        }
    }

    onDeleteItem(item: DataPipeline) {
        this.selectedItemId = item.id;
        this.confirmModal.open();
    }

    onBulkDelete(items: DataPipeline[]) {
        this.confirmModal.title = `Eliminar ${items.length} pipelines`;
        this.confirmModal.message = `¿Estás seguro de que deseas eliminar los ${items.length} pipelines seleccionados?`;
        this.selectedItemId = items.map(i => i.id).join(',');
        this.confirmModal.open();
    }

    onConfirmDelete() {
        if (this.selectedItemId) {
            const ids = this.selectedItemId.split(',');
            ids.forEach(id => this.repo.delete(id).subscribe(() => this.loadData()));
            this.showToast(`${ids.length} pipeline(s) eliminado(s) correctamente`, 'trash', 'danger');
            this.selectedItemId = undefined;
        }
        this.loadData();
    }

    onSaveItem(item: DataPipeline) {
        if (item.id) {
            this.repo.update(item).subscribe(() => {
                this.loadData();
                this.showToast('Pipeline actualizado correctamente', 'checkmark-circle');
            });
        } else {
            this.repo.add(item).subscribe(() => {
                this.loadData();
                this.showToast('Pipeline agregado correctamente', 'checkmark-circle');
            });
        }
    }

    onFilterChange(type: string, value: string) {
        if (value && !this.activeFilters[type]?.includes(value)) {
            if (!this.activeFilters[type]) this.activeFilters[type] = [];
            this.activeFilters[type].push(value);
            this.applyFilters();
            this.cdr.detectChanges();
        }
    }

    removeFilter(type: string, value: string) {
        const idx = this.activeFilters[type]?.indexOf(value);
        if (idx > -1) {
            this.activeFilters[type].splice(idx, 1);
            this.applyFilters();
        }
    }

    onResetFilters() {
        Object.keys(this.activeFilters).forEach(k => this.activeFilters[k] = []);
        this.applyFilters();
    }

    getAvailableStatuses(): string[] {
        const all = ['active', 'idle', 'error', 'syncing'];
        return all.filter(s => !this.activeFilters['status'].includes(s));
    }

    getAvailableSources(): string[] {
        const allSources = [...new Set(this.originalItems.map(i => i.source))];
        return allSources.filter(s => !this.activeFilters['source'].includes(s));
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            active: 'Activo',
            idle: 'Inactivo',
            error: 'Error',
            syncing: 'Sincronizando'
        };
        return labels[status] || status;
    }

    formatNumber(n: number): string {
        return n.toLocaleString('es-MX');
    }

    private async showToast(message: string, icon: string, color: string = 'dark') {
        const toast = await this.toastController.create({
            header: '¡Éxito!',
            message,
            duration: 3000,
            position: 'bottom',
            color,
            icon,
            cssClass: 'custom-success-toast',
            buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
        });
        await toast.present();
    }
}
