import { Observable } from 'rxjs';
import { ExternalApi } from '../models/external-api.entity';

export abstract class ExternalApiRepository {
    abstract getApis(): Observable<ExternalApi[]>;
    abstract getApiById(id: string): Observable<ExternalApi | undefined>;
    abstract addApi(api: ExternalApi): Observable<void>;
    abstract updateApi(api: ExternalApi): Observable<void>;
    abstract deleteApi(id: string): Observable<void>;
}
