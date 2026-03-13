import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataPipelineRepository } from '../../domain/repositories/data-pipeline.repository';
import { DataPipeline } from '../../domain/models/data-pipeline.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpDataPipelineRepository extends DataPipelineRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/data-pipelines`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): DataPipeline {
    return {
      id: r.id,
      name: r.name ?? '',
      source: r.source ?? '',
      status: r.status ?? 'idle',
      lastSync: r.last_sync ?? '',
      nextSync: r.next_sync ?? '',
      recordsSynced: r.records_synced ?? 0,
      errorLog: r.error_log,
    };
  }

  getAll(): Observable<DataPipeline[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<DataPipeline | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: DataPipeline): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      name: item.name,
      source: item.source,
      status: item.status,
      last_sync: item.lastSync,
      next_sync: item.nextSync,
      records_synced: item.recordsSynced,
      error_log: item.errorLog,
    });
  }

  update(item: DataPipeline): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      name: item.name,
      source: item.source,
      status: item.status,
      last_sync: item.lastSync,
      next_sync: item.nextSync,
      records_synced: item.recordsSynced,
      error_log: item.errorLog,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
