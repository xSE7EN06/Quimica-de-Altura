import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
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
    @Input() hasPrevious = false;
    @Input() hasNext = false;
    @Input() plant?: Plant;

    @Output() saved = new EventEmitter<Plant>();
    @Output() closed = new EventEmitter<void>();
    @Output() prev = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    plantForm!: FormGroup;
    showConfirmModal = false;
    isDragOver = false;
    uploadedImageUrl: string | null = null;
    imageResolution = '';

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.plantForm = this.fb.group({
            id: [''],
            commonName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            scientificName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
            description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
            region: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            imageUrl: ['', Validators.required],
            properties: [[]],
            identifyingFeatures: [[]]
        });

        if (this.plant) {
            this.updateForm(this.plant);
        }
    }

    private updateForm(plant: Plant) {
        this.plantForm.patchValue({
            ...plant,
            properties: Array.isArray(plant.properties) ? plant.properties.join(', ') : plant.properties,
            identifyingFeatures: Array.isArray(plant.identifyingFeatures) ? plant.identifyingFeatures.join(', ') : plant.identifyingFeatures
        });
        
        // Set uploaded image URL if it exists
        if (plant.imageUrl) {
            this.uploadedImageUrl = plant.imageUrl;
            this.loadImageResolution(plant.imageUrl);
        } else {
            this.uploadedImageUrl = null;
            this.imageResolution = '';
        }
    }

    private loadImageResolution(imageUrl: string) {
        const img = new Image();
        img.onload = () => {
            this.imageResolution = `${img.width} × ${img.height} px`;
        };
        img.onerror = () => {
            // If image fails to load (e.g., CORS issue), just show empty resolution
            this.imageResolution = '';
        };
        img.src = imageUrl;
    }

    ngOnChanges() {
        if (this.plant && this.plantForm) {
            this.updateForm(this.plant);
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
                // Set uploaded image URL if it exists
                if (plant.imageUrl) {
                    this.uploadedImageUrl = plant.imageUrl;
                    this.loadImageResolution(plant.imageUrl);
                } else {
                    this.uploadedImageUrl = null;
                    this.imageResolution = '';
                }
            } else {
                this.plantForm.reset();
                this.uploadedImageUrl = null;
                this.imageResolution = '';
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
        this.plantForm.markAllAsTouched();
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

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.handleFile(input.files[0]);
        }
    }

    private handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e.target?.result as string;
            this.uploadedImageUrl = result;
            
            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                this.imageResolution = `${img.width} × ${img.height} px`;
                // Update form control with data URL
                this.plantForm.patchValue({ imageUrl: result });
            };
            img.src = result;
        };
        reader.readAsDataURL(file);
    }

    removeImage(event: Event) {
        event.stopPropagation();
        this.uploadedImageUrl = null;
        this.imageResolution = '';
        this.plantForm.patchValue({ imageUrl: '' });
    }
}
