import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-plant-info-modal',
    templateUrl: './plant-info-modal.component.html',
    styleUrls: ['./plant-info-modal.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class PlantInfoModalComponent {
    @Input() isOpen: boolean = false;
    @Input() plant: any = {
        image: '',
        scientificName: '',
        commonName: '',
        description: '',
        traditionalUses: [],
        warning: ''
    };

    @Output() closeModal = new EventEmitter<void>();

    constructor() { }

    onClose() {
        this.closeModal.emit();
    }
}
