import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModerationItemRepository } from '../../domain/repositories/moderation-item.repository';
import { ModerationItem } from '../../domain/models/moderation-item.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpModerationItemRepository extends ModerationItemRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/moderation`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): ModerationItem {
    return {
      id: r.id,
      type: r.type ?? 'submission',
      content: r.content ?? '',
      submittedBy: r.submitted_by ?? '',
      submittedAt: r.submitted_at ?? '',
      status: r.status ?? 'pending',
      reviewedBy: r.reviewed_by,
      reviewedAt: r.reviewed_at,
      notes: r.notes,
    };
  }

  getAll(): Observable<ModerationItem[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<ModerationItem | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: ModerationItem): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      type: item.type,
      content: item.content,
      submitted_by: item.submittedBy,
      notes: item.notes,
    });
  }

  update(item: ModerationItem): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      status: item.status,
      reviewed_by: item.reviewedBy,
      reviewed_at: item.reviewedAt,
      notes: item.notes,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
