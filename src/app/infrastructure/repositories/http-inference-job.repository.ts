import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InferenceJobRepository } from '../../domain/repositories/inference-job.repository';
import { InferenceJob } from '../../domain/models/inference-job.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpInferenceJobRepository extends InferenceJobRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/inference-jobs`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): InferenceJob {
    return {
      id: r.id,
      species: r.species ?? '',
      jobType: r.job_type ?? '',
      status: r.status ?? 'pending',
      confidenceScore: r.confidence_score ?? 0,
      output: r.output ?? '',
      flaggedForReview: r.flagged_for_review ?? false,
      approvedBy: r.approved_by,
      createdAt: r.created_at ?? '',
      completedAt: r.completed_at,
    };
  }

  getAll(): Observable<InferenceJob[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<InferenceJob | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: InferenceJob): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      species: item.species,
      job_type: item.jobType,
      status: item.status,
      confidence_score: item.confidenceScore,
      output: item.output,
      flagged_for_review: item.flaggedForReview,
      approved_by: item.approvedBy,
    });
  }

  update(item: InferenceJob): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      species: item.species,
      job_type: item.jobType,
      status: item.status,
      confidence_score: item.confidenceScore,
      output: item.output,
      flagged_for_review: item.flaggedForReview,
      approved_by: item.approvedBy,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
