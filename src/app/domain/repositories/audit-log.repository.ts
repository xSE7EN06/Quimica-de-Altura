import { Observable } from 'rxjs';
import { AuditLog } from '../models/audit-log.entity';

export abstract class AuditLogRepository {
    abstract getAll(): Observable<AuditLog[]>;
    abstract getById(id: string): Observable<AuditLog | undefined>;
}
