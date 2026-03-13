import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OntologyTermRepository } from '../../domain/repositories/ontology-term.repository';
import { OntologyTerm } from '../../domain/models/ontology-term.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpOntologyTermRepository extends OntologyTermRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/ontology-terms`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): OntologyTerm {
    return {
      id: r.id,
      canonicalTerm: r.canonical_term ?? '',
      icd10Code: r.icd10_code ?? '',
      meshId: r.mesh_id ?? '',
      synonyms: r.synonyms ?? [],
      category: r.category ?? '',
      description: r.description,
    };
  }

  getAll(): Observable<OntologyTerm[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<OntologyTerm | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: OntologyTerm): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      canonical_term: item.canonicalTerm,
      icd10_code: item.icd10Code,
      mesh_id: item.meshId,
      synonyms: item.synonyms,
      category: item.category,
      description: item.description,
    });
  }

  update(item: OntologyTerm): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      canonical_term: item.canonicalTerm,
      icd10_code: item.icd10Code,
      mesh_id: item.meshId,
      synonyms: item.synonyms,
      category: item.category,
      description: item.description,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
