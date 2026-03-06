import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { ModelVersion } from '../../../../domain/models/model-version.entity';

export type ModelVersionModalMode = 'view' | 'edit' | 'add';

@Component({
    selector: 'app-model-version-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        IonModal,
        ConfirmationModalComponent
    ],
    templateUrl: './model-version-modal.component.html',
    styleUrls: ['./model-version-modal.component.scss']
})
export class ModelVersionModalComponent implements OnInit, OnChanges {
    @Input() item?: ModelVersion;
    @Input() hasPrevious = false;
    @Input() hasNext = false;

    @Output() saved = new EventEmitter<ModelVersion>();
    @Output() closed = new EventEmitter<void>();
    @Output() prev = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    isOpen = false;
    mode: ModelVersionModalMode = 'view';
    itemForm!: FormGroup;
    showConfirmModal = false;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.initForm();
    }

    ngOnChanges() {
        if (this.item && this.itemForm) {
            this.itemForm.patchValue(this.item);
        }
    }

    private initForm() {
        this.itemForm = this.fb.group({
            id: [''],
            name: ['', [Validators.required, Validators.minLength(2)]],
            version: ['', [Validators.required]],
            type: ['image-classifier', Validators.required],
            accuracy: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
            status: ['active', Validators.required],
            deployedAt: ['', Validators.required],
            notes: [''],
            canRollback: [false]
        });
    }

    open(mode: ModelVersionModalMode, item?: ModelVersion) {
        this.mode = mode;
        this.item = item;
        this.isOpen = true;

        if (this.itemForm) {
            if (item) {
                this.itemForm.patchValue(item);
            } else {
                this.itemForm.reset({
                    id: '',
                    name: '',
                    version: '',
                    type: 'image-classifier',
                    accuracy: 0,
                    status: 'active',
                    deployedAt: '',
                    notes: '',
                    canRollback: false
                });
            }
        }
    }

    close() {
        this.isOpen = false;
        this.closed.emit();
    }

    onDidDismiss() {
        this.isOpen = false;
        this.closed.emit();
    }

    toggleEdit() {
        this.mode = 'edit';
    }

    get isReadOnly(): boolean {
        return this.mode === 'view';
    }

    onSave() {
        this.itemForm.markAllAsTouched();
        if (this.itemForm.valid) {
            if (this.mode === 'edit') {
                this.showConfirmModal = true;
            } else {
                this.executeSave();
            }
        }
    }

    executeSave() {
        const formValue = this.itemForm.value;
        const updated: ModelVersion = {
            ...this.item,
            ...formValue,
            accuracy: parseFloat(formValue.accuracy)
        };
        this.saved.emit(updated);
        this.showConfirmModal = false;
        this.close();
    }

    getStatusBadgeClass(status: string): string {
        const map: Record<string, string> = {
            active: 'badge-green',
            testing: 'badge-blue',
            deprecated: 'badge-gray'
        };
        return map[status] || '';
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
}
