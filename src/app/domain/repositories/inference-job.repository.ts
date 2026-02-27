import { Observable } from 'rxjs';
import { InferenceJob } from '../models/inference-job.entity';

export abstract class InferenceJobRepository {
    abstract getAll(): Observable<InferenceJob[]>;
    abstract getById(id: string): Observable<InferenceJob | undefined>;
    abstract add(item: InferenceJob): Observable<void>;
    abstract update(item: InferenceJob): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
