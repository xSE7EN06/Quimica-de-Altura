import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ModelVersion } from '../../domain/models/model-version.entity';
import { ModelVersionRepository } from '../../domain/repositories/model-version.repository';

@Injectable({ providedIn: 'root' })
export class MockModelVersionRepository extends ModelVersionRepository {
    private items: ModelVersion[] = [
        {
            id: '1',
            name: 'PlantID Vision',
            type: 'image-classifier',
            version: '3.2.1',
            accuracy: 0.943,
            status: 'active',
            deployedAt: '2024-05-15T10:00:00',
            notes: 'MobileNetV3 fine-tuned en 8,500 imágenes de plantas mexicanas',
            canRollback: true
        },
        {
            id: '2',
            name: 'PlantID Vision',
            type: 'image-classifier',
            version: '3.1.0',
            accuracy: 0.918,
            status: 'deprecated',
            deployedAt: '2024-02-01T10:00:00',
            canRollback: true
        },
        {
            id: '3',
            name: 'Yolotl NLP Engine',
            type: 'nlp',
            version: '2.4.0',
            accuracy: 0.891,
            status: 'active',
            deployedAt: '2024-04-20T14:00:00',
            notes: 'Fine-tuning de BETO para extracción de entidades botánicas y síntomas en español',
            canRollback: false
        },
        {
            id: '4',
            name: 'Yolotl NLP Engine',
            type: 'nlp',
            version: '2.3.5',
            accuracy: 0.874,
            status: 'deprecated',
            deployedAt: '2024-01-10T14:00:00',
            canRollback: false
        },
        {
            id: '5',
            name: 'PhytoInfer Pipeline',
            type: 'inference-pipeline',
            version: '1.1.0',
            accuracy: 0.812,
            status: 'testing',
            deployedAt: '2024-07-01T09:00:00',
            notes: 'Inferencia de actividad farmacológica basada en similitud estructural y vías KEGG',
            canRollback: true
        },
        {
            id: '6',
            name: 'PhytoInfer Pipeline',
            type: 'inference-pipeline',
            version: '1.0.2',
            accuracy: 0.787,
            status: 'active',
            deployedAt: '2024-03-12T09:00:00',
            canRollback: true
        }
    ];

    getAll(): Observable<ModelVersion[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<ModelVersion | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: ModelVersion): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: ModelVersion): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
