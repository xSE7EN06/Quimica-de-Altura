import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ImageLogRepository } from '../../domain/repositories/image-log.repository';
import { ImageLog } from '../../domain/models/image-log.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpImageLogRepository extends ImageLogRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/image-logs`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): ImageLog {
    return {
      id: r.id,
      imageUrl: r.image_url ?? '',
      predictedSpecies: r.predicted_species ?? '',
      confidence: r.confidence ?? 0,
      modelVersion: r.model_version ?? '',
      userFeedback: r.user_feedback ?? 'unsure',
      flagged: r.flagged ?? false,
      userId: r.user_id ?? '',
      createdAt: r.created_at ?? '',
    };
  }

  getAll(): Observable<ImageLog[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<ImageLog | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: ImageLog): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      image_url: item.imageUrl,
      predicted_species: item.predictedSpecies,
      confidence: item.confidence,
      model_version: item.modelVersion,
      user_feedback: item.userFeedback,
      flagged: item.flagged,
      user_id: item.userId,
    });
  }

  update(item: ImageLog): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      user_feedback: item.userFeedback,
      flagged: item.flagged,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
