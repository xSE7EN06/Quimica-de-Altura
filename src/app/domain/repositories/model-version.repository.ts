import { Observable } from 'rxjs';
import { ModelVersion } from '../models/model-version.entity';

export abstract class ModelVersionRepository {
    abstract getAll(): Observable<ModelVersion[]>;
    abstract getById(id: string): Observable<ModelVersion | undefined>;
    abstract add(item: ModelVersion): Observable<void>;
    abstract update(item: ModelVersion): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
