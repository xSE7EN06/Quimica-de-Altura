import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-scan-result-card',
    templateUrl: './scan-result-card.component.html',
    styleUrls: ['./scan-result-card.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class ScanResultCardComponent {
    @Input() plant: any;
    @Output() close = new EventEmitter<void>();

    constructor() { }

    onClose() {
        this.close.emit();
    }
}
