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
        },
        {
            id: '5',
            name: 'GBIF API',
            base_url: 'https://api.gbif.org/v1',
            description: 'Global Biodiversity Information Facility - Acceso a datos de biodiversidad.',
            authType: 'Basic Auth',
            rateLimit: 'High',
            endpoints: [
                { id: 'e7', name: 'Species Search', path: '/species/search', method: 'GET', description: 'Search biological species', isActive: true },
                { id: 'e8', name: 'Occurrence Search', path: '/occurrence/search', method: 'GET', description: 'Search species occurrences', isActive: true }
            ]
        },
        {
            id: '6',
            name: 'Kew Gardens API',
            base_url: 'https://api.kew.org/v1',
            description: 'Datos botánicos del Real Jardín Botánico de Kew.',
            authType: 'API Key',
            rateLimit: '30 req/min',
            endpoints: [
                { id: 'e9', name: 'Plant Search', path: '/plants/search', method: 'GET', description: 'Search plant data', isActive: true }
            ]
        },
        {
            id: '7',
            name: 'OpenTree of Life',
            base_url: 'https://api.opentreeoflife.org/v3',
            description: 'Filogenia de la vida en la Tierra.',
            authType: 'None',
            rateLimit: 'Moderate',
            endpoints: [
                { id: 'e10', name: 'Taxonomy INFO', path: '/taxonomy/about', method: 'POST', description: 'Genetic taxonomy', isActive: true }
            ]
        },
        {
            id: '8',
            name: 'ChEMBL',
            base_url: 'https://www.ebi.ac.uk/chembl/api/data',
            description: 'Base de datos de moléculas bioactivas con propiedades tipo fármaco.',
            authType: 'None',
            rateLimit: 'Variable',
            endpoints: [
                { id: 'e11', name: 'Molecule Search', path: '/molecule/search', method: 'GET', description: 'Search molecules', isActive: true }
            ]
        },
        {
            id: '9',
            name: 'Tropicos API',
            base_url: 'https://services.tropicos.org',
            description: 'Base de datos botánica del Missouri Botanical Garden.',
            authType: 'API Key',
            rateLimit: 'Low',
            endpoints: [
                { id: 'e12', name: 'Name Search', path: '/Name/Search', method: 'GET', description: 'Search botanical names', isActive: true }
            ]
        },
        {
            id: '10',
            name: 'World Flora Online',
            base_url: 'https://list.worldfloraonline.org',
            description: 'Consorcio global para catalogar todas las plantas conocidas.',
            authType: 'None',
            rateLimit: 'Fair',
            endpoints: [
                { id: 'e13', name: 'Flora Search', path: '/search', method: 'GET', description: 'Search flora records', isActive: true }
            ]
        },
        {
            id: '11',
            name: 'USDA Plants',
            base_url: 'https://plants.usda.gov/api',
            description: 'Base de datos de plantas del Departamento de Agricultura de EE.UU.',
            authType: 'None',
            rateLimit: 'High',
            endpoints: [
                { id: 'e14', name: 'Plant Data', path: '/plants', method: 'GET', description: 'Get plant info', isActive: true }
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
