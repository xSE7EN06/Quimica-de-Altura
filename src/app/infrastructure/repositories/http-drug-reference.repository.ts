import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DrugReferenceRepository } from '../../domain/repositories/drug-reference.repository';
import { DrugReference } from '../../domain/models/drug-reference.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpDrugReferenceRepository extends DrugReferenceRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/drug-references`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): DrugReference {
    return {
      id: r.id,
      drugName: r.drug_name ?? '',
      activeIngredient: r.active_ingredient ?? '',
      linkedCompound: r.linked_compound ?? '',
      linkedPlant: r.linked_plant ?? '',
      pathwayOverlap: r.pathway_overlap ?? '',
      similarityScore: r.similarity_score ?? 0,
      mechanism: r.mechanism ?? '',
      notes: r.notes,
    };
  }

  getAll(): Observable<DrugReference[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<DrugReference | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: DrugReference): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      drug_name: item.drugName,
      active_ingredient: item.activeIngredient,
      linked_compound: item.linkedCompound,
      linked_plant: item.linkedPlant,
      pathway_overlap: item.pathwayOverlap,
      similarity_score: item.similarityScore,
      mechanism: item.mechanism,
      notes: item.notes,
    });
  }

  update(item: DrugReference): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      drug_name: item.drugName,
      active_ingredient: item.activeIngredient,
      linked_compound: item.linkedCompound,
      linked_plant: item.linkedPlant,
      pathway_overlap: item.pathwayOverlap,
      similarity_score: item.similarityScore,
      mechanism: item.mechanism,
      notes: item.notes,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
