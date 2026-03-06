import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { DataPipeline } from '../../../../domain/models/data-pipeline.entity';

export type DataPipelineModalMode = 'view' | 'edit' | 'add';

@Component({
    selector: 'app-data-pipeline-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        IonModal,
        ConfirmationModalComponent
    ],
    templateUrl: './data-pipeline-modal.component.html',
    styleUrls: ['./data-pipeline-modal.component.scss']
})
export class DataPipelineModalComponent implements OnInit, OnChanges {
    @Input() isOpen = false;
    @Input() mode: DataPipelineModalMode = 'view';
    @Input() hasPrevious = false;
    @Input() hasNext = false;
    @Input() item?: DataPipeline;

    @Output() saved = new EventEmitter<DataPipeline>();
    @Output() closed = new EventEmitter<void>();
    @Output() prev = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    form!: FormGroup;
    showConfirmModal = false;

    constructor(private fb: FormBuilder) {}

    ngOnInit() { this.initForm(); }

    ngOnChanges() {
        if (this.item && this.form) {
            this.form.patchValue(this.item);
        }
    }

    private initForm() {
        this.form = this.fb.group({
            id: [''],
            name: ['', [Validators.required, Validators.minLength(2)]],
            source: ['', Validators.required],
            status: ['idle', Validators.required],
            lastSync: [''],
            nextSync: [''],
            recordsSynced: [0, [Validators.required, Validators.min(0)]],
            errorLog: ['']
        });
        if (this.item) { this.form.patchValue(this.item); }
    }

    open(mode: DataPipelineModalMode, item?: DataPipeline) {
        this.mode = mode;
        this.item = item;
        this.isOpen = true;
        if (this.form) {
            if (item) {
                this.form.patchValue(item);
            } else {
                this.form.reset({
                    id: '',
                    name: '',
                    source: '',
                    status: 'idle',
                    lastSync: '',
                    nextSync: '',
                    recordsSynced: 0,
                    errorLog: ''
                });
            }
        }
    }

    close() { this.isOpen = false; this.closed.emit(); }
    onDidDismiss() { this.isOpen = false; this.closed.emit(); }

    onSave() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            if (this.mode === 'edit') {
                this.showConfirmModal = true;
            } else {
                this.executeSave();
            }
        }
    }

    executeSave() {
        const item: DataPipeline = { ...this.item, ...this.form.value };
        this.saved.emit(item);
        this.showConfirmModal = false;
        this.close();
    }

    toggleEdit() { this.mode = 'edit'; }
    get isReadOnly(): boolean { return this.mode === 'view'; }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            active: 'Activo',
            idle: 'Inactivo',
            error: 'Error',
            syncing: 'Sincronizando'
        };
        return labels[status] || status;
    }
}
