import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { InferenceJob } from '../../domain/models/inference-job.entity';
import { InferenceJobRepository } from '../../domain/repositories/inference-job.repository';

@Injectable({ providedIn: 'root' })
export class MockInferenceJobRepository extends InferenceJobRepository {
    private items: InferenceJob[] = [
        {
            id: '1',
            species: 'Acuyo (Piper auritum)',
            jobType: 'Identificación fotográfica',
            status: 'completed',
            confidenceScore: 0.94,
            output: 'Especie identificada con alta confianza. Compuestos activos: safrol, anetol, eugenol.',
            flaggedForReview: false,
            approvedBy: 'Dr. García',
            createdAt: '2024-07-01T10:30:00',
            completedAt: '2024-07-01T10:31:45'
        },
        {
            id: '2',
            species: 'Matarique (Psacalium decompositum)',
            jobType: 'Inferencia de actividad',
            status: 'flagged',
            confidenceScore: 0.62,
            output: 'Actividad hipoglucemiante inferida. Requiere validación experimental.',
            flaggedForReview: true,
            createdAt: '2024-07-02T14:15:00'
        },
        {
            id: '3',
            species: 'Especie desconocida',
            jobType: 'Identificación fotográfica',
            status: 'failed',
            confidenceScore: 0.23,
            output: 'Error: imagen de baja resolución. No se pudo determinar especie.',
            flaggedForReview: false,
            createdAt: '2024-07-03T09:00:00'
        },
        {
            id: '4',
            species: 'Toronjil (Agastache mexicana)',
            jobType: 'Mapeo de vías metabólicas',
            status: 'running',
            confidenceScore: 0.0,
            output: 'Procesando...',
            flaggedForReview: false,
            createdAt: '2024-07-04T16:45:00'
        },
        {
            id: '5',
            species: 'Muicle (Justicia spicigera)',
            jobType: 'Análisis de compuestos',
            status: 'completed',
            confidenceScore: 0.87,
            output: 'Antocianinas identificadas: cianidina-3-glucósido (principal), peonidina.',
            flaggedForReview: false,
            approvedBy: 'Dra. Martínez',
            createdAt: '2024-06-28T11:20:00',
            completedAt: '2024-06-28T11:22:30'
        },
        {
            id: '6',
            species: 'Damiana (Turnera diffusa)',
            jobType: 'Predicción de toxicidad',
            status: 'pending',
            confidenceScore: 0.0,
            output: '',
            flaggedForReview: false,
            createdAt: '2024-07-05T08:00:00'
        }
    ];

    getAll(): Observable<InferenceJob[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<InferenceJob | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: InferenceJob): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: InferenceJob): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
