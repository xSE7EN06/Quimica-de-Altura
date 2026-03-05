import { Observable } from 'rxjs';
import { DataPipeline } from '../models/data-pipeline.entity';

export abstract class DataPipelineRepository {
    abstract getAll(): Observable<DataPipeline[]>;
    abstract getById(id: string): Observable<DataPipeline | undefined>;
    abstract add(item: DataPipeline): Observable<void>;
    abstract update(item: DataPipeline): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
