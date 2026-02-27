import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuditLog } from '../../domain/models/audit-log.entity';
import { AuditLogRepository } from '../../domain/repositories/audit-log.repository';

@Injectable({ providedIn: 'root' })
export class MockAuditLogRepository extends AuditLogRepository {
    private readonly logs: AuditLog[] = [
        {
            id: '1',
            userName: 'Admin',
            action: 'create',
            resource: 'Plant',
            resourceId: 'plant_042',
            changes: '{"commonName":"Hierba Santa","region":"Veracruz"}',
            timestamp: '2024-07-05T09:15:00',
            ipAddress: '192.168.1.101'
        },
        {
            id: '2',
            userName: 'Dr. García',
            action: 'approve',
            resource: 'ModerationItem',
            resourceId: 'mod_003',
            timestamp: '2024-07-04T18:30:00',
            ipAddress: '10.0.0.55'
        },
        {
            id: '3',
            userName: 'Admin',
            action: 'update',
            resource: 'ModelVersion',
            resourceId: 'mv_001',
            changes: '{"status":"active"}',
            timestamp: '2024-07-04T10:00:00',
            ipAddress: '192.168.1.101'
        },
        {
            id: '4',
            userName: 'Dra. Martínez',
            action: 'delete',
            resource: 'Article',
            resourceId: 'art_012',
            timestamp: '2024-07-03T15:45:00',
            ipAddress: '172.16.0.22'
        },
        {
            id: '5',
            userName: 'Admin',
            action: 'reject',
            resource: 'ModerationItem',
            resourceId: 'mod_005',
            changes: '{"notes":"Requiere documentación adicional"}',
            timestamp: '2024-07-03T09:20:00',
            ipAddress: '192.168.1.101'
        },
        {
            id: '6',
            userName: 'Dr. Ramírez',
            action: 'update',
            resource: 'EthnobotanicalRecord',
            resourceId: 'eth_003',
            changes: '{"evidenceLevel":"L2","documenter":"Dr. Ramírez"}',
            timestamp: '2024-07-02T14:00:00',
            ipAddress: '10.0.0.77'
        }
    ];

    getAll(): Observable<AuditLog[]> {
        return of([...this.logs]).pipe(delay(800));
    }

    getById(id: string): Observable<AuditLog | undefined> {
        return of(this.logs.find(x => x.id === id)).pipe(delay(300));
    }
}
