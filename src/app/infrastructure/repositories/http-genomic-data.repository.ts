import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GenomicDataRepository } from '../../domain/repositories/genomic-data.repository';
import { GenomicData } from '../../domain/models/genomic-data.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpGenomicDataRepository extends GenomicDataRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/genomic-data`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): GenomicData {
    return {
      id: r.id,
      species: r.species ?? '',
      fastaFile: r.fasta_file ?? '',
      genbankId: r.genbank_id ?? '',
      keggPathway: r.kegg_pathway ?? '',
      enzymeHomology: r.enzyme_homology ?? '',
      geneCluster: r.gene_cluster ?? '',
      blastResults: r.blast_results ?? '',
      uploadedAt: r.uploaded_at ?? '',
      status: r.status ?? 'pending',
    };
  }

  getAll(): Observable<GenomicData[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getById(id: string): Observable<GenomicData | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  add(item: GenomicData): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      species: item.species,
      fasta_file: item.fastaFile,
      genbank_id: item.genbankId,
      kegg_pathway: item.keggPathway,
      enzyme_homology: item.enzymeHomology,
      gene_cluster: item.geneCluster,
      blast_results: item.blastResults,
      status: item.status,
    });
  }

  update(item: GenomicData): Observable<void> {
    return this.http.put<void>(`${this.base}/${item.id}`, {
      species: item.species,
      fasta_file: item.fastaFile,
      genbank_id: item.genbankId,
      kegg_pathway: item.keggPathway,
      enzyme_homology: item.enzymeHomology,
      gene_cluster: item.geneCluster,
      blast_results: item.blastResults,
      status: item.status,
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
