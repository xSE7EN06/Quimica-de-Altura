import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ExternalApi } from '../../domain/models/external-api.entity';
import { ExternalApiRepository } from '../../domain/repositories/external-api.repository';

@Injectable({
    providedIn: 'root'
})
export class MockExternalApiRepository extends ExternalApiRepository {
    private apis: ExternalApi[] = [
        {
            id: '1',
            name: 'iNaturalist API',
            base_url: 'https://api.inaturalist.org/v1',
            description: 'Red social de naturalistas y científicos para compartir observaciones biológicas.',
            authType: 'None',
            rateLimit: '60 req/min',
            endpoints: [
                { id: 'e1', name: 'Get Observations', path: '/observations', method: 'GET', description: 'Search observations', isActive: true },
                { id: 'e2', name: 'Get Species', path: '/taxa', method: 'GET', description: 'Search taxa by name', isActive: true }
            ]
        },
        {
            id: '2',
            name: 'PlantNet API',
            base_url: 'https://my-api.plantnet.org/v2',
            description: 'Identificación de plantas a través de imágenes captadas por el usuario.',
            authType: 'API Key',
            rateLimit: '1 request / seg',
            endpoints: [
                { id: 'e3', name: 'Identify', path: '/identify/all', method: 'POST', description: 'Identify plant from image', isActive: true }
            ]
        },
        {
            id: '3',
            name: 'PubChem API',
            base_url: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug',
            description: 'Base de datos de moléculas químicas y sus actividades biológicas.',
            authType: 'None',
            rateLimit: '5 req/seg',
            endpoints: [
                { id: 'e4', name: 'Get Compound CID', path: '/compound/name/{name}/cids/json', method: 'GET', description: 'Get CID by name', isActive: true },
                { id: 'e5', name: 'Get Properties', path: '/compound/cid/{cid}/property/{properties}/JSON', method: 'GET', description: 'Get specific properties', isActive: true }
            ]
        },
        {
            id: '4',
            name: 'COCONUT Database',
            base_url: 'https://coconut.naturalproducts.net/api',
            description: 'Base de datos de colecciones de productos naturales de código abierto.',
            authType: 'None',
            rateLimit: 'No limit',
            endpoints: [
                { id: 'e6', name: 'Search SMILES', path: '/search/smiles', method: 'GET', description: 'Search by SMILES string', isActive: true }
            ]
        }
    ];

    getApis(): Observable<ExternalApi[]> {
        return of([...this.apis]).pipe(delay(100));
    }

    getApiById(id: string): Observable<ExternalApi | undefined> {
        const api = this.apis.find(a => a.id === id);
        return of(api).pipe(delay(300));
    }

    addApi(api: ExternalApi): Observable<void> {
        const newApi = {
            ...api,
            id: Date.now().toString()
        };
        this.apis.unshift(newApi);
        return of(undefined).pipe(delay(500));
    }

    updateApi(api: ExternalApi): Observable<void> {
        const index = this.apis.findIndex(a => a.id === api.id);
        if (index !== -1) {
            this.apis[index] = { ...api };
        }
        return of(undefined).pipe(delay(500));
    }

    deleteApi(id: string): Observable<void> {
        this.apis = this.apis.filter(a => a.id !== id);
        return of(undefined).pipe(delay(500));
    }
}
