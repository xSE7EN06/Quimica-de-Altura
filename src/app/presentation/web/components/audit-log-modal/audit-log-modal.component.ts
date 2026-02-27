import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { AuditLog } from '../../../../domain/models/audit-log.entity';

@Component({
    selector: 'app-audit-log-modal',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        IonModal
    ],
    templateUrl: './audit-log-modal.component.html',
    styleUrls: ['./audit-log-modal.component.scss']
})
export class AuditLogModalComponent {
    @Input() item?: AuditLog;

    isOpen = false;

    open(mode: 'view', item: AuditLog) {
        this.item = item;
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    onDidDismiss() {
        this.isOpen = false;
    }

    getActionBadgeClass(action: string): string {
        const map: Record<string, string> = {
            'create': 'badge-green',
            'update': 'badge-blue',
            'delete': 'badge-red',
            'approve': 'badge-teal',
            'reject': 'badge-orange'
        };
        return map[action] || '';
    }

    getPrettyChanges(changes?: string): string {
        if (!changes) return '';
        try {
            return JSON.stringify(JSON.parse(changes), null, 2);
        } catch {
            return changes;
        }
    }
}
