import { Observable } from 'rxjs';
import { ModerationItem } from '../models/moderation-item.entity';

export abstract class ModerationItemRepository {
    abstract getAll(): Observable<ModerationItem[]>;
    abstract getById(id: string): Observable<ModerationItem | undefined>;
    abstract add(item: ModerationItem): Observable<void>;
    abstract update(item: ModerationItem): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
