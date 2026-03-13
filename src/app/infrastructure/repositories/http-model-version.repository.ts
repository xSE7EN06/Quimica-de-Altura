import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModelVersionRepository } from '../../domain/repositories/model-version.repository';
import { ModelVersion } from '../../domain/models/model-version.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpModelVersionRepository extends ModelVersionRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/model-versions`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): ModelVersion {
    return {
      id: r.id,
      name: r.name ?? '',
      type: r.type ?? 'nlp',
      version: r.version ?? '',
      accuracy: r.accuracy ?? 0,
      status: r.status ?? 'testing',
      deployedAt: r.deployed_at ?? '',
      notes: r.notes,
      canRollback: r.can_rollback ?? false,
    };
  }

  getAll(): Observable<ModelVersion[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<ModelVersion | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: ModelVersion): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      name: item.name,
      type: item.type,
      version: item.version,
      accuracy: item.accuracy,
      status: item.status,
      deployed_at: item.deployedAt,
      notes: item.notes,
      can_rollback: item.canRollback,
    });
  }

  update(item: ModelVersion): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      name: item.name,
      type: item.type,
      version: item.version,
      accuracy: item.accuracy,
      status: item.status,
      deployed_at: item.deployedAt,
      notes: item.notes,
      can_rollback: item.canRollback,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
