import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule, IonModal],
    template: `
        <ion-modal [isOpen]="isOpen" (didDismiss)="onDidDismiss()" class="confirm-modal">
            <ng-template>
                <div class="modal-container">
                    <div class="modal-icon" [style.color]="iconColor">
                        <mat-icon>{{ icon }}</mat-icon>
                    </div>
                    
                    <div class="modal-content">
                        <h2>{{ title }}</h2>
                        <p>{{ message }}</p>
                    </div>

                    <div class="modal-footer">
                        <button class="btn-secondary" (click)="onCancel()">{{ cancelText }}</button>
                        <button class="btn-primary" [style.backgroundColor]="confirmColor" (click)="onConfirm()">{{ confirmText }}</button>
                    </div>
                </div>
            </ng-template>
        </ion-modal>
    `,
    styles: [`
        .confirm-modal {
            --height: auto;
            --width: 400px;
            --border-radius: 20px;
            --background: #ffffff;
            --box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        .modal-container {
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            background: white;
            color: #333;
        }

        .modal-icon {
            margin-bottom: 20px;
            background: rgba(0,0,0,0.05);
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            
            mat-icon {
                font-size: 40px;
                width: 40px;
                height: 40px;
            }
        }

        .modal-content {
            margin-bottom: 30px;

            h2 {
                margin: 0 0 10px 0;
                font-size: 1.5rem;
                font-weight: 700;
                color: #2D3748;
            }

            p {
                margin: 0;
                color: #718096;
                line-height: 1.5;
            }
        }

        .modal-footer {
            display: flex;
            gap: 15px;
            width: 100%;

            button {
                flex: 1;
                padding: 12px 20px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
            }

            .btn-secondary {
                background: #EDF2F7;
                color: #4A5568;
                &:hover {
                    background: #E2E8F0;
                }
            }

            .btn-primary {
                background: #E53E3E;
                color: white;
                &:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
            }
        }
    `]
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
