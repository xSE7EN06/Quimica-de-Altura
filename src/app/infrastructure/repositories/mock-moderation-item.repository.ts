import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ModerationItem } from '../../domain/models/moderation-item.entity';
import { ModerationItemRepository } from '../../domain/repositories/moderation-item.repository';

@Injectable({ providedIn: 'root' })
export class MockModerationItemRepository extends ModerationItemRepository {
    private items: ModerationItem[] = [
        {
            id: '1',
            type: 'correction',
            content: 'El matarique (Psacalium decompositum) también tiene actividad antibacteriana contra E. coli. Añadir propiedad.',
            submittedBy: 'dra.garcia@unam.mx',
            submittedAt: '2024-07-01T10:00:00',
            status: 'pending'
        },
        {
            id: '2',
            type: 'submission',
            content: 'Nueva planta: Loeselia mexicana (Espinosilla). Uso tradicional nahua para fiebre reumática. Región: Hidalgo.',
            submittedBy: 'investigador_01@ipn.mx',
            submittedAt: '2024-07-02T14:30:00',
            status: 'pending'
        },
        {
            id: '3',
            type: 'record',
            content: 'Corrección al preparado de Acuyo: la infusión no debe hervirse más de 3 minutos (degradación del eugenol).',
            submittedBy: 'etnobotanico.mx@gmail.com',
            submittedAt: '2024-06-28T09:15:00',
            status: 'approved',
            reviewedBy: 'Admin',
            reviewedAt: '2024-06-29T11:00:00',
            notes: 'Validado con referencia Argueta et al. 2020'
        },
        {
            id: '4',
            type: 'correction',
            content: 'El nombre científico de Árnica mexicana debe ser Heterotheca inuloides, no Arnica montana.',
            submittedBy: 'botanica_enes@unam.mx',
            submittedAt: '2024-06-25T16:00:00',
            status: 'approved',
            reviewedBy: 'Admin',
            reviewedAt: '2024-06-26T10:30:00'
        },
        {
            id: '5',
            type: 'submission',
            content: 'Registro etnobotánico nuevo: Comunidad Tzeltal usa Borreria laevis para tratar mordedura de alacrán.',
            submittedBy: 'campo_chiapas@cinvestav.mx',
            submittedAt: '2024-07-04T12:00:00',
            status: 'rejected',
            reviewedBy: 'Dr. Ramírez',
            reviewedAt: '2024-07-04T18:00:00',
            notes: 'Requiere documentación de campo adicional y consentimiento comunitario'
        },
        {
            id: '6',
            type: 'record',
            content: 'Actualización de disponibilidad regional: Toronjil (Agastache mexicana) disponible en Querétaro, no solo Hidalgo.',
            submittedBy: 'herbario_qro@uan.mx',
            submittedAt: '2024-07-05T08:00:00',
            status: 'pending'
        }
    ];

    getAll(): Observable<ModerationItem[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<ModerationItem | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: ModerationItem): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: ModerationItem): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
