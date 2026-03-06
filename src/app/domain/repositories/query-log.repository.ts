import { Observable } from 'rxjs';
import { QueryLog } from '../models/query-log.entity';

export abstract class QueryLogRepository {
    abstract getAll(): Observable<QueryLog[]>;
    abstract getById(id: string): Observable<QueryLog | undefined>;
    abstract add(item: QueryLog): Observable<void>;
    abstract update(item: QueryLog): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
