import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { InferenceJob } from '../../../../domain/models/inference-job.entity';

export type InferenceJobModalMode = 'view' | 'edit' | 'add';

@Component({
    selector: 'app-inference-job-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        IonModal,
        ConfirmationModalComponent
    ],
    templateUrl: './inference-job-modal.component.html',
    styleUrls: ['./inference-job-modal.component.scss']
})
export class InferenceJobModalComponent implements OnInit, OnChanges {
    @Input() isOpen = false;
    @Input() mode: InferenceJobModalMode = 'view';
    @Input() hasPrevious = false;
    @Input() hasNext = false;
    @Input() item?: InferenceJob;

    @Output() saved = new EventEmitter<InferenceJob>();
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
            species: ['', [Validators.required, Validators.minLength(2)]],
            jobType: ['', Validators.required],
            status: ['pending', Validators.required],
            confidenceScore: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
            output: [''],
            flaggedForReview: [false],
            approvedBy: [''],
            createdAt: [''],
            completedAt: ['']
        });
        if (this.item) { this.form.patchValue(this.item); }
    }

    open(mode: InferenceJobModalMode, item?: InferenceJob) {
        this.mode = mode;
        this.item = item;
        this.isOpen = true;
        if (this.form) {
            if (item) {
                this.form.patchValue(item);
            } else {
                this.form.reset({
                    id: '',
                    species: '',
                    jobType: '',
                    status: 'pending',
                    confidenceScore: 0,
                    output: '',
                    flaggedForReview: false,
                    approvedBy: '',
                    createdAt: new Date().toISOString(),
                    completedAt: ''
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
        const item: InferenceJob = { ...this.item, ...this.form.value };
        this.saved.emit(item);
        this.showConfirmModal = false;
        this.close();
    }

    toggleEdit() { this.mode = 'edit'; }
    get isReadOnly(): boolean { return this.mode === 'view'; }

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
}
