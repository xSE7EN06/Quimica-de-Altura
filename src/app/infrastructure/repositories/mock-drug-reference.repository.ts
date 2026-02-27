import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DrugReference } from '../../domain/models/drug-reference.entity';
import { DrugReferenceRepository } from '../../domain/repositories/drug-reference.repository';

@Injectable({ providedIn: 'root' })
export class MockDrugReferenceRepository extends DrugReferenceRepository {
    private items: DrugReference[] = [
        {
            id: '1',
            drugName: 'Metformina',
            activeIngredient: 'Metformina HCl',
            linkedCompound: 'Berberina',
            linkedPlant: 'Berberis trifoliolata (Palo amarillo)',
            pathwayOverlap: 'AMPK / gluconeogénesis hepática',
            similarityScore: 0.78,
            mechanism: 'Inhibición de gluconeogénesis y activación de AMPK',
            notes: 'Evidencia clínica en T2DM mexicanos'
        },
        {
            id: '2',
            drugName: 'Ibuprofeno',
            activeIngredient: 'Ibuprofeno',
            linkedCompound: 'Apigenina',
            linkedPlant: 'Matricaria chamomilla (Manzanilla)',
            pathwayOverlap: 'COX-1/COX-2 inhibición',
            similarityScore: 0.65,
            mechanism: 'Inhibición de ciclooxigenasas'
        },
        {
            id: '3',
            drugName: 'Diazepam',
            activeIngredient: 'Diazepam',
            linkedCompound: 'Linalool',
            linkedPlant: 'Agastache mexicana (Toronjil)',
            pathwayOverlap: 'GABA-A receptor binding',
            similarityScore: 0.71,
            mechanism: 'Modulación alostérica positiva de GABA-A',
            notes: 'Actividad ansiolítica comparable a benzodiacepinas en modelos murinos'
        },
        {
            id: '4',
            drugName: 'Omeprazol',
            activeIngredient: 'Omeprazol',
            linkedCompound: 'Eugenol',
            linkedPlant: 'Piper auritum (Acuyo)',
            pathwayOverlap: 'H+/K+ ATPase inhibición',
            similarityScore: 0.55,
            mechanism: 'Inhibición de la bomba de protones gástrica'
        },
        {
            id: '5',
            drugName: 'Aspirina',
            activeIngredient: 'Ácido acetilsalicílico',
            linkedCompound: 'Ácido salicílico',
            linkedPlant: 'Populus tremuloides (Álamo)',
            pathwayOverlap: 'Prostaglandinas / Tromboxano A2',
            similarityScore: 0.89,
            mechanism: 'Inhibición irreversible de COX-1'
        },
        {
            id: '6',
            drugName: 'Loratadina',
            activeIngredient: 'Loratadina',
            linkedCompound: 'Quercetina',
            linkedPlant: 'Psacalium decompositum (Matarique)',
            pathwayOverlap: 'H1 receptor antagonismo',
            similarityScore: 0.60,
            mechanism: 'Antagonismo del receptor H1 histaminérgico'
        }
    ];

    getAll(): Observable<DrugReference[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<DrugReference | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: DrugReference): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: DrugReference): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
