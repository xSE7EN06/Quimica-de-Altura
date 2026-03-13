import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EthnobotanicalRecordRepository } from '../../domain/repositories/ethnobotanical-record.repository';
import { EthnobotanicalRecord } from '../../domain/models/ethnobotanical-record.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpEthnobotanicalRecordRepository extends EthnobotanicalRecordRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/ethnobotanical`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): EthnobotanicalRecord {
    return {
      id: r.id,
      species: r.species ?? '',
      community: r.community ?? '',
      region: r.region ?? '',
      conditionTreated: r.condition_treated ?? '',
      preparationMethod: r.preparation_method ?? '',
      rawMaterialPart: r.raw_material_part ?? '',
      documenter: r.documenter ?? '',
      year: r.year ?? 0,
      evidenceLevel: r.evidence_level ?? 'L4',
      notes: r.notes,
    };
  }

  getAll(): Observable<EthnobotanicalRecord[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<EthnobotanicalRecord | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: EthnobotanicalRecord): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      species: item.species,
      community: item.community,
      region: item.region,
      condition_treated: item.conditionTreated,
      preparation_method: item.preparationMethod,
      raw_material_part: item.rawMaterialPart,
      documenter: item.documenter,
      year: item.year,
      evidence_level: item.evidenceLevel,
      notes: item.notes,
    });
  }

  update(item: EthnobotanicalRecord): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      species: item.species,
      community: item.community,
      region: item.region,
      condition_treated: item.conditionTreated,
      preparation_method: item.preparationMethod,
      raw_material_part: item.rawMaterialPart,
      documenter: item.documenter,
      year: item.year,
      evidence_level: item.evidenceLevel,
      notes: item.notes,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
