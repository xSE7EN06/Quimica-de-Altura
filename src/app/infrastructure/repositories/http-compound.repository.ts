import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompoundRepository } from '../../domain/repositories/compound.repository';
import { ChemicalCompound } from '../../domain/models/chemical-compound.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpCompoundRepository extends CompoundRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/compounds`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): ChemicalCompound {
    return {
      id: r.id,
      name: r.name ?? '',
      iupacName: r.iupac_name ?? '',
      molecularFormula: r.molecular_formula ?? '',
      molecularWeight: r.molecular_weight ?? '',
      pubchemCid: r.pubchem_cid ?? '',
      smiles: r.smiles ?? '',
      inchi: r.inchi ?? '',
      inchiKey: r.inchi_key ?? '',
      description: r.description,
      properties: r.properties ?? [],
    };
  }

  getCompounds(): Observable<ChemicalCompound[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getCompoundById(id: string): Observable<ChemicalCompound | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  searchCompounds(query: string): Observable<ChemicalCompound[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?search=${encodeURIComponent(query)}&size=100`).pipe(
      map(res => res.items.map(r => this.map(r)))
    );
  }

  addCompound(compound: ChemicalCompound): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      name: compound.name,
      iupac_name: compound.iupacName,
      molecular_formula: compound.molecularFormula,
      molecular_weight: compound.molecularWeight,
      pubchem_cid: compound.pubchemCid,
      smiles: compound.smiles,
      inchi: compound.inchi,
      inchi_key: compound.inchiKey,
      description: compound.description,
      properties: compound.properties,
    });
  }

  updateCompound(compound: ChemicalCompound): Observable<void> {
    return this.http.put<void>(`${this.base}/${compound.id}`, {
      name: compound.name,
      iupac_name: compound.iupacName,
      molecular_formula: compound.molecularFormula,
      molecular_weight: compound.molecularWeight,
      pubchem_cid: compound.pubchemCid,
      smiles: compound.smiles,
      inchi: compound.inchi,
      inchi_key: compound.inchiKey,
      description: compound.description,
      properties: compound.properties,
    });
  }

  deleteCompound(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
