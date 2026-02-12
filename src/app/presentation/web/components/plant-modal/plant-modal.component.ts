import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Plant } from '../../../../domain/models/plant.entity';

export type PlantModalMode = 'view' | 'edit' | 'add';

@Component({
    selector: 'app-plant-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        IonModal,
        ConfirmationModalComponent
    ],
    templateUrl: './plant-modal.component.html',
    styleUrls: ['./plant-modal.component.scss']
})
export class PlantModalComponent implements OnInit {
    @Input() isOpen = false;
    @Input() mode: PlantModalMode = 'view';
    @Input() plant?: Plant;

    @Output() saved = new EventEmitter<Plant>();
    @Output() closed = new EventEmitter<void>();

    plantForm!: FormGroup;
    showConfirmModal = false;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.plantForm = this.fb.group({
            id: [''],
            commonName: ['', Validators.required],
            scientificName: ['', Validators.required],
            description: ['', Validators.required],
            region: ['', Validators.required],
            imageUrl: ['', Validators.required],
            properties: [[]],
            identifyingFeatures: [[]]
        });

        if (this.plant) {
            this.plantForm.patchValue({
                ...this.plant,
                properties: Array.isArray(this.plant.properties) ? this.plant.properties.join(', ') : this.plant.properties,
                identifyingFeatures: Array.isArray(this.plant.identifyingFeatures) ? this.plant.identifyingFeatures.join(', ') : this.plant.identifyingFeatures
            });
        }
    }

    open(mode: PlantModalMode, plant?: Plant) {
        this.mode = mode;
        this.plant = plant;
        this.isOpen = true;

        if (this.plantForm) {
            if (plant) {
                this.plantForm.patchValue({
                    ...plant,
                    properties: Array.isArray(plant.properties) ? plant.properties.join(', ') : plant.properties,
                    identifyingFeatures: Array.isArray(plant.identifyingFeatures) ? plant.identifyingFeatures.join(', ') : plant.identifyingFeatures
                });
            } else {
                this.plantForm.reset();
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
        if (this.plantForm.valid) {
            if (this.mode === 'edit') {
                this.showConfirmModal = true;
            } else {
                this.executeSave();
            }
        }
    }

    executeSave() {
        const formValue = this.plantForm.value;
        const updatedPlant: Plant = {
            ...this.plant,
            ...formValue,
            properties: Array.isArray(formValue.properties) ? formValue.properties : (formValue.properties as string).split(',').map(s => s.trim()),
            identifyingFeatures: Array.isArray(formValue.identifyingFeatures) ? formValue.identifyingFeatures : (formValue.identifyingFeatures as string).split(',').map(s => s.trim())
        };
        this.saved.emit(updatedPlant);
        this.showConfirmModal = false;
        this.close();
    }

    toggleEdit() {
        this.mode = 'edit';
    }

    get isReadOnly(): boolean {
        return this.mode === 'view';
    }
}
