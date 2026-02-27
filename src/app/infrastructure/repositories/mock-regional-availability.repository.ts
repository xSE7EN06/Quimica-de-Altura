import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { RegionalAvailability } from '../../domain/models/regional-availability.entity';
import { RegionalAvailabilityRepository } from '../../domain/repositories/regional-availability.repository';

@Injectable({ providedIn: 'root' })
export class MockRegionalAvailabilityRepository extends RegionalAvailabilityRepository {
    private items: RegionalAvailability[] = [
        {
            id: '1',
            species: 'Acuyo (Piper auritum)',
            state: 'Veracruz',
            region: 'Sierra de Zongolica',
            source: 'Herbario UNAM 2022',
            abundance: 'common',
            lastUpdated: '2023-11-15',
            notes: 'Crece en zonas húmedas y sombreadas de la sierra'
        },
        {
            id: '2',
            species: 'Árnica (Heterotheca inuloides)',
            state: 'Oaxaca',
            region: 'Sierra Norte',
            source: 'CONABIO Atlas 2021',
            abundance: 'scarce',
            lastUpdated: '2023-08-20'
        },
        {
            id: '3',
            species: 'Muicle (Justicia spicigera)',
            state: 'Michoacán',
            region: 'Tierra Caliente',
            source: 'Herbario IPN 2023',
            abundance: 'common',
            lastUpdated: '2024-01-10'
        },
        {
            id: '4',
            species: 'Damiana (Turnera diffusa)',
            state: 'Baja California Sur',
            region: 'Desierto del Vizcaíno',
            source: 'SEMARNAT Inventario 2020',
            abundance: 'rare',
            lastUpdated: '2023-05-30',
            notes: 'Especie protegida bajo NOM-059'
        },
        {
            id: '5',
            species: 'Hierba del Sapo (Eryngium carlinae)',
            state: 'Jalisco',
            region: 'Los Altos',
            source: 'Herbario CUCBA 2022',
            abundance: 'scarce',
            lastUpdated: '2023-12-05'
        },
        {
            id: '6',
            species: 'Toronjil (Agastache mexicana)',
            state: 'Hidalgo',
            region: 'Valle del Mezquital',
            source: 'INE Monitoreo 2023',
            abundance: 'common',
            lastUpdated: '2024-02-18'
        }
    ];

    getAll(): Observable<RegionalAvailability[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<RegionalAvailability | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: RegionalAvailability): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: RegionalAvailability): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
