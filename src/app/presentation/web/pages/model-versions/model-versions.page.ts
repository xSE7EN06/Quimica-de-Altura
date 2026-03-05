import { Component, ViewChild, TemplateRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { ModelVersionModalComponent } from '../../components/model-version-modal/model-version-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ModelVersion } from '../../../../domain/models/model-version.entity';
import { ModelVersionRepository } from '../../../../domain/repositories/model-version.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, trash, alertCircle } from 'ionicons/icons';

@Component({
    selector: 'app-model-versions',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        ModelVersionModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './model-versions.page.html',
    styleUrls: ['./model-versions.page.scss']
})
export class ModelVersionsPage implements OnInit {
    items: ModelVersion[] = [];
    private originalItems: ModelVersion[] = [];
    columns: ColumnConfig[] = [];
    tableLoading = true;
    searchTerm = '';

    selectedType = '';
    selectedStatus = '';
    activeFilters = { type: '', status: '' };

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('accuracyTpl', { static: true }) accuracyTpl!: TemplateRef<any>;
    @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
    @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
    @ViewChild(ModelVersionModalComponent) itemModal!: ModelVersionModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedItemId?: string;
    currentIndex = -1;
    selectedItem?: ModelVersion;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.items.length - 1; }

    constructor(
        private repository: ModelVersionRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ checkmarkCircle, trash, alertCircle });
    }

    ngOnInit() {
        this.loadItems();
        this.columns = [
            { key: 'name', header: 'Modelo', cellTemplate: this.nameTpl },
            { key: 'version', header: 'Versión' },
            { key: 'accuracy', header: 'Precisión', cellTemplate: this.accuracyTpl },
            { key: 'status', header: 'Estado', cellTemplate: this.statusTpl },
            { key: 'deployedAt', header: 'Desplegado' }
        ];
    }

    private loadItems() {
        this.tableLoading = true;
        this.repository.getAll().subscribe(data => {
            this.originalItems = data;
            this.applyFilters();
            setTimeout(() => {
                this.tableLoading = false;
                this.cdr.detectChanges();
            }, 800);
        });
    }

    private applyFilters() {
        let filtered = [...this.originalItems];
        if (this.activeFilters.type) {
            filtered = filtered.filter(i => i.type === this.activeFilters.type);
        }
        if (this.activeFilters.status) {
            filtered = filtered.filter(i => i.status === this.activeFilters.status);
        }
        this.items = filtered;
    }

    onSearch(term: string) {
        if (term) {
            const t = term.toLowerCase();
            this.items = this.originalItems.filter(i =>
                i.name.toLowerCase().includes(t) || i.version.toLowerCase().includes(t)
            );
        } else {
            this.applyFilters();
        }
    }

    onViewItem(item: ModelVersion) {
        this.selectedItem = item;
        this.currentIndex = this.items.indexOf(item);
        this.itemModal.open('view', item);
    }

    onEditItem(item: ModelVersion) {
        this.selectedItem = item;
        this.currentIndex = this.items.indexOf(item);
        this.itemModal.open('edit', item);
    }

    onAddItem() {
        this.itemModal.open('add');
    }

    onPrev() {
        if (this.hasPrevious) {
            this.currentIndex--;
            this.selectedItem = this.items[this.currentIndex];
            this.itemModal.open('view', this.selectedItem);
        }
    }

    onNext() {
        if (this.hasNext) {
            this.currentIndex++;
            this.selectedItem = this.items[this.currentIndex];
            this.itemModal.open('view', this.selectedItem);
        }
    }

    onDeleteItem(items: ModelVersion[]) {
        this.selectedItemId = items.map(i => i.id).join(',');
        this.confirmModal.open();
    }

    onConfirmDelete() {
        if (this.selectedItemId) {
            const ids = this.selectedItemId.split(',');
            ids.forEach(id => {
                this.repository.delete(id).subscribe(() => this.loadItems());
            });
            this.showToast(`${ids.length} versión(es) eliminada(s) correctamente`, 'trash', 'danger');
            this.selectedItemId = undefined;
        }
    }

    onSaveItem(item: ModelVersion) {
        if (item.id) {
            this.repository.update(item).subscribe(() => {
                this.loadItems();
                this.showToast('Versión de modelo actualizada correctamente', 'checkmark-circle');
            });
        } else {
            this.repository.add(item).subscribe(() => {
                this.loadItems();
                this.showToast('Versión de modelo agregada correctamente', 'checkmark-circle');
            });
        }
    }

    onFilterChange(type: string, value: string) {
        if (type === 'type') {
            this.activeFilters.type = value;
        } else if (type === 'status') {
            this.activeFilters.status = value;
        }
        this.applyFilters();
    }

    onResetFilters() {
        this.activeFilters = { type: '', status: '' };
        this.selectedType = '';
        this.selectedStatus = '';
        this.applyFilters();
    }

    getTypeBadgeClass(type: string): string {
        const map: Record<string, string> = {
            'image-classifier': 'badge-purple',
            'nlp': 'badge-blue',
            'inference-pipeline': 'badge-orange'
        };
        return map[type] || '';
    }

    getTypeLabel(type: string): string {
        const map: Record<string, string> = {
            'image-classifier': 'Image Classifier',
            'nlp': 'NLP',
            'inference-pipeline': 'Inference Pipeline'
        };
        return map[type] || type;
    }

    getStatusBadgeClass(status: string): string {
        const map: Record<string, string> = {
            'active': 'badge-green',
            'testing': 'badge-blue',
            'deprecated': 'badge-gray'
        };
        return map[status] || '';
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
