import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { ApiModalComponent } from '../../components/api-modal/api-modal.component';
import { ExternalApi } from '../../../../domain/models/external-api.entity';
import { ExternalApiRepository } from '../../../../domain/repositories/external-api.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { globe, code, timer, toggle, checkmarkCircle, trash, alertCircle, add } from 'ionicons/icons';

@Component({
    selector: 'app-external-apis',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        DataTableComponent,
        ApiModalComponent
    ],
    templateUrl: './external-apis.page.html',
    styleUrls: ['./external-apis.page.scss']
})
export class ExternalApisPage implements OnInit {
    apis: ExternalApi[] = [];
    columns: ColumnConfig[] = [];

    // Modal state
    isModalOpen = false;
    modalMode: 'add' | 'edit' | 'view' = 'view';
    selectedApi?: ExternalApi;

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
            { key: 'endpoints', header: 'Endpoints Activos', cellTemplate: this.endpointsTpl },
            { key: 'actions', header: 'Acciones', cellTemplate: this.actionsTpl }
        ];
    }

    private loadApis() {
        this.apiRepository.getApis().subscribe(data => {
            this.apis = data;
            this.cdr.detectChanges();
        });
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
        this.isModalOpen = true;
    }

    onEditApi(api: ExternalApi) {
        this.modalMode = 'edit';
        this.selectedApi = { ...api, endpoints: [...api.endpoints] };
        this.isModalOpen = true;
    }

    onDeleteApi(api: ExternalApi) {
        if (confirm(`¿Estás seguro de que deseas eliminar la configuración de ${api.name}?`)) {
            this.apiRepository.deleteApi(api.id).subscribe(() => {
                this.loadApis();
                this.showToast(`${api.name} eliminada.`);
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
}
