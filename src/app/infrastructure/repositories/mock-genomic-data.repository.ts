import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { GenomicData } from '../../domain/models/genomic-data.entity';
import { GenomicDataRepository } from '../../domain/repositories/genomic-data.repository';

@Injectable({ providedIn: 'root' })
export class MockGenomicDataRepository extends GenomicDataRepository {
    private items: GenomicData[] = [
        {
            id: '1',
            species: 'Acuyo (Piper auritum)',
            fastaFile: 'piper_auritum_18S.fasta',
            genbankId: 'MN456789',
            keggPathway: 'Fenilpropanoides (map00940)',
            enzymeHomology: 'PAL: 87% con Arabidopsis',
            geneCluster: 'Cluster AP-1 (6 genes)',
            blastResults: '94% identidad con P. nigrum',
            uploadedAt: '2024-03-15',
            status: 'processed'
        },
        {
            id: '2',
            species: 'Muicle (Justicia spicigera)',
            fastaFile: 'justicia_spicigera_ITS.fasta',
            genbankId: 'OR123456',
            keggPathway: 'Biosíntesis de antocianinas (map00942)',
            enzymeHomology: 'CHS: 91% con Petunia hybrida',
            geneCluster: 'Cluster JS-3 (4 genes)',
            blastResults: '89% identidad con J. brandegeeana',
            uploadedAt: '2024-04-22',
            status: 'processed'
        },
        {
            id: '3',
            species: 'Tepozán (Buddleja cordata)',
            fastaFile: 'buddleja_cordata_rbcL.fasta',
            genbankId: 'PP789012',
            keggPathway: 'Terpenoides (map00900)',
            enzymeHomology: 'TPS: 76% con Nicotiana tabacum',
            geneCluster: 'Cluster BC-2 (8 genes)',
            blastResults: '82% identidad con B. davidii',
            uploadedAt: '2024-05-10',
            status: 'pending'
        },
        {
            id: '4',
            species: 'Hierba Santa (Piper auritum var.)',
            fastaFile: 'piper_santa_matK.fasta',
            genbankId: 'QR345678',
            keggPathway: 'Metabolismo de ácidos grasos (map01212)',
            enzymeHomology: 'FatB: 83% con P. betle',
            geneCluster: 'Cluster HS-4 (5 genes)',
            blastResults: '91% identidad con P. methysticum',
            uploadedAt: '2024-06-01',
            status: 'processed'
        },
        {
            id: '5',
            species: 'Damiana (Turnera diffusa)',
            fastaFile: 'turnera_diffusa_trnH.fasta',
            genbankId: 'ST901234',
            keggPathway: 'Biosíntesis de flavonoides (map00941)',
            enzymeHomology: 'F3H: 88% con Vitis vinifera',
            geneCluster: 'Cluster TD-1 (7 genes)',
            blastResults: '85% identidad con T. subulata',
            uploadedAt: '2024-02-28',
            status: 'error'
        },
        {
            id: '6',
            species: 'Toloache (Datura stramonium)',
            fastaFile: 'datura_stramonium_ITS2.fasta',
            genbankId: 'UV567890',
            keggPathway: 'Biosíntesis de alcaloides troponicos (map01058)',
            enzymeHomology: 'TRI: 95% con D. meteloides',
            geneCluster: 'Cluster DS-6 (12 genes)',
            blastResults: '97% identidad con D. metel',
            uploadedAt: '2024-07-15',
            status: 'processed'
        }
    ];

    getAll(): Observable<GenomicData[]> {
        return of([...this.items]).pipe(delay(800));
    }

    getById(id: string): Observable<GenomicData | undefined> {
        return of(this.items.find(x => x.id === id)).pipe(delay(300));
    }

    add(item: GenomicData): Observable<void> {
        item.id = Date.now().toString();
        this.items.push(item);
        return of(void 0).pipe(delay(500));
    }

    update(item: GenomicData): Observable<void> {
        const i = this.items.findIndex(x => x.id === item.id);
        if (i > -1) this.items[i] = item;
        return of(void 0).pipe(delay(500));
    }

    delete(id: string): Observable<void> {
        this.items = this.items.filter(x => x.id !== id);
        return of(void 0).pipe(delay(500));
    }
}
