import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule, IonModal],
    templateUrl: './confirmation-modal.component.html',
    styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
    @Input() isOpen = false;
    @Input() title = '¿Estás seguro?';
    @Input() message = 'Esta acción no se puede deshacer.';
    @Input() icon = 'warning';
    @Input() iconColor = '#E53E3E';
    @Input() confirmText = 'Confirmar';
    @Input() cancelText = 'Cancelar';
    @Input() confirmColor = '#E53E3E';

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    onConfirm() {
        this.confirmed.emit();
        this.isOpen = false;
    }

    onCancel() {
        this.cancelled.emit();
        this.isOpen = false;
    }

    onDidDismiss() {
        this.isOpen = false;
        this.cancelled.emit();
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }
}
