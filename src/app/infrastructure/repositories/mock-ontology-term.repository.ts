import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { OntologyTerm } from '../../domain/models/ontology-term.entity';
import { OntologyTermRepository } from '../../domain/repositories/ontology-term.repository';

@Injectable({ providedIn: 'root' })
export class MockOntologyTermRepository extends OntologyTermRepository {
    private items: OntologyTerm[] = [
        {
            id: '1',
            canonicalTerm: 'Dolor de cabeza',
            icd10Code: 'G43.909',
            meshId: 'D006261',
            synonyms: ['cefalea', 'jaqueca', 'migraña', 'dolor craneal'],
            category: 'Neurología',
            description: 'Dolor o molestia en la región de la cabeza o cuello'
        },
        {
            id: '2',
            canonicalTerm: 'Diabetes mellitus tipo 2',
            icd10Code: 'E11.9',
            meshId: 'D003924',
            synonyms: ['diabetes no insulinodependiente', 'diabetes del adulto', 'T2DM'],
            category: 'Endocrinología',
            description: 'Trastorno metabólico caracterizado por hiperglucemia crónica'
        },
        {
            id: '3',
            canonicalTerm: 'Inflamación',
            icd10Code: 'M79.3',
            meshId: 'D007249',
            synonyms: ['inflamatorio', 'edema', 'hinchazón', 'enrojecimiento'],
            category: 'Inmunología'
        },
        {
            id: '4',
            canonicalTerm: 'Ansiedad',
            icd10Code: 'F41.9',
            meshId: 'D001007',
            synonyms: ['nerviosismo', 'estrés', 'trastorno ansioso', 'angustia'],
            category: 'Psiquiatría',
            description: 'Estado de inquietud, miedo o preocupación excesiva'
        },
        {
            id: '5',
            canonicalTerm: 'Insomnio',
            icd10Code: 'G47.00',
            meshId: 'D007319',
            synonyms: ['falta de sueño', 'dificultad para dormir', 'vigilia'],
            category: 'Neurología'
        },
        {
            id: '6',
            canonicalTerm: 'Gastritis',
            icd10Code: 'K29.70',
            meshId: 'D005756',
            synonyms: ['inflamación gástrica', 'malestar estomacal', 'dolor de estómago'],
            category: 'Gastroenterología',
            description: 'Inflamación del revestimiento del estómago'
        }
    ];

    getAll(): Observable<OntologyTerm[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<OntologyTerm | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: OntologyTerm): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: OntologyTerm): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
