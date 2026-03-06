import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { EthnobotanicalModalComponent } from '../../components/ethnobotanical-modal/ethnobotanical-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { EthnobotanicalRecord } from '../../../../domain/models/ethnobotanical-record.entity';
import { EthnobotanicalRecordRepository } from '../../../../domain/repositories/ethnobotanical-record.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
    selector: 'app-ethnobotanical',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        EthnobotanicalModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './ethnobotanical.page.html',
    styleUrls: ['./ethnobotanical.page.scss']
})
export class EthnobotanicalPage implements OnInit {
    items: EthnobotanicalRecord[] = [];
    private originalItems: EthnobotanicalRecord[] = [];
    columns: ColumnConfig[] = [];
    activeFilters = {
        evidenceLevel: [] as string[]
    };
    selectedEvidenceLevel = '';
    searchTerm = '';
    tableLoading = true;

    @ViewChild('speciesTpl', { static: true }) speciesTpl!: TemplateRef<any>;
    @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
    @ViewChild(EthnobotanicalModalComponent) itemModal!: EthnobotanicalModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedItemId?: string;
    currentIndex = -1;
    selectedItem?: EthnobotanicalRecord;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

    constructor(
        private repository: EthnobotanicalRecordRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ checkmarkCircle, trash, alertCircle });
    }

    ngOnInit() {
        this.loadData();
        this.columns = [
            { key: 'species', header: 'Especie', cellTemplate: this.speciesTpl },
            { key: 'community', header: 'Comunidad' },
            { key: 'region', header: 'Región' },
            { key: 'conditionTreated', header: 'Condición Tratada' }
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

        if (this.activeFilters.evidenceLevel.length > 0) {
            filtered = filtered.filter(item =>
                this.activeFilters.evidenceLevel.includes(item.evidenceLevel)
            );
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.species.toLowerCase().includes(term) ||
                item.community.toLowerCase().includes(term) ||
                item.region.toLowerCase().includes(term)
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

    onViewItem(item: EthnobotanicalRecord) {
        this.selectedItem = item;
        this.currentIndex = this.items.indexOf(item);
        this.itemModal.open('view', item);
    }

    onEditItem(item: EthnobotanicalRecord) {
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

    onDeleteItem(item: EthnobotanicalRecord) {
        this.selectedItemId = item.id;
        this.confirmModal.open();
    }

    onBulkDelete(items: EthnobotanicalRecord[]) {
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

    onSaveItem(item: EthnobotanicalRecord) {
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
        if (type === 'evidenceLevel') {
            if (value && value !== '' && !this.activeFilters.evidenceLevel.includes(value)) {
                this.activeFilters.evidenceLevel.push(value);
                this.applyFilters();
            }
            this.selectedEvidenceLevel = '';
            this.cdr.detectChanges();
        }
    }

    getAvailableEvidenceLevels(): string[] {
        const all = ['L1', 'L2', 'L3', 'L4'];
        return all.filter(v => !this.activeFilters.evidenceLevel.includes(v));
    }

    removeFilter(type: string, value: string) {
        const idx = this.activeFilters[type as keyof typeof this.activeFilters].indexOf(value);
        if (idx > -1) {
            this.activeFilters[type as keyof typeof this.activeFilters].splice(idx, 1);
            this.applyFilters();
        }
    }

    onResetFilters() {
        this.activeFilters.evidenceLevel = [];
        this.searchTerm = '';
        this.applyFilters();
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
