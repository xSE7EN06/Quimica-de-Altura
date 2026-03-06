import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { EthnobotanicalRecord } from '../../../../domain/models/ethnobotanical-record.entity';

export type EthnobotanicalModalMode = 'view' | 'edit' | 'add';

@Component({
    selector: 'app-ethnobotanical-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        IonModal,
        ConfirmationModalComponent
    ],
    templateUrl: './ethnobotanical-modal.component.html',
    styleUrls: ['./ethnobotanical-modal.component.scss']
})
export class EthnobotanicalModalComponent implements OnInit, OnChanges {
    @Input() isOpen = false;
    @Input() mode: EthnobotanicalModalMode = 'view';
    @Input() hasPrevious = false;
    @Input() hasNext = false;
    @Input() item?: EthnobotanicalRecord;

    @Output() saved = new EventEmitter<EthnobotanicalRecord>();
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
            community: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            region: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            conditionTreated: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
            preparationMethod: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(300)]],
            rawMaterialPart: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            documenter: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            year: [null, [Validators.required, Validators.min(1900), Validators.max(2100)]],
            evidenceLevel: ['', Validators.required],
            notes: ['']
        });

        if (this.item) {
            this.form.patchValue(this.item);
        }
    }

    open(mode: EthnobotanicalModalMode, item?: EthnobotanicalRecord) {
        this.mode = mode;
        this.item = item;
        this.isOpen = true;

        if (this.form) {
            if (item) {
                this.form.patchValue(item);
            } else {
                this.form.reset();
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
        const record: EthnobotanicalRecord = { ...this.item, ...this.form.value };
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

    getEvidenceBadgeClass(level: string): string {
        const map: Record<string, string> = {
            'L1': 'level-l1',
            'L2': 'level-l2',
            'L3': 'level-l3',
            'L4': 'level-l4'
        };
        return map[level] || '';
    }
}
