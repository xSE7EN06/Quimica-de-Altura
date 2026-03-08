import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { GenomicData } from '../../../../domain/models/genomic-data.entity';

export type GenomicDataModalMode = 'view' | 'edit' | 'add';

@Component({
    selector: 'app-genomic-data-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        IonModal,
        ConfirmationModalComponent
    ],
    templateUrl: './genomic-data-modal.component.html',
    styleUrls: ['./genomic-data-modal.component.scss']
})
export class GenomicDataModalComponent implements OnInit, OnChanges {
    @Input() isOpen = false;
    @Input() mode: GenomicDataModalMode = 'view';
    @Input() hasPrevious = false;
    @Input() hasNext = false;
    @Input() item?: GenomicData;

    @Output() saved = new EventEmitter<GenomicData>();
    @Output() closed = new EventEmitter<void>();
    @Output() prev = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    form!: FormGroup;
    showConfirmModal = false;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.initForm();
    }

    ngOnChanges() {
        if (this.item && this.form) {
            this.form.patchValue(this.item);
        }
    }

    private initForm() {
        this.form = this.fb.group({
            id: [''],
            species: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            fastaFile: ['', Validators.required],
            genbankId: ['', Validators.required],
            keggPathway: ['', Validators.required],
            enzymeHomology: ['', Validators.required],
            geneCluster: ['', Validators.required],
            blastResults: ['', Validators.required],
            uploadedAt: ['', Validators.required],
            status: ['pending', Validators.required]
        });

        if (this.item) {
            this.form.patchValue(this.item);
        }
    }

    open(mode: GenomicDataModalMode, item?: GenomicData) {
        this.mode = mode;
        this.item = item;
        this.isOpen = true;

        if (this.form) {
            if (item) {
                this.form.patchValue(item);
            } else {
                this.form.reset({ status: 'pending' });
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
        const record: GenomicData = { ...this.item, ...this.form.value };
        this.saved.emit(record);
        this.showConfirmModal = false;
        this.close();
    }

    toggleEdit() {
        this.mode = 'edit';
    }

    get isReadOnly(): boolean {
        return this.mode === 'view';
    }

    getStatusLabel(status: string): string {
        const labels: Record<string, string> = {
            pending: 'Pendiente',
            processed: 'Procesado',
            error: 'Error'
        };
        return labels[status] || status;
    }
}
