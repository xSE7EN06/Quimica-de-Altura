import { Observable } from 'rxjs';
import { ChemicalCompound } from '../models/chemical-compound.entity';

export abstract class CompoundRepository {
    abstract getCompounds(): Observable<ChemicalCompound[]>;
    abstract getCompoundById(id: string): Observable<ChemicalCompound | undefined>;
    abstract searchCompounds(query: string): Observable<ChemicalCompound[]>;
    abstract addCompound(compound: ChemicalCompound): Observable<void>;
    abstract updateCompound(compound: ChemicalCompound): Observable<void>;
    abstract deleteCompound(id: string): Observable<void>;
}
