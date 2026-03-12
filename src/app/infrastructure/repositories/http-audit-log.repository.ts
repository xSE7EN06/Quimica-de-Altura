import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLogRepository } from '../../domain/repositories/audit-log.repository';
import { AuditLog } from '../../domain/models/audit-log.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpAuditLogRepository extends AuditLogRepository {
  private readonly base = `${environment.gatewayUrl}/api/audit-log/api/v1/audit-log`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): AuditLog {
    return {
      id: r.id,
      userName: r.user_name ?? r.userName ?? '',
      action: r.action ?? 'create',
      resource: r.resource ?? '',
      resourceId: r.resource_id ?? '',
      changes: r.changes,
      timestamp: r.timestamp ?? '',
      ipAddress: r.ip_address,
    };
  }

  getAll(): Observable<AuditLog[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<AuditLog | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }
}
