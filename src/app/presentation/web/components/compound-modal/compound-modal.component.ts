import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class CompoundModalComponent implements OnInit {
    @Input() isOpen = false;
    @Input() mode: CompoundModalMode = 'view';
    @Input() compound?: ChemicalCompound;

    @Output() saved = new EventEmitter<ChemicalCompound>();
    @Output() closed = new EventEmitter<void>();

    compoundForm!: FormGroup;
    showConfirmModal = false;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.compoundForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            iupacName: ['', Validators.required],
            molecularFormula: ['', Validators.required],
            molecularWeight: ['', Validators.required],
            pubchemCid: ['', Validators.required],
            smiles: ['', Validators.required],
            inchi: ['', Validators.required],
            inchiKey: ['', Validators.required]
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
