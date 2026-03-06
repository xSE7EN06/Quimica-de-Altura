import { Observable } from 'rxjs';
import { ImageLog } from '../models/image-log.entity';

export abstract class ImageLogRepository {
    abstract getAll(): Observable<ImageLog[]>;
    abstract getById(id: string): Observable<ImageLog | undefined>;
    abstract add(item: ImageLog): Observable<void>;
    abstract update(item: ImageLog): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
