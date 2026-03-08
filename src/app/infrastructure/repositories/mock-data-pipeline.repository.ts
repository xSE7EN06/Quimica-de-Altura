import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DataPipeline } from '../../domain/models/data-pipeline.entity';
import { DataPipelineRepository } from '../../domain/repositories/data-pipeline.repository';

@Injectable({ providedIn: 'root' })
export class MockDataPipelineRepository extends DataPipelineRepository {
    private items: DataPipeline[] = [
        {
            id: '1',
            name: 'GBIF México Plantas',
            source: 'GBIF API v2',
            status: 'active',
            lastSync: '2024-07-05T06:00:00',
            nextSync: '2024-07-06T06:00:00',
            recordsSynced: 12847
        },
        {
            id: '2',
            name: 'PubMed Artículos Botánicos',
            source: 'PubMed Entrez API',
            status: 'syncing',
            lastSync: '2024-07-04T22:00:00',
            nextSync: '2024-07-05T22:00:00',
            recordsSynced: 3241
        },
        {
            id: '3',
            name: 'CONABIO Biodiversidad',
            source: 'CONABIO REST API',
            status: 'idle',
            lastSync: '2024-07-01T12:00:00',
            nextSync: '2024-07-08T12:00:00',
            recordsSynced: 5623
        },
        {
            id: '4',
            name: 'KEGG Pathways Metabólicos',
            source: 'KEGG REST API',
            status: 'error',
            lastSync: '2024-06-30T18:00:00',
            nextSync: '2024-07-05T18:00:00',
            recordsSynced: 891,
            errorLog: 'Timeout en endpoint /pathway/list. Código HTTP 504.'
        },
        {
            id: '5',
            name: 'GenBank Secuencias',
            source: 'NCBI GenBank API',
            status: 'active',
            lastSync: '2024-07-05T04:00:00',
            nextSync: '2024-07-06T04:00:00',
            recordsSynced: 2156
        },
        {
            id: '6',
            name: 'ICD-10 Diagnósticos',
            source: 'WHO ICD-10 API',
            status: 'idle',
            lastSync: '2024-06-15T10:00:00',
            nextSync: '2024-07-15T10:00:00',
            recordsSynced: 14286
        }
    ];

    getAll(): Observable<DataPipeline[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<DataPipeline | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: DataPipeline): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: DataPipeline): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
