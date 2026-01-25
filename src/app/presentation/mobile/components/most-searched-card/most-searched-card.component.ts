import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';

@Component({
    selector: 'app-most-searched-card',
    templateUrl: './most-searched-card.component.html',
    styleUrls: ['./most-searched-card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class MostSearchedCardComponent {
    @Input() name: string = '';
    @Input() scientificName: string = '';
    @Input() imageUrl: string = '';
    @Input() properties: { name: string; percentage: number }[] = [];
    @Input() buttonText: string = 'Ver detalle';

    @Output() action = new EventEmitter<void>();

    constructor() {
        addIcons({ alertCircleOutline });
    }

    onAction() {
        this.action.emit();
    }
}
