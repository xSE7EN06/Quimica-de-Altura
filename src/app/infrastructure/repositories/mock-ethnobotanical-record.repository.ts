import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { EthnobotanicalRecord } from '../../domain/models/ethnobotanical-record.entity';
import { EthnobotanicalRecordRepository } from '../../domain/repositories/ethnobotanical-record.repository';

@Injectable({ providedIn: 'root' })
export class MockEthnobotanicalRecordRepository extends EthnobotanicalRecordRepository {
    private items: EthnobotanicalRecord[] = [
        {
            id: '1',
            species: 'Artemisia ludoviciana',
            community: 'Tepehuan del Sur',
            region: 'Durango',
            conditionTreated: 'Fiebre y Paludismo',
            preparationMethod: 'Decocción',
            rawMaterialPart: 'Hojas',
            documenter: 'Dr. J. Hernández',
            year: 2019,
            evidenceLevel: 'L2',
            notes: 'Uso ampliamente documentado en sierra sur'
        },
        {
            id: '2',
            species: 'Psacalium decompositum',
            community: 'Purépecha',
            region: 'Michoacán',
            conditionTreated: 'Diabetes tipo 2',
            preparationMethod: 'Infusión',
            rawMaterialPart: 'Raíz',
            documenter: 'Dra. M. García',
            year: 2021,
            evidenceLevel: 'L3'
        },
        {
            id: '3',
            species: 'Salvia hispanica',
            community: 'Nahua',
            region: 'Puebla',
            conditionTreated: 'Inflamación articular',
            preparationMethod: 'Cataplasma',
            rawMaterialPart: 'Semillas',
            documenter: 'Mtro. P. López',
            year: 2020,
            evidenceLevel: 'L1'
        },
        {
            id: '4',
            species: 'Buddleja perfoliata',
            community: 'Mazahua',
            region: 'Estado de México',
            conditionTreated: 'Infecciones respiratorias',
            preparationMethod: 'Vapor/Inhalación',
            rawMaterialPart: 'Flores',
            documenter: 'Dr. A. Ramírez',
            year: 2018,
            evidenceLevel: 'L2'
        },
        {
            id: '5',
            species: 'Justicia spicigera',
            community: 'Totonaca',
            region: 'Veracruz',
            conditionTreated: 'Anemia y fatiga',
            preparationMethod: 'Jugo fresco',
            rawMaterialPart: 'Hojas',
            documenter: 'Dra. C. Martínez',
            year: 2022,
            evidenceLevel: 'L1',
            notes: 'Alta disponibilidad regional'
        },
        {
            id: '6',
            species: 'Turnera diffusa',
            community: 'Maya',
            region: 'Yucatán',
            conditionTreated: 'Disfunción sexual',
            preparationMethod: 'Tintura',
            rawMaterialPart: 'Tallos y hojas',
            documenter: 'Dr. R. Castro',
            year: 2017,
            evidenceLevel: 'L4'
        }
    ];

    getAll(): Observable<EthnobotanicalRecord[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<EthnobotanicalRecord | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: EthnobotanicalRecord): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: EthnobotanicalRecord): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
