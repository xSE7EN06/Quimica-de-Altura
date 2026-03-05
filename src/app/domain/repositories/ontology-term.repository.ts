import { Observable } from 'rxjs';
import { OntologyTerm } from '../models/ontology-term.entity';

export abstract class OntologyTermRepository {
    abstract getAll(): Observable<OntologyTerm[]>;
    abstract getById(id: string): Observable<OntologyTerm | undefined>;
    abstract add(item: OntologyTerm): Observable<void>;
    abstract update(item: OntologyTerm): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
