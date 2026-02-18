import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { ApiModalComponent } from '../../components/api-modal/api-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { ExternalApi } from '../../../../domain/models/external-api.entity';
import { ExternalApiRepository } from '../../../../domain/repositories/external-api.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { globe, code, timer, toggle, checkmarkCircle, trash, alertCircle, add } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-external-apis',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        ApiModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './external-apis.page.html',
    styleUrls: ['./external-apis.page.scss']
})
export class ExternalApisPage implements OnInit {
    apis: ExternalApi[] = [];
    private originalApis: ExternalApi[] = [];
    columns: ColumnConfig[] = [];
    activeFilters = {
        authType: ''
    };
    tableLoading = true;

    // Modal state
    isModalOpen = false;
    modalMode: 'add' | 'edit' | 'view' = 'view';
    selectedApi?: ExternalApi;
    currentIndex = -1;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.apis.length - 1; }

    // Confirmation modal state
    isConfirmModalOpen = false;
    apiToDelete?: ExternalApi;

    @ViewChild('nameTpl', { static: true }) nameTpl!: TemplateRef<any>;
    @ViewChild('authTpl', { static: true }) authTpl!: TemplateRef<any>;
    @ViewChild('endpointsTpl', { static: true }) endpointsTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    constructor(
        private apiRepository: ExternalApiRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ globe, code, timer, toggle, checkmarkCircle, trash, alertCircle, add });
    }

    ngOnInit() {
        this.loadApis();
        this.columns = [
            { key: 'name', header: 'Servicio API', cellTemplate: this.nameTpl },
            { key: 'authType', header: 'Autenticación', cellTemplate: this.authTpl },
            { key: 'rateLimit', header: 'Límite' },
            { key: 'endpoints', header: 'Endpoints Activos', cellTemplate: this.endpointsTpl }
        ];
    }

    private loadApis() {
        this.tableLoading = true;
        this.apiRepository.getApis().subscribe(data => {
            this.originalApis = data;
            this.applyFilters();
            setTimeout(() => {
                this.tableLoading = false;
                this.cdr.detectChanges();
            }, 2000);
        });
    }

    private applyFilters() {
        let filtered = [...this.originalApis];

        if (this.activeFilters.authType) {
            filtered = filtered.filter(api => api.authType === this.activeFilters.authType);
        }

        this.apis = filtered;
    }

    onAddApi() {
        this.modalMode = 'add';
        this.selectedApi = {
            id: '',
            name: '',
            base_url: '',
            description: '',
            authType: 'None',
            rateLimit: '',
            endpoints: []
        };
        this.isModalOpen = true;
    }

    onViewApi(api: ExternalApi) {
        this.modalMode = 'view';
        this.selectedApi = { ...api, endpoints: [...api.endpoints] };
        this.currentIndex = this.apis.indexOf(api);
        this.isModalOpen = true;
    }

    onEditApi(api: ExternalApi) {
        this.modalMode = 'edit';
        this.selectedApi = { ...api, endpoints: [...api.endpoints] };
        this.currentIndex = this.apis.indexOf(api);
        this.isModalOpen = true;
    }

    onPrevApi() {
        if (this.hasPrevious) {
            this.currentIndex--;
            const api = this.apis[this.currentIndex];
            this.selectedApi = { ...api, endpoints: [...api.endpoints] };
        }
    }

    onNextApi() {
        if (this.hasNext) {
            this.currentIndex++;
            const api = this.apis[this.currentIndex];
            this.selectedApi = { ...api, endpoints: [...api.endpoints] };
        }
    }

    onDeleteApi(api: ExternalApi) {
        this.apiToDelete = api;
        this.isConfirmModalOpen = true;
    }

    onBulkDelete(items: ExternalApi[]) {
        if (items.length > 0) {
            this.apiToDelete = items[0]; // Simplified
            this.isConfirmModalOpen = true;
        }
    }

    onConfirmDelete() {
        if (this.apiToDelete) {
            this.apiRepository.deleteApi(this.apiToDelete.id).subscribe(() => {
                this.loadApis();
                this.showToast(`${this.apiToDelete?.name} eliminada.`);
                this.isConfirmModalOpen = false;
            });
        }
    }

    onSaveApi(api: ExternalApi) {
        if (this.modalMode === 'add') {
            this.apiRepository.addApi(api).subscribe(() => {
                this.loadApis();
                this.showToast('Nueva API configurada correctamente.');
            });
        } else {
            this.apiRepository.updateApi(api).subscribe(() => {
                this.loadApis();
                this.showToast('Configuración actualizada.');
            });
        }
    }

    private async showToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            position: 'bottom',
            color: 'dark'
        });
        await toast.present();
    }

    onSearch(query: string) {
        if (!query) {
            this.loadApis();
            return;
        }
        const lowerQuery = query.toLowerCase();
        this.apis = this.apis.filter(a =>
            a.name.toLowerCase().includes(lowerQuery) ||
            a.base_url.toLowerCase().includes(lowerQuery)
        );
    }

    onFilterChange(type: string, value: any) {
        this.activeFilters.authType = value;
        this.applyFilters();
    }

    onResetFilters() {
        this.activeFilters.authType = '';
        this.applyFilters();
    }
}
