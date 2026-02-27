import { Observable } from 'rxjs';
import { DrugReference } from '../models/drug-reference.entity';

export abstract class DrugReferenceRepository {
    abstract getAll(): Observable<DrugReference[]>;
    abstract getById(id: string): Observable<DrugReference | undefined>;
    abstract add(item: DrugReference): Observable<void>;
    abstract update(item: DrugReference): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
