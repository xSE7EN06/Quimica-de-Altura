import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QueryLogRepository } from '../../domain/repositories/query-log.repository';
import { QueryLog } from '../../domain/models/query-log.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpQueryLogRepository extends QueryLogRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/query-logs`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): QueryLog {
    return {
      id: r.id,
      query: r.query ?? '',
      extractedEntities: r.extracted_entities ?? [],
      ontologyMappings: r.ontology_mappings ?? [],
      plantsReturned: r.plants_returned ?? [],
      confidence: r.confidence ?? 0,
      flagged: r.flagged ?? false,
      userId: r.user_id ?? '',
      createdAt: r.created_at ?? '',
    };
  }

  getAll(): Observable<QueryLog[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<QueryLog | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: QueryLog): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      query: item.query,
      extracted_entities: item.extractedEntities,
      ontology_mappings: item.ontologyMappings,
      plants_returned: item.plantsReturned,
      confidence: item.confidence,
      flagged: item.flagged,
      user_id: item.userId,
    });
  }

  update(item: QueryLog): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      flagged: item.flagged,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
