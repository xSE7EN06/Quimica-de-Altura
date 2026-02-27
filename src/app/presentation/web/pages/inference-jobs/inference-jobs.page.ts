import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { InferenceJobModalComponent } from '../../components/inference-job-modal/inference-job-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { InferenceJob } from '../../../../domain/models/inference-job.entity';
import { InferenceJobRepository } from '../../../../domain/repositories/inference-job.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle, flag } from 'ionicons/icons';

@Component({
    selector: 'app-inference-jobs',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        InferenceJobModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './inference-jobs.page.html',
    styleUrls: ['./inference-jobs.page.scss']
})
export class InferenceJobsPage implements OnInit {
    items: InferenceJob[] = [];
    private originalItems: InferenceJob[] = [];
    columns: ColumnConfig[] = [];
    activeFilters: Record<string, string[]> = { status: [] };
    searchTerm = '';
    tableLoading = true;

    @ViewChild('speciesTpl', { static: true }) speciesTpl!: TemplateRef<any>;
    @ViewChild('scoreTpl', { static: true }) scoreTpl!: TemplateRef<any>;
    @ViewChild('flaggedTpl', { static: true }) flaggedTpl!: TemplateRef<any>;
    @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
    @ViewChild(InferenceJobModalComponent) itemModal!: InferenceJobModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedItemId?: string;
    currentIndex = -1;
    selectedItem?: InferenceJob;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

    constructor(
        private repo: InferenceJobRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ checkmarkCircle, trash, alertCircle, flag });
    }

    ngOnInit() {
        this.loadData();
        this.columns = [
            { key: 'species', header: 'Especie / Estado', cellTemplate: this.speciesTpl },
            { key: 'jobType', header: 'Tipo de Trabajo' },
            { key: 'confidenceScore', header: 'Confianza', cellTemplate: this.scoreTpl },
            { key: 'createdAt', header: 'Creado' },
            { key: 'flaggedForReview', header: 'Marcado', cellTemplate: this.flaggedTpl }
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
        this.items = filtered;
    }

    onAddItem() { this.itemModal.open('add'); }

    onViewItem(item: InferenceJob) {
        this.selectedItem = item;
        this.currentIndex = this.items.indexOf(item);
        this.itemModal.open('view', item);
    }

    onEditItem(item: InferenceJob) {
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

    onDeleteItem(item: InferenceJob) {
        this.selectedItemId = item.id;
        this.confirmModal.open();
    }

    onBulkDelete(items: InferenceJob[]) {
        this.confirmModal.title = `Eliminar ${items.length} trabajos`;
        this.confirmModal.message = `¿Estás seguro de que deseas eliminar los ${items.length} trabajos de inferencia seleccionados?`;
        this.selectedItemId = items.map(i => i.id).join(',');
        this.confirmModal.open();
    }

    onConfirmDelete() {
        if (this.selectedItemId) {
            const ids = this.selectedItemId.split(',');
            ids.forEach(id => this.repo.delete(id).subscribe(() => this.loadData()));
            this.showToast(`${ids.length} trabajo(s) eliminado(s) correctamente`, 'trash', 'danger');
            this.selectedItemId = undefined;
        }
        this.loadData();
    }

    onSaveItem(item: InferenceJob) {
        if (item.id) {
            this.repo.update(item).subscribe(() => {
                this.loadData();
                this.showToast('Trabajo de inferencia actualizado correctamente', 'checkmark-circle');
            });
        } else {
            this.repo.add(item).subscribe(() => {
                this.loadData();
                this.showToast('Trabajo de inferencia agregado correctamente', 'checkmark-circle');
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
        const all = ['pending', 'running', 'completed', 'failed', 'flagged'];
        return all.filter(s => !this.activeFilters['status'].includes(s));
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            pending: 'Pendiente',
            running: 'Ejecutando',
            completed: 'Completado',
            failed: 'Fallido',
            flagged: 'Marcado'
        };
        return labels[status] || status;
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
