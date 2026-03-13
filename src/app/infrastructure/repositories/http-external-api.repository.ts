import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExternalApiRepository } from '../../domain/repositories/external-api.repository';
import { ExternalApi } from '../../domain/models/external-api.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpExternalApiRepository extends ExternalApiRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/external-apis`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): ExternalApi {
    return {
      id: r.id,
      name: r.name ?? '',
      base_url: r.base_url ?? '',
      description: r.description ?? '',
      authType: r.auth_type ?? 'None',
      rateLimit: r.rate_limit ?? 0,
      endpoints: (r.endpoints ?? []).map((e: any) => ({
        id: e.id,
        name: e.name,
        path: e.path,
        method: e.method,
        description: e.description,
        isActive: e.is_active ?? true,
      })),
    };
  }

  getApis(): Observable<ExternalApi[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getApiById(id: string): Observable<ExternalApi | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  addApi(api: ExternalApi): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      name: api.name,
      base_url: api.base_url,
      description: api.description,
      auth_type: api.authType,
      rate_limit: api.rateLimit,
    });
  }

  updateApi(api: ExternalApi): Observable<void> {
    return this.http.put<void>(`${this.base}/${api.id}`, {
      name: api.name,
      base_url: api.base_url,
      description: api.description,
      auth_type: api.authType,
      rate_limit: api.rateLimit,
    });
  }

  deleteApi(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
