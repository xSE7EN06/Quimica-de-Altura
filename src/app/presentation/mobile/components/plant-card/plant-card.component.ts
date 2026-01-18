import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
    selector: 'app-plant-card',
    standalone: true,
    imports: [CommonModule, IonicModule],
    templateUrl: './plant-card.component.html',
    styleUrls: ['./plant-card.component.scss']
})
export class PlantCardComponent {
    @Input() name: string = '';
    @Input() subtitle: string = '';
    @Input() imageUrl: string = '';
    @Input() buttonText: string = 'Ver detalle';

    @Output() action = new EventEmitter<void>();

    constructor() {
        addIcons({ alertCircleOutline }); // Using alert-circle-outline for the "!" icon
    }

    onAction() {
        this.action.emit();
    }
}
