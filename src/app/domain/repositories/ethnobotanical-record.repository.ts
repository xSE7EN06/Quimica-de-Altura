import { Observable } from 'rxjs';
import { EthnobotanicalRecord } from '../models/ethnobotanical-record.entity';

export abstract class EthnobotanicalRecordRepository {
    abstract getAll(): Observable<EthnobotanicalRecord[]>;
    abstract getById(id: string): Observable<EthnobotanicalRecord | undefined>;
    abstract add(item: EthnobotanicalRecord): Observable<void>;
    abstract update(item: EthnobotanicalRecord): Observable<void>;
    abstract delete(id: string): Observable<void>;
}
