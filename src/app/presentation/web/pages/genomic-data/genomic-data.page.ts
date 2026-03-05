import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { GenomicDataModalComponent } from '../../components/genomic-data-modal/genomic-data-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { GenomicData } from '../../../../domain/models/genomic-data.entity';
import { GenomicDataRepository } from '../../../../domain/repositories/genomic-data.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
    selector: 'app-genomic-data',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        GenomicDataModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './genomic-data.page.html',
    styleUrls: ['./genomic-data.page.scss']
})
export class GenomicDataPage implements OnInit {
    items: GenomicData[] = [];
    private originalItems: GenomicData[] = [];
    columns: ColumnConfig[] = [];
    activeFilters = {
        status: [] as string[]
    };
    selectedStatus = '';
    searchTerm = '';
    tableLoading = true;

    @ViewChild('speciesTpl', { static: true }) speciesTpl!: TemplateRef<any>;
    @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
    @ViewChild(GenomicDataModalComponent) itemModal!: GenomicDataModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedItemId?: string;
    currentIndex = -1;
    selectedItem?: GenomicData;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

    constructor(
        private repository: GenomicDataRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ checkmarkCircle, trash, alertCircle });
    }

    ngOnInit() {
        this.loadData();
        this.columns = [
            { key: 'species', header: 'Especie', cellTemplate: this.speciesTpl },
            { key: 'genbankId', header: 'GenBank ID' },
            { key: 'keggPathway', header: 'Vía KEGG' },
            { key: 'uploadedAt', header: 'Fecha de Carga' }
        ];
    }

    private loadData() {
        this.tableLoading = true;
        this.repository.getAll().subscribe(data => {
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

        if (this.activeFilters.status.length > 0) {
            filtered = filtered.filter(item =>
                this.activeFilters.status.includes(item.status)
            );
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.species.toLowerCase().includes(term) ||
                item.genbankId.toLowerCase().includes(term) ||
                item.keggPathway.toLowerCase().includes(term)
            );
        }

        this.items = filtered;
    }

    onSearch(term: string) {
        this.searchTerm = term;
        this.applyFilters();
    }

    onAddItem() {
        this.itemModal.open('add');
    }

    onViewItem(item: GenomicData) {
        this.selectedItem = item;
        this.currentIndex = this.items.indexOf(item);
        this.itemModal.open('view', item);
    }

    onEditItem(item: GenomicData) {
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

    onDeleteItem(item: GenomicData) {
        this.selectedItemId = item.id;
        this.confirmModal.open();
    }

    onBulkDelete(items: GenomicData[]) {
        this.confirmModal.title = `Eliminar ${items.length} registros`;
        this.confirmModal.message = `¿Estás seguro de que deseas eliminar los ${items.length} registros seleccionados?`;
        this.selectedItemId = items.map(i => i.id).join(',');
        this.confirmModal.open();
    }

    onConfirmDelete() {
        if (this.selectedItemId) {
            const ids = this.selectedItemId.split(',');
            ids.forEach(id => {
                this.repository.delete(id).subscribe(() => this.loadData());
            });
            this.showToast(`${ids.length} registro(s) eliminado(s) correctamente`, 'trash', 'danger');
            this.selectedItemId = undefined;
        }
        this.loadData();
    }

    onSaveItem(item: GenomicData) {
        if (item.id) {
            this.repository.update(item).subscribe(() => {
                this.loadData();
                this.showToast('Registro actualizado correctamente', 'checkmark-circle');
            });
        } else {
            this.repository.add(item).subscribe(() => {
                this.loadData();
                this.showToast('Registro agregado correctamente', 'checkmark-circle');
            });
        }
    }

    onFilterChange(type: string, value: any) {
        if (type === 'status') {
            if (value && value !== '' && !this.activeFilters.status.includes(value)) {
                this.activeFilters.status.push(value);
                this.applyFilters();
            }
            this.selectedStatus = '';
            this.cdr.detectChanges();
        }
    }

    getAvailableStatuses(): string[] {
        const all = ['pending', 'processed', 'error'];
        return all.filter(v => !this.activeFilters.status.includes(v));
    }

    removeFilter(type: string, value: string) {
        const idx = this.activeFilters[type as keyof typeof this.activeFilters].indexOf(value);
        if (idx > -1) {
            this.activeFilters[type as keyof typeof this.activeFilters].splice(idx, 1);
            this.applyFilters();
        }
    }

    onResetFilters() {
        this.activeFilters.status = [];
        this.searchTerm = '';
        this.applyFilters();
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            pending: 'Pendiente',
            processed: 'Procesado',
            error: 'Error'
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
