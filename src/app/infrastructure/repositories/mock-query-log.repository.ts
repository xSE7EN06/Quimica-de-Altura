import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { QueryLog } from '../../domain/models/query-log.entity';
import { QueryLogRepository } from '../../domain/repositories/query-log.repository';

@Injectable({ providedIn: 'root' })
export class MockQueryLogRepository extends QueryLogRepository {
    private items: QueryLog[] = [
        {
            id: '1',
            query: '¿qué planta sirve para el dolor de cabeza?',
            extractedEntities: ['dolor de cabeza', 'analgésico'],
            ontologyMappings: ['G43.909 - Cefalea', 'M79.3 - Algia'],
            plantsReturned: ['Agastache mexicana', 'Artemisia ludoviciana', 'Matricaria chamomilla'],
            confidence: 0.89,
            flagged: false,
            userId: 'user_001',
            createdAt: '2024-07-01T09:30:00'
        },
        {
            id: '2',
            query: 'remedio natural para la diabetes',
            extractedEntities: ['diabetes', 'hipoglucemiante'],
            ontologyMappings: ['E11.9 - DM tipo 2', 'E14 - DM no especificada'],
            plantsReturned: ['Psacalium decompositum', 'Opuntia ficus-indica', 'Berberis trifoliolata'],
            confidence: 0.92,
            flagged: false,
            userId: 'user_002',
            createdAt: '2024-07-01T14:20:00'
        },
        {
            id: '3',
            query: 'planta para bajar de peso rapido',
            extractedEntities: ['obesidad', 'pérdida de peso'],
            ontologyMappings: ['E66.9 - Obesidad'],
            plantsReturned: ['Fucus vesiculosus', 'Camellia sinensis'],
            confidence: 0.61,
            flagged: true,
            userId: 'user_003',
            createdAt: '2024-07-02T11:15:00'
        },
        {
            id: '4',
            query: '¿cómo tratar la ansiedad con plantas?',
            extractedEntities: ['ansiedad', 'sedante', 'ansiolítico'],
            ontologyMappings: ['F41.9 - Trastorno de ansiedad', 'F41.1 - TAG'],
            plantsReturned: ['Agastache mexicana', 'Passiflora incarnata', 'Valeriana officinalis'],
            confidence: 0.85,
            flagged: false,
            userId: 'user_004',
            createdAt: '2024-07-03T16:00:00'
        },
        {
            id: '5',
            query: 'hierba para insomnio grave',
            extractedEntities: ['insomnio', 'trastorno del sueño'],
            ontologyMappings: ['G47.00 - Insomnio no orgánico'],
            plantsReturned: ['Passiflora incarnata', 'Agastache mexicana'],
            confidence: 0.88,
            flagged: false,
            userId: 'user_005',
            createdAt: '2024-07-04T22:30:00'
        },
        {
            id: '6',
            query: 'veneno de serpiente cura',
            extractedEntities: ['envenenamiento', 'antiveneno'],
            ontologyMappings: ['T63.009 - Toxina de serpiente'],
            plantsReturned: [],
            confidence: 0.12,
            flagged: true,
            userId: 'user_006',
            createdAt: '2024-07-05T07:45:00'
        }
    ];

    getAll(): Observable<QueryLog[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<QueryLog | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: QueryLog): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: QueryLog): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
