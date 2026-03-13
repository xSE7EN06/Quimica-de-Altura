import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegionalAvailabilityRepository } from '../../domain/repositories/regional-availability.repository';
import { RegionalAvailability } from '../../domain/models/regional-availability.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpRegionalAvailabilityRepository extends RegionalAvailabilityRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/regional-availability`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): RegionalAvailability {
    return {
      id: r.id,
      species: r.species ?? '',
      state: r.state ?? '',
      region: r.region ?? '',
      source: r.source ?? '',
      abundance: r.abundance ?? 'common',
      lastUpdated: r.last_updated ?? '',
      notes: r.notes,
    };
  }

  getAll(): Observable<RegionalAvailability[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<RegionalAvailability | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: RegionalAvailability): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      species: item.species,
      state: item.state,
      region: item.region,
      source: item.source,
      abundance: item.abundance,
      last_updated: item.lastUpdated,
      notes: item.notes,
    });
  }

  update(item: RegionalAvailability): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      species: item.species,
      state: item.state,
      region: item.region,
      source: item.source,
      abundance: item.abundance,
      last_updated: item.lastUpdated,
      notes: item.notes,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
