import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ImageLog } from '../../domain/models/image-log.entity';
import { ImageLogRepository } from '../../domain/repositories/image-log.repository';

@Injectable({ providedIn: 'root' })
export class MockImageLogRepository extends ImageLogRepository {
    private items: ImageLog[] = [
        {
            id: '1',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Piper_auritum.jpg/320px-Piper_auritum.jpg',
            predictedSpecies: 'Piper auritum (Acuyo)',
            confidence: 0.96,
            modelVersion: 'PlantID-v3.2',
            userFeedback: 'correct',
            flagged: false,
            userId: 'user_001',
            createdAt: '2024-07-01T10:15:00'
        },
        {
            id: '2',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Manzanilla.jpg/320px-Manzanilla.jpg',
            predictedSpecies: 'Matricaria chamomilla (Manzanilla)',
            confidence: 0.88,
            modelVersion: 'PlantID-v3.2',
            userFeedback: 'correct',
            flagged: false,
            userId: 'user_002',
            createdAt: '2024-07-01T14:30:00'
        },
        {
            id: '3',
            imageUrl: 'https://via.placeholder.com/320x240',
            predictedSpecies: 'Artemisia ludoviciana (Estafiate)',
            confidence: 0.45,
            modelVersion: 'PlantID-v3.1',
            userFeedback: 'incorrect',
            flagged: true,
            userId: 'user_003',
            createdAt: '2024-07-02T09:20:00'
        },
        {
            id: '4',
            imageUrl: 'https://via.placeholder.com/320x240',
            predictedSpecies: 'Turnera diffusa (Damiana)',
            confidence: 0.72,
            modelVersion: 'PlantID-v3.2',
            userFeedback: 'unsure',
            flagged: false,
            userId: 'user_004',
            createdAt: '2024-07-03T16:45:00'
        },
        {
            id: '5',
            imageUrl: 'https://via.placeholder.com/320x240',
            predictedSpecies: 'Justicia spicigera (Muicle)',
            confidence: 0.91,
            modelVersion: 'PlantID-v3.2',
            userFeedback: 'correct',
            flagged: false,
            userId: 'user_005',
            createdAt: '2024-07-04T11:10:00'
        },
        {
            id: '6',
            imageUrl: 'https://via.placeholder.com/320x240',
            predictedSpecies: 'Buddleja perfoliata (Tepozán)',
            confidence: 0.33,
            modelVersion: 'PlantID-v3.0',
            userFeedback: 'incorrect',
            flagged: true,
            userId: 'user_006',
            createdAt: '2024-07-05T08:55:00'
        }
    ];

    getAll(): Observable<ImageLog[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<ImageLog | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: ImageLog): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: ImageLog): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
