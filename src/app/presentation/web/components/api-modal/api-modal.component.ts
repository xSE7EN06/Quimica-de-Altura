import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal, IonToggle } from '@ionic/angular/standalone';
import { ExternalApi, ExternalApiEndpoint } from '../../../../domain/models/external-api.entity';

@Component({
    selector: 'app-api-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        IonModal,
        IonToggle
    ],
    templateUrl: './api-modal.component.html',
    styleUrls: ['./api-modal.component.scss']
})
export class ApiModalComponent {
    @Input() isOpen = false;
    @Input() mode: 'add' | 'edit' | 'view' = 'view';
    @Input() api: ExternalApi = this.createEmptyApi();

    @Output() saved = new EventEmitter<ExternalApi>();
    @Output() closed = new EventEmitter<void>();

    constructor() { }

    private createEmptyApi(): ExternalApi {
        return {
            id: '',
            name: '',
            base_url: '',
            description: '',
            authType: 'None',
            rateLimit: '',
            endpoints: []
        };
    }

    close() {
        this.isOpen = false;
        this.closed.emit();
    }

    onSave() {
        if (this.api.name && this.api.base_url) {
            this.saved.emit(this.api);
            this.close();
        }
    }

    addEndpoint() {
        const newEndpoint: ExternalApiEndpoint = {
            id: Date.now().toString(),
            name: '',
            path: '',
            method: 'GET',
            description: '',
            isActive: true
        };
        this.api.endpoints.push(newEndpoint);
    }

    removeEndpoint(index: number) {
        this.api.endpoints.splice(index, 1);
    }

    setMode(newMode: 'add' | 'edit' | 'view') {
        this.mode = newMode;
    }
}
