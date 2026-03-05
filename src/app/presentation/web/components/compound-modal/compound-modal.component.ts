import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { ChemicalCompound } from '../../../../domain/models/chemical-compound.entity';

export type CompoundModalMode = 'view' | 'edit';

@Component({
    selector: 'app-compound-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, IonModal, ConfirmationModalComponent],
    templateUrl: './compound-modal.component.html',
    styleUrls: ['./compound-modal.component.scss']
})
export class CompoundModalComponent implements OnInit, OnChanges {
    @Input() isOpen = false;
    @Input() mode: CompoundModalMode = 'view';
    @Input() compound?: ChemicalCompound;
    @Input() hasPrevious = false;
    @Input() hasNext = false;

    @Output() saved = new EventEmitter<ChemicalCompound>();
    @Output() closed = new EventEmitter<void>();
    @Output() prev = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    compoundForm!: FormGroup;
    showConfirmModal = false;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.initForm();
    }

    ngOnChanges() {
        if (this.compound && this.compoundForm) {
            this.compoundForm.patchValue(this.compound);
        }
    }

    private initForm() {
        this.compoundForm = this.fb.group({
            id: [''],
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            iupacName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(400)]],
            molecularFormula: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9().+\-\[\]]+$/)]],
            molecularWeight: ['', [Validators.required, Validators.pattern(/^\d+\.?\d*\s*(g\/mol)?$/)]],
            pubchemCid: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
            smiles: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
            inchi: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
            inchiKey: ['', [Validators.required, Validators.minLength(27), Validators.maxLength(27), Validators.pattern(/^[A-Z]{14}-[A-Z]{10}-[A-Z]$/)]]
        });
    }

    open(mode: CompoundModalMode, compound: ChemicalCompound) {
        this.mode = mode;
        this.compound = compound;
        this.isOpen = true;
        if (this.compoundForm) {
            this.compoundForm.patchValue(compound);
        }
    }

    toggleEdit() {
        this.mode = 'edit';
    }

    close() {
        this.isOpen = false;
        this.closed.emit();
    }

    onSave() {
        this.compoundForm.markAllAsTouched();
        if (this.compoundForm.valid) {
            if (this.mode === 'edit') {
                this.showConfirmModal = true;
            } else {
                this.executeSave();
            }
        }
    }

    executeSave() {
        this.saved.emit(this.compoundForm.value);
        this.showConfirmModal = false;
        this.close();
    }

    get isReadOnly(): boolean {
        return this.mode === 'view';
    }
}
