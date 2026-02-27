import { Observable } from 'rxjs';
import { RegionalAvailability } from '../models/regional-availability.entity';

export abstract class RegionalAvailabilityRepository {
    abstract getAll(): Observable<RegionalAvailability[]>;
    abstract getById(id: string): Observable<RegionalAvailability | undefined>;
    abstract add(item: RegionalAvailability): Observable<void>;
    abstract update(item: RegionalAvailability): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
