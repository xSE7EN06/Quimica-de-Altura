import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal, IonToggle } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { ExternalApi, ExternalApiEndpoint } from '../../../../domain/models/external-api.entity';

@Component({
    selector: 'app-api-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        IonModal,
        IonToggle,
        ConfirmationModalComponent
    ],
    templateUrl: './api-modal.component.html',
    styleUrls: ['./api-modal.component.scss']
})
export class ApiModalComponent {
    @Input() isOpen = false;
    @Input() mode: 'add' | 'edit' | 'view' = 'view';
    @Input() api: ExternalApi = this.createEmptyApi();
    @Input() hasPrevious = false;
    @Input() hasNext = false;

    @Output() saved = new EventEmitter<ExternalApi>();
    @Output() closed = new EventEmitter<void>();
    @Output() prev = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    @ViewChild('apiForm') apiForm!: NgForm;

    showConfirmModal = false;

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
        if (this.apiForm) {
            this.apiForm.control.markAllAsTouched();
            if (!this.apiForm.valid) return;
        }
        if (this.mode === 'edit') {
            this.showConfirmModal = true;
        } else {
            this.executeSave();
        }
    }

    executeSave() {
        this.saved.emit(this.api);
        this.showConfirmModal = false;
        this.close();
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
