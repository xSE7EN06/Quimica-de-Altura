import { Observable } from 'rxjs';
import { GenomicData } from '../models/genomic-data.entity';

export abstract class GenomicDataRepository {
    abstract getAll(): Observable<GenomicData[]>;
    abstract getById(id: string): Observable<GenomicData | undefined>;
    abstract add(item: GenomicData): Observable<void>;
    abstract update(item: GenomicData): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
